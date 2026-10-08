import { NavLink, useNavigate } from "react-router-dom";
import { useSession } from "entities/session";
import { authApi } from "features/auth";
import { OutlinedButton } from "shared/ui/button";
import styles from "./AdminSidebar.module.css";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

export const AdminSidebar = () => {
    const navigate = useNavigate();
    const { user } = useSession();

    const handleLogout = async () => {
        await authApi.logout();
        navigate("/login");
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <h2 className={styles.title}>Админ-панель</h2>
                <p className={styles.user} style={{ marginBottom: 12 }}>
                    {user?.email}
                </p>

                <OutlinedButton onClick={() => navigate("/")}>На главную</OutlinedButton>
            </div>

            <nav className={styles.nav}>
                <NavLink to="/admin/create-article" className={navLinkClass}>
                    Создать статью
                </NavLink>
                <NavLink to="/admin/articles-panel" className={navLinkClass}>
                    Управление статьями
                </NavLink>
                <NavLink to="/admin/editors-pick" className={navLinkClass}>
                    Выбор редакции
                </NavLink>

                <NavLink to="/admin/studio" className={navLinkClass}>
                    Студия
                </NavLink>
            </nav>

            <button onClick={handleLogout} className={styles.logout}>
                Выйти
            </button>
        </aside>
    );
};
