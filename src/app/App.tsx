import { HashRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { ScrollToTop } from "app/router/ScrollToTop";
import { QueryProvider } from "app/providers/QueryProvider";
import { SessionProvider } from "entities/session";
import { AppRouter } from "app/router/AppRouter";
import "app/styles/theme.css";

export const App = () => {
    return (
        <QueryProvider>
            <HelmetProvider>
                <SessionProvider>
                    <Router>
                        <ScrollToTop />
                        <AppRouter />
                        <Toaster />
                    </Router>
                </SessionProvider>
            </HelmetProvider>
        </QueryProvider>
    );
};
