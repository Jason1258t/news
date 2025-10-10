import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchArticleBySlug } from '../api/articles-api';

/**
 * Хук для получения конкретной статьи
 * Сначала проверяет кеш, потом загружает из API
 */
export const useArticle = (slug) => {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['articles', slug],
    queryFn: () => fetchArticleBySlug(slug),
    staleTime: 10 * 60 * 1000,
    
    initialData: () => {
      const cachedArticles = queryClient.getQueryData(['articles']);
      if (cachedArticles) {
        return cachedArticles.find(article => article.slug === slug);
      }
      return undefined;
    },
    
    initialDataUpdatedAt: () => {
      const cachedArticles = queryClient.getQueryData(['articles']);
      return cachedArticles ? queryClient.getQueryState(['articles'])?.dataUpdatedAt : 0;
    },
  });
};

/**
 * Хук для предзагрузки статьи
 */
export const usePrefetchArticle = () => {
  const queryClient = useQueryClient();
  
  return (slug) => {
    queryClient.prefetchQuery({
      queryKey: ['articles', slug],
      queryFn: () => fetchArticleBySlug(slug),
      staleTime: 10 * 60 * 1000,
    });
  };
};