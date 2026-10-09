import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route, Routes, type InitialEntry } from "react-router-dom";

interface ProvidersOptions {
    /** Начальный URL, например "/articles/foo?tags=a", или { pathname, state }. */
    route?: InitialEntry;
    /** Шаблон маршрута, если компоненту нужны useParams. */
    path?: string;
    queryClient?: QueryClient;
}

export const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: { retry: false, gcTime: Infinity },
            mutations: { retry: false },
        },
    });

export const createWrapper = ({
    route = "/",
    path,
    queryClient = createTestQueryClient(),
}: ProvidersOptions = {}) =>
    function Wrapper({ children }: { children: ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>
                <HelmetProvider>
                    <MemoryRouter initialEntries={[route]}>
                        {path ? (
                            <Routes>
                                <Route path={path} element={children} />
                            </Routes>
                        ) : (
                            children
                        )}
                    </MemoryRouter>
                </HelmetProvider>
            </QueryClientProvider>
        );
    };

/** render() со всеми провайдерами приложения: react-query без ретраев, роутер в памяти, Helmet. */
export const renderWithProviders = (
    ui: ReactElement,
    options: ProvidersOptions & Omit<RenderOptions, "wrapper"> = {},
) => {
    const { route, path, queryClient, ...renderOptions } = options;
    return render(ui, { wrapper: createWrapper({ route, path, queryClient }), ...renderOptions });
};
