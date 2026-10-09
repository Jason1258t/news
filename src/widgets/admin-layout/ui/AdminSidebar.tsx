import {
    ArrowLeft,
    FilePlus2,
    ListTodo,
    LogOut,
    Newspaper,
    Star,
    type LucideIcon,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSession } from "entities/session";
import { authApi } from "features/auth";
import logo from "shared/assets/logo.jpg";
import { PROJECT_NAME } from "shared/config";
import styles from "./AdminSidebar.module.css";

const NAV: Array<{ to: string; label: string; icon: LucideIcon }> = [
    { to: "/admin/create-article", label: "Создать статью", icon: FilePlus2 },
    { to: "/admin/articles-panel", label: "Управление статьями", icon: Newspaper },
    { to: "/admin/editors-pick", label: "Выбор редакции", icon: Star },
    { to: "/admin/studio", label: "Студия", icon: ListTodo },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

export const AdminSidebar = () => {
    const navigate = useNavigate();
    const { user } = useSession();
    const email = user?.email ?? "";

    const handleLogout = async () => {
        await authApi.logout();
        navigate("/login");
    };

    return (
        <aside className={styles.sidebar}>
            <Link to="/admin" className={styles.brand}>
                <img src={logo} alt="" className={styles.logo} />
                <span>
                    <span className={styles.brandTitle}>{PROJECT_NAME}</span>
                    <span className={styles.brandCaption}>Админ-панель</span>
                </span>
            </Link>

            <nav className={styles.nav} aria-label="Разделы админки">
                {NAV.map(({ to, label, icon: Icon }) => (
                    <NavLink key={to} to={to} className={navLinkClass}>
                        <Icon className={styles.icon} aria-hidden="true" />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className={styles.footer}>
                <Link to="/" className={styles.link}>
                    <ArrowLeft className={styles.icon} aria-hidden="true" />
                    <span>На главную</span>
                </Link>
                <div className={styles.user}>
                    <span className={styles.avatar} aria-hidden="true">
                        {email.charAt(0).toUpperCase() || "?"}
                    </span>
                    <span className={styles.email} title={email}>
                        {email}
                    </span>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className={styles.logout}
                        aria-label="Выйти"
                        title="Выйти"
                    >
                        <LogOut className={styles.icon} aria-hidden="true" />
                    </button>
                </div>
            </div>
        </aside>
    );
};
