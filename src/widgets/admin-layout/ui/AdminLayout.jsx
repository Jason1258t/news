import { Routes, Route } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import CreateArticlePage from "pages/admin-create-article/CreateArticlePage";
import EditorsPickPanel from "pages/admin-editors-pick/EditorsPickPage";
import styles from "./AdminLayout.module.css";
import { Navigate } from "react-router-dom";
import ArticlesPanel from "pages/admin-articles/ArticlesPanelPage";
import StudioPage from "pages/admin-studio/StudioPage";

const AdminPage = () => {
    return (
        <div className={styles.layout}>
            <AdminSidebar />
            <main className={styles.content}>
                <Routes>
                    <Route index element={<Navigate to="/admin/create-article" replace />} />
                    <Route path="create-article" element={<CreateArticlePage />} />
                    <Route path="editors-pick" element={<EditorsPickPanel />} />
                    <Route path="articles-panel" element={<ArticlesPanel />} />
                    <Route path="studio" element={<StudioPage />} />
                </Routes>
            </main>
        </div>
    );
};

export default AdminPage;
