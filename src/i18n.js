import React, { createContext, useContext, useState, useEffect } from 'react';
import en from './locales/en.js';

const LanguageContext = createContext({ lang: 'en', setLang: () => { } });

// Dynamic language loader - loads only non-English languages
async function loadLanguage(lang) {
	switch (lang) {
		case 'zh':
			const { default: zh } = await import('./locales/zh.js');
			return zh;
		case 'es':
			const { default: es } = await import('./locales/es.js');
			return es;
		case 'fr':
			const { default: fr } = await import('./locales/fr.js');
			return fr;
		case 'en':
		default:
			// English is already imported, return it directly
			return en;
	}
}

// Cache for loaded language files to avoid re-importing
const languageCache = new Map();

async function getLanguage(lang) {
	if (languageCache.has(lang)) {
		return languageCache.get(lang);
	} else {
		const language = await loadLanguage(lang);
		languageCache.set(lang, language);
		return language;
	}
}

export function LanguageProvider(props) {
	const children = props.children;
	const [lang, setLang] = useState(() => {
		try { return localStorage.getItem('classABC_lang') || 'en'; } catch { return 'en'; }
	});

	useEffect(() => {
		try { localStorage.setItem('classABC_lang', lang); } catch {
			// Intentionally ignore localStorage errors
		}
	}, [lang]);

	return React.createElement(
		LanguageContext.Provider,
		{ value: { lang: lang, setLang: setLang } },
		children
	);
}

export function useTranslation() {
	const ctx = useContext(LanguageContext) || { lang: 'en', setLang: () => { } };
	
	// State for the current language translations
	const [translations, setTranslations] = useState(null);
	const [loading, setLoading] = useState(true);
	
	// Load translations when language changes
	useEffect(() => {
		let isMounted = true;
		
		async function loadTranslations() {
			setLoading(true);
			try {
				const langData = await getLanguage(ctx.lang);
				if (isMounted) {
					setTranslations(langData);
					setLoading(false);
				}
			} catch (error) {
				console.error('Failed to load translations:', error);
				// Fallback to English
				try {
					const enData = await getLanguage('en');
					if (isMounted) {
						setTranslations(enData);
						setLoading(false);
					}
				} catch (fallbackError) {
					console.error('Failed to load fallback translations:', fallbackError);
					if (isMounted) {
						setTranslations({});
						setLoading(false);
					}
				}
			}
		}
		
		loadTranslations();
		
		return () => {
			isMounted = false;
		};
	}, [ctx.lang]);
	
	// Create a translation function
	const t = (key, params = {}) => {
		if (!translations) return key;
		
		let text = translations[key] || key;
		
		// Replace placeholders with params
		Object.keys(params).forEach(param => {
			text = text.replace(new RegExp(`{${param}}`, 'g'), params[param]);
		});
		
		return text;
	};
	
	return { t, lang: ctx.lang, setLang: ctx.setLang, loading };
}

export default LanguageContext;
