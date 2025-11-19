import { HashRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./shared/lib/ScrollToTop";
import { QueryProvider } from "app/query/QueryProvider";
import { AuthProvider } from "features/auth/ui/auth-provider";
import AppRoutes from "app/Router";
import "app/theme.css";
import "app/layout.css";

const App = () => {
    return (
        <QueryProvider>
            <HelmetProvider>
                <AuthProvider>
                    <Router>
                        <ScrollToTop />
                        <AppRoutes />
                    </Router>
                </AuthProvider>
            </HelmetProvider>
        </QueryProvider>
    );
};

export default App;
