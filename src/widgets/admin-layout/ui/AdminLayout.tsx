import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { LoadingWidget } from "shared/ui/loading-widget";
import { AdminSidebar } from "./AdminSidebar";
import styles from "./AdminLayout.module.css";

export const AdminLayout = () => {
    return (
        <div className={styles.layout}>
            {/* The column carries the background so it spans long pages; the sidebar inside sticks. */}
            <div className={styles.sidebarColumn}>
                <AdminSidebar />
            </div>
            <main className={styles.content}>
                <Suspense fallback={<LoadingWidget />}>
                    <Outlet />
                </Suspense>
            </main>
        </div>
    );
};
