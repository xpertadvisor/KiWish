# KiWish Internationalization (i18n) Guide

This document outlines the internationalization system implemented for the KiWish project and provides guidelines for managing translations and adding new languages.

## Overview

The i18n system is a lightweight, client-side solution built with vanilla JavaScript. It supports dynamic language switching without page reloads and persists user preferences using `localStorage`.

### Key Features
- **Supported Languages**: English (en), Thai (th), Simplified Chinese (zh), Malay (ms).
- **Dynamic Switching**: Updates text content instantly.
- **Persistence**: Remembers the last selected language.
- **Fallback**: Defaults to English if a translation is missing.

## File Structure

- **`js/translations.js`**: Contains all translation strings for all supported languages.
- **`js/i18n.js`**: Handles the logic for language detection, switching, and updating the DOM.
- **`index.html`**: The main HTML file with `data-i18n` attributes marking translatable content.

## How to Add a New Language

To add support for a new language (e.g., Japanese `ja`), follow these steps:

1.  **Update `js/i18n.js`**:
    - Add the language code to the `supportedLanguages` array.
    - Add the language name to the `languageNames` object.

    ```javascript
    const supportedLanguages = ['en', 'th', 'zh', 'ms', 'ja']; // Added 'ja'
    const languageNames = {
        en: 'English',
        th: 'ไทย',
        zh: '简体中文',
        ms: 'Bahasa Melayu',
        ja: '日本語' // Added Japanese
    };
    ```

2.  **Update `js/translations.js`**:
    - Add a new key for the language code (`ja`) to the `translations` object.
    - Copy the structure from `en` and translate the values.

    ```javascript
    const translations = {
        en: { ... },
        th: { ... },
        zh: { ... },
        ms: { ... },
        ja: {
            nav: {
                benefits: "利点",
                // ... other translations
            },
            // ... other sections
        }
    };
    ```

## How to Add New Text Content

When adding new text to the website:

1.  **Add `data-i18n` Attribute**:
    - In your HTML, add the `data-i18n` attribute to the element containing the text. Use a dot notation for nested keys (e.g., `section.key`).

    ```html
    <p data-i18n="new_section.description">Default English Text</p>
    ```

2.  **Add Translations**:
    - Add the new key and translation to **all** language objects in `js/translations.js`.

    ```javascript
    const translations = {
        en: {
            // ...
            new_section: {
                description: "This is a new section."
            }
        },
        // Repeat for th, zh, ms...
    };
    ```

## Verification

After making changes:
1.  Open `index.html` in a browser.
2.  Use the language selector in the navigation bar to switch to the new language.
3.  Verify that all text updates correctly.
4.  Check the browser console for any errors.
