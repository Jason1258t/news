import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { LoadingWidget } from "shared/ui/loading-widget";
import { AdminSidebar } from "./AdminSidebar";
import styles from "./AdminLayout.module.css";

export const AdminLayout = () => {
    return (
        <div className={styles.layout}>
            <AdminSidebar />
            <main className={styles.content}>
                <Suspense fallback={<LoadingWidget />}>
                    <Outlet />
                </Suspense>
            </main>
        </div>
    );
};
