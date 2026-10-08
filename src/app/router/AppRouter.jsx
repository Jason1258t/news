import { Routes, Route, Outlet } from "react-router-dom";
import HomePage from "pages/home/HomePage";
import Article from "pages/article/ArticlePage";
import AboutPage from "pages/about/AboutPage";
import LoginPage from "pages/login/LoginPage";
import AdminPage from "widgets/admin-layout/ui/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

import Header from "widgets/header/ui/Header";
import Footer from "widgets/footer/ui/Footer";

const Layout = () => {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Все публичные страницы с общим лейаутом */}
            <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/articles/:slug" element={<Article />} />
            </Route>

            {/* Страницы без лейаута */}
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
