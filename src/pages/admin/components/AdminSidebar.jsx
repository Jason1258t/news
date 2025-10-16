import { NavLink, useNavigate } from "react-router-dom";
import { authApi } from "features/auth/api/auth-api";
import { useAuth } from "features/auth/hooks/useAuth";
import styles from "./AdminSidebar.module.css";

const AdminSidebar = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleLogout = async () => {
        await authApi.logout();
        navigate("/login");
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <h2 className={styles.title}>Админ-панель</h2>
                <p className={styles.user}>{user?.email}</p>
            </div>

            <nav className={styles.nav}>
                <NavLink
                    to="/admin/create-article"
                    className={({ isActive }) =>
                        isActive
                            ? `${styles.link} ${styles.active}`
                            : styles.link
                    }
                >
                    Создать статью
                </NavLink>
                <NavLink
                    to="/admin/editors-pick"
                    className={({ isActive }) =>
                        isActive
                            ? `${styles.link} ${styles.active}`
                            : styles.link
                    }
                >
                    Выбор редакции
                </NavLink>
            </nav>

            <button onClick={handleLogout} className={styles.logout}>
                Выйти
            </button>
        </aside>
    );
};

export default AdminSidebar;
