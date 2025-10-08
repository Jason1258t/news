// hooks/useMetaTags.js
import { useEffect } from 'react';

export const useMetaTags = (article) => {
  useEffect(() => {
    if (!article) return;

    // Обновляем title
    document.title = `${article.title} | ПГТУ Breaking NEWS`;

    // Функция для обновления meta-тегов
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

    const fullUrl = `https://jason1258t.github.io/news/${article.slug}`;
    const imageUrl = `https://jason1258t.github.io/news/${article.hero.url}`;

    // Обновляем все мета-теги
    updateMetaTag('description', article.description);
    updateMetaTag('keywords', article.tags.join(', '));
    updateMetaTag('author', article.author);
    
    // Open Graph
    updateMetaTag('og:title', article.og?.title || article.title, true);
    updateMetaTag('og:description', article.og?.description || article.description, true);
    updateMetaTag('og:type', 'article', true);
    updateMetaTag('og:url', article.og?.url || fullUrl, true);
    updateMetaTag('og:image', article.og?.image || imageUrl, true);
    updateMetaTag('og:site_name', 'ПГТУ Breaking NEWS', true);
    
    // Twitter
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', article.og?.title || article.title, true);
    updateMetaTag('twitter:description', article.og?.description || article.description, true);
    updateMetaTag('twitter:image', article.og?.image || imageUrl, true);

  }, [article]);
};