import { Routes, Route } from "react-router-dom";
import Header from "widgets/Header";
import Footer from "widgets/Footer";
import HomePage from "pages/Home";
import Article from "pages/Article";
import AboutPage from "pages/About";
import LoginPage from "pages/Login";
import AdminPage from "pages/admin";
import HoroscopePage from "pages/horoscope/HoroscopePage";
import ProtectedRoute from "features/auth/ui/protected-route";

const AppRoutes = () => {
    return (
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
            <Route
                path="/horoscope"
                element={
                    <>
                        <Header />
                        <HoroscopePage />
                        <Footer />
                    </>
                }
            />
            <Route
                path="/horoscope/:id"
                element={
                    <>
                        <Header />
                        <HoroscopePage />
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
    );
};

export default AppRoutes;
