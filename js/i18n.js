document.addEventListener('DOMContentLoaded', () => {
    const supportedLanguages = ['en', 'th', 'zh'];
    const defaultLanguage = 'en';
    const languageNames = {
        en: 'English',
        th: 'ไทย',
        zh: '简体中文'
    };

    // WhatsApp numbers for each language
    const whatsappNumbers = {
        en: '60105389981',
        th: '660985591088', // Update with Thai number
        zh: '60105389981', // Update with Chinese number
        ms: '60105389981'  // Update with Malay number
    };

    // 1. Determine current language
    let currentLanguage = localStorage.getItem('kiwish_language');
    if (!currentLanguage) {
        const browserLang = navigator.language.split('-')[0];
        currentLanguage = supportedLanguages.includes(browserLang) ? browserLang : defaultLanguage;
    }

    // 2. Function to update texts
    function updateTexts(lang) {
        const texts = window.translations[lang];
        if (!texts) return;

        document.documentElement.lang = lang;
        
        // Update direction if needed (all current are LTR)
        document.documentElement.dir = 'ltr';

        // Helper to access nested properties
        const getNestedValue = (obj, path) => {
            return path.split('.').reduce((prev, curr) => prev ? prev[curr] : null, obj);
        };

        // Find all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = getNestedValue(texts, key);
            
            if (translation) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translation;
                } else if (el.tagName === 'IMG') {
                    el.alt = translation;
                } else {
                    el.textContent = translation;
                }
            } else {
                // Fallback to English if translation missing
                const fallback = getNestedValue(window.translations['en'], key);
                if (fallback) {
                    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                        el.placeholder = fallback;
                    } else if (el.tagName === 'IMG') {
                        el.alt = fallback;
                    } else {
                        el.textContent = fallback;
                    }
                }
            }
        });

        // Update WhatsApp links based on language
        const waNumber = whatsappNumbers[lang] || whatsappNumbers['en'];
        const waLinks = document.querySelectorAll('a[href^="https://wa.me/"]');
        waLinks.forEach(link => {
            // Preserve any existing query parameters if needed, but for now simple replacement
            link.href = `https://wa.me/${waNumber}`;
        });

        // Save preference
        localStorage.setItem('kiwish_language', lang);
        currentLanguage = lang;

        // Update selector UI
        updateSelectorUI(lang);
    }

    // 3. Create and inject language selector
    function createLanguageSelector() {
        const navContainer = document.querySelector('nav .max-w-7xl');
        if (!navContainer) return;

        const selectorContainer = document.createElement('div');
        selectorContainer.className = 'relative ml-4 z-50';
        
        const button = document.createElement('button');
        button.className = 'flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 transition-colors text-sm font-medium text-stone-700 focus:outline-none';
        button.innerHTML = `
            <i data-lucide="globe" class="w-4 h-4"></i>
            <span id="current-lang-name">${languageNames[currentLanguage]}</span>
            <i data-lucide="chevron-down" class="w-4 h-4"></i>
        `;
        
        const dropdown = document.createElement('div');
        dropdown.className = 'absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-stone-100 py-1 hidden transform opacity-0 scale-95 transition-all duration-200 origin-top-right';
        
        supportedLanguages.forEach(lang => {
            const item = document.createElement('button');
            item.className = `w-full text-left px-4 py-2 text-sm hover:bg-kiwi-50 transition-colors flex items-center justify-between ${lang === currentLanguage ? 'text-kiwi-600 font-bold bg-kiwi-50' : 'text-stone-600'}`;
            item.innerHTML = `
                ${languageNames[lang]}
                ${lang === currentLanguage ? '<i data-lucide="check" class="w-4 h-4"></i>' : ''}
            `;
            item.onclick = () => {
                updateTexts(lang);
                toggleDropdown(false);
            };
            dropdown.appendChild(item);
        });

        function toggleDropdown(show) {
            if (show) {
                dropdown.classList.remove('hidden');
                // Small delay to allow transition
                setTimeout(() => {
                    dropdown.classList.remove('opacity-0', 'scale-95');
                    dropdown.classList.add('opacity-100', 'scale-100');
                }, 10);
            } else {
                dropdown.classList.remove('opacity-100', 'scale-100');
                dropdown.classList.add('opacity-0', 'scale-95');
                setTimeout(() => {
                    dropdown.classList.add('hidden');
                }, 200);
            }
        }

        button.onclick = (e) => {
            e.stopPropagation();
            const isHidden = dropdown.classList.contains('hidden');
            toggleDropdown(isHidden);
        };

        document.addEventListener('click', () => {
            toggleDropdown(false);
        });

        dropdown.onclick = (e) => e.stopPropagation();

        selectorContainer.appendChild(button);
        selectorContainer.appendChild(dropdown);

        // Insert before the "Order Now" button container or at the end
        const orderBtnContainer = document.querySelector('nav .flex.items-center.gap-4');
        if (orderBtnContainer) {
            orderBtnContainer.parentElement.insertBefore(selectorContainer, orderBtnContainer);
        } else {
            navContainer.appendChild(selectorContainer);
        }

        // Re-initialize icons for the new elements
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    function updateSelectorUI(lang) {
        const langNameSpan = document.getElementById('current-lang-name');
        if (langNameSpan) {
            langNameSpan.textContent = languageNames[lang];
        }
        
        // Re-render dropdown items to update active state
        const dropdown = document.querySelector('.relative.ml-4.z-50 div'); // Simple selection
        if (dropdown) {
            dropdown.innerHTML = '';
            supportedLanguages.forEach(l => {
                const item = document.createElement('button');
                item.className = `w-full text-left px-4 py-2 text-sm hover:bg-kiwi-50 transition-colors flex items-center justify-between ${l === lang ? 'text-kiwi-600 font-bold bg-kiwi-50' : 'text-stone-600'}`;
                item.innerHTML = `
                    ${languageNames[l]}
                    ${l === lang ? '<i data-lucide="check" class="w-4 h-4"></i>' : ''}
                `;
                item.onclick = () => {
                    updateTexts(l);
                    // Hide dropdown logic
                    dropdown.classList.remove('opacity-100', 'scale-100');
                    dropdown.classList.add('opacity-0', 'scale-95');
                    setTimeout(() => {
                        dropdown.classList.add('hidden');
                    }, 200);
                };
                dropdown.appendChild(item);
            });
            if (window.lucide) {
                lucide.createIcons();
            }
        }
    }

    // Initialize
    createLanguageSelector();
    updateTexts(currentLanguage);
});
