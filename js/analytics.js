// Google Analytics Event Tracking for KiWish Website

document.addEventListener('DOMContentLoaded', () => {
    
    // Track page view with language information
    const currentLang = localStorage.getItem('kiwish_language') || 'en';
    gtag('event', 'page_view', {
        'page_title': document.title,
        'page_location': window.location.href,
        'page_path': window.location.pathname,
        'language': currentLang
    });

    // Track WhatsApp order clicks
    const whatsappLinks = document.querySelectorAll('a[href^="https://wa.me/"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Track as lead generation
            gtag('event', 'generate_lead', {
                'event_category': 'engagement',
                'event_label': 'whatsapp_order',
                'value': 1,
                'language': currentLang
            });
            
            // Track specific WhatsApp order event
            gtag('event', 'whatsapp_order', {
                'language': currentLang,
                'button_text': link.textContent.trim() || 'Order Now'
            });
            
            console.log('Analytics: WhatsApp order click tracked for language:', currentLang);
        });
    });

    // Track video plays
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach(video => {
        video.addEventListener('play', () => {
            gtag('event', 'video_start', {
                'video_title': video.src.split('/').pop() || 'product_video',
                'language': currentLang
            });
            console.log('Analytics: Video play tracked');
        });
        
        // Track video completion
        video.addEventListener('ended', () => {
            gtag('event', 'video_complete', {
                'video_title': video.src.split('/').pop() || 'product_video',
                'language': currentLang
            });
            console.log('Analytics: Video completion tracked');
        });
    });

    // Track button clicks (CTA buttons)
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const buttonText = button.textContent.trim();
            
            // Track key CTA buttons
            if (buttonText.includes('Start Your Journey') || 
                buttonText.includes('เริ่มต้นการเดินทางของคุณ') ||
                buttonText.includes('开启健康之旅') ||
                buttonText.includes('Mulakan Perjalanan Anda')) {
                
                gtag('event', 'click', {
                    'event_category': 'cta_button',
                    'event_label': 'start_journey',
                    'value': 1,
                    'language': currentLang
                });
                console.log('Analytics: Start Journey button click tracked');
            }
            
            // Track Watch Video button
            if (buttonText.includes('Watch Video') || 
                buttonText.includes('ดูวิดีโอ') ||
                buttonText.includes('观看视频') ||
                buttonText.includes('Tonton Video')) {
                
                gtag('event', 'click', {
                    'event_category': 'cta_button',
                    'event_label': 'watch_video',
                    'value': 1,
                    'language': currentLang
                });
                console.log('Analytics: Watch Video button click tracked');
            }
            
            // Track Order Now buttons
            if (buttonText.includes('Order Now') || 
                buttonText.includes('สั่งซื้อเลย') ||
                buttonText.includes('立即订购') ||
                buttonText.includes('Pesan Sekarang')) {
                
                gtag('event', 'click', {
                    'event_category': 'cta_button',
                    'event_label': 'order_now',
                    'value': 1,
                    'language': currentLang
                });
                console.log('Analytics: Order Now button click tracked');
            }
        });
    });

    // Track FAQ interactions
    const faqElements = document.querySelectorAll('[data-i18n^="faq.q"]');
    faqElements.forEach(element => {
        element.addEventListener('click', () => {
            const faqKey = element.getAttribute('data-i18n');
            gtag('event', 'faq_interaction', {
                'faq_question': faqKey,
                'language': currentLang
            });
            console.log('Analytics: FAQ interaction tracked:', faqKey);
        });
    });

    // Track navigation clicks
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const sectionId = link.getAttribute('href').substring(1);
            gtag('event', 'navigation_click', {
                'destination_section': sectionId,
                'language': currentLang
            });
            console.log('Analytics: Navigation click tracked to section:', sectionId);
        });
    });

    // Track scroll depth
    let maxScroll = 0;
    const scrollMilestones = [25, 50, 75, 90];
    const trackedMilestones = new Set();
    
    window.addEventListener('scroll', () => {
        const scrollHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = scrollHeight > 0 ? Math.round((window.scrollY / scrollHeight) * 100) : 0;
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            // Track scroll milestones
            scrollMilestones.forEach(milestone => {
                if (maxScroll >= milestone && !trackedMilestones.has(milestone)) {
                    trackedMilestones.add(milestone);
                    gtag('event', 'scroll', {
                        'percent_scrolled': milestone,
                        'language': currentLang
                    });
                    console.log(`Analytics: Scroll ${milestone}% tracked`);
                }
            });
        }
    });

    // Track language changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
                const newLang = document.documentElement.lang;
                if (newLang !== currentLang) {
                    gtag('event', 'language_change', {
                        'from_language': currentLang,
                        'to_language': newLang
                    });
                    console.log('Analytics: Language change tracked from', currentLang, 'to', newLang);
                }
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['lang']
    });

    console.log('Google Analytics tracking initialized for KiWish website');
});