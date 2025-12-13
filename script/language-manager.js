// script/language-manager.js

const LANG_MAP = {
    ES: 'es',
    ENG: 'eng',
    UA: 'ua',
    FR: 'fr'
};

let translations = {};
let currentLang = 'es';

async function loadTranslations() {
    try {
        const res = await fetch('translations.json');
        translations = await res.json();
    } catch (e) {
        console.error('Error cargando translations.json', e);
    }
}

function applyTranslations() {
    if (!translations[currentLang]) {
        console.warn('No hay traducciones para', currentLang);
        return;
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const path = el.getAttribute('data-i18n');    // p.e. "home.tagline"
        if (!path) return;

        const parts = path.split('.');
        if (parts.length !== 2) return;

        const [section, key] = parts;
        const tSection = translations[currentLang][section];
        if (!tSection) return;

        const value = tSection[key];
        if (typeof value === 'undefined') return;

        // Para la mayoría de casos te vale textContent
        el.textContent = value;
    });

      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const [section, key] = el.getAttribute('data-i18n-placeholder').split('.');
    const sec = translations[currentLang][section];
    if (sec && sec[key] !== undefined) el.placeholder = sec[key];
  });
}

function initLanguageSelector() {
    const select = document.getElementById('lang');
    if (!select) return;

    // Recuperar idioma guardado o español por defecto
    const saved = localStorage.getItem('lang') || 'es';

    // Ajustar el value del select según el mapa inverso
    const invMap = Object.fromEntries(
        Object.entries(LANG_MAP).map(([k, v]) => [v, k])
    );
    const selectValue = invMap[saved] || 'ES';
    select.value = selectValue;

    currentLang = saved;
    applyTranslations();

    select.addEventListener('change', e => {
        const raw = e.target.value;      // ES | ENG | UA | FR
        const lang = LANG_MAP[raw] || 'es';
        currentLang = lang;
        localStorage.setItem('lang', lang);
        applyTranslations();
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadTranslations();
    initLanguageSelector();
});
