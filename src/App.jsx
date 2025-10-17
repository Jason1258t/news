import Header from "widgets/Header";
import Footer from "widgets/Footer";
import HomePage from "pages/Home";
import Article from "pages/Article";
import AboutPage from "pages/About";
import LoginPage from "pages/Login";
import AdminPage from "pages/admin";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./shared/lib/ScrollToTop";
import { QueryProvider } from "app/query/QueryProvider";
import { AuthProvider } from "features/auth/ui/auth-provider";
import ProtectedRoute from "features/auth/ui/protected-route";
import "app/theme.css";
import "app/layout.css";

const App = () => {
    return (
        <QueryProvider>
            <HelmetProvider>
                <AuthProvider>
                    <Router>
                        <ScrollToTop />
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <>
                                        <Header />
                                        <HomePage />
                                        <Footer />
                                    </>
                                }
                            />
                            <Route
                                path="/about"
                                element={
                                    <>
                                        <Header />
                                        <AboutPage />
                                        <Footer />
                                    </>
                                }
                            />
                            <Route
                                path="/articles/:slug"
                                element={
                                    <>
                                        <Header />
                                        <Article />
                                        <Footer />
                                    </>
                                }
                            />

                            <Route path="/login" element={<LoginPage />} />

                            <Route
                                path="/admin/*"
                                element={
                                    <ProtectedRoute>
                                        <AdminPage />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </Router>
                </AuthProvider>
            </HelmetProvider>
        </QueryProvider>
    );
};

export default App;
