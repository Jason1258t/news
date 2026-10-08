import { HashRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "app/router/ScrollToTop";
import { QueryProvider } from "app/providers/QueryProvider";
import { AuthProvider } from "entities/session/model/SessionProvider";
import AppRoutes from "app/router/AppRouter";
import "app/styles/theme.css";

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
