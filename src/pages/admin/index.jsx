import { Routes, Route } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";
import CreateArticlePage from "pages/CreateArticle";
import EditorsPickPanel from "pages/EditorsPickPanel";
import styles from "./AdminLayout.module.css";
import { Navigate } from "react-router-dom";

const AdminPage = () => {
    return (
        <div className={styles.layout}>
            <AdminSidebar />
            <main className={styles.content}>
                <Routes>
                   <Route 
                        index 
                        element={<Navigate to="/admin/create-article" replace />} 
                    />
                    <Route
                        path="create-article"
                        element={<CreateArticlePage />}
                    />
                    <Route path="editors-pick" element={<EditorsPickPanel />} />
                </Routes>
            </main>
        </div>
    );
};

export default AdminPage;
