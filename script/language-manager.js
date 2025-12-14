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
        // Si translations.json está en la RAÍZ, deja '../translations.json'
        // Si está en script/, usa 'translations.json'
        const res = await fetch('./translations.json');
        if (!res.ok) throw new Error('No se encontró translations.json');
        translations = await res.json();
        console.log('✓ Traducciones cargadas exitosamente:', Object.keys(translations));
    } catch (e) {
        console.error('❌ Error cargando translations.json:', e);
    }
}

function applyTranslations() {
    if (!translations[currentLang]) {
        console.warn('⚠️ No hay traducciones para', currentLang);
        return;
    }

    // Traducciones de texto
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const path = el.getAttribute('data-i18n');    // p.e. "home.tagline"
        if (!path) return;

        const parts = path.split('.');
        if (parts.length !== 2) {
            console.warn('⚠️ Formato inválido de data-i18n:', path);
            return;
        }

        const [section, key] = parts;
        const tSection = translations[currentLang][section];
        if (!tSection) {
            console.warn(`⚠️ Sección no encontrada: ${section}`);
            return;
        }

        const value = tSection[key];
        if (typeof value === 'undefined') {
            console.warn(`⚠️ Clave no encontrada: ${section}.${key}`);
            return;
        }

        el.textContent = value;
    });

    // Traducciones de placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const path = el.getAttribute('data-i18n-placeholder');
        if (!path) return;

        const parts = path.split('.');
        if (parts.length !== 2) return;

        const [section, key] = parts;
        const sec = translations[currentLang][section];
        if (sec && sec[key] !== undefined) {
            el.placeholder = sec[key];
        }
    });
}

function initLanguageSelector() {
    const select = document.getElementById('lang');
    if (!select) {
        console.error('❌ Elemento #lang no encontrado');
        return;
    }

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

    // Listener para cambios de idioma
    select.addEventListener('change', e => {
        const raw = e.target.value;      // ES | ENG | UA | FR
        const lang = LANG_MAP[raw] || 'es';
        currentLang = lang;
        localStorage.setItem('lang', lang);
        applyTranslations();
        console.log(`✓ Idioma cambiado a: ${lang}`);
    });
}

// Cargar traducciones ANTES de aplicarlas
document.addEventListener('DOMContentLoaded', async () => {
    await loadTranslations();
    initLanguageSelector();
});
