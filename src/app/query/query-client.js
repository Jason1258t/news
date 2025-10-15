import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 минут
      cacheTime: 30 * 60 * 1000, // 30 минут
      refetchOnWindowFocus: false,
    },
  },
});