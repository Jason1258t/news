// hooks/useMetaTags.js
import { useEffect } from 'react';

export const useMetaTags = (metaData) => {
    useEffect(() => {
        document.title = metaData.title;

        const updateMetaTag = (name, content, property = false) => {
            let meta = document.querySelector(
                property 
                    ? `meta[property="${name}"]` 
                    : `meta[name="${name}"]`
            );
            
            if (!meta) {
                meta = document.createElement('meta');
                if (property) {
                    meta.setAttribute('property', name);
                } else {
                    meta.setAttribute('name', name);
                }
                document.head.appendChild(meta);
            }
            
            meta.setAttribute('content', content);
        };

        // Основные meta
        updateMetaTag('description', metaData.description);
        updateMetaTag('keywords', metaData.keywords);
        updateMetaTag('author', metaData.author);

        // Open Graph
        updateMetaTag('og:title', metaData.title, true);
        updateMetaTag('og:description', metaData.description, true);
        updateMetaTag('og:type', 'website', true);
        updateMetaTag('og:url', metaData.url, true);
        updateMetaTag('og:image', metaData.image, true);
        updateMetaTag('og:site_name', metaData.siteName, true);
        updateMetaTag('og:locale', 'ru_RU', true);

        // Twitter
        updateMetaTag('twitter:card', 'summary_large_image', true);
        updateMetaTag('twitter:title', metaData.title, true);
        updateMetaTag('twitter:description', metaData.description, true);
        updateMetaTag('twitter:image', metaData.image, true);

        // Canonical
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', metaData.url);

    }, [metaData]);
};