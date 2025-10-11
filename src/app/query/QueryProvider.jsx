// app/providers/query-client.jsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './query-client';

export const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};