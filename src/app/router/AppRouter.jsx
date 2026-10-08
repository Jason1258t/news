import { lazy } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AboutPage } from "pages/about";
import { ArticlePage } from "pages/article";
import { HomePage } from "pages/home";
import { LoginPage } from "pages/login";
import { AdminLayout } from "widgets/admin-layout";
import { Footer } from "widgets/footer";
import { Header } from "widgets/header";
import { ProtectedRoute } from "./ProtectedRoute";

/** React.lazy для модулей с именованным экспортом. */
const lazyNamed = (load, name) => lazy(() => load().then((module) => ({ default: module[name] })));

// Админка грузится отдельным чанком: читателям она не нужна.
const CreateArticlePage = lazyNamed(
    () => import("pages/admin-create-article"),
    "CreateArticlePage",
);
const ArticlesPanelPage = lazyNamed(() => import("pages/admin-articles"), "ArticlesPanelPage");
const EditorsPickPage = lazyNamed(() => import("pages/admin-editors-pick"), "EditorsPickPage");
const StudioPage = lazyNamed(() => import("pages/admin-studio"), "StudioPage");

const PublicLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
};

export const AppRouter = () => {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/articles/:slug" element={<ArticlePage />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="/admin/create-article" replace />} />
                <Route path="create-article" element={<CreateArticlePage />} />
                <Route path="articles-panel" element={<ArticlesPanelPage />} />
                <Route path="editors-pick" element={<EditorsPickPage />} />
                <Route path="studio" element={<StudioPage />} />
            </Route>
        </Routes>
    );
};
