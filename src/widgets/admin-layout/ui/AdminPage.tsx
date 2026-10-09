import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { PROJECT_NAME } from "shared/config";
import styles from "./AdminPage.module.css";

interface AdminPageProps {
    title: string;
    description?: string;
    /** Buttons on the right of the title. */
    actions?: ReactNode;
    /** "wide" for two-column editors; "narrow" for forms. */
    width?: "narrow" | "wide";
    children: ReactNode;
}

/** Common frame of an admin page: document title, page heading and content width. */
export const AdminPage = ({
    title,
    description,
    actions,
    width = "wide",
    children,
}: AdminPageProps) => (
    <div className={`${styles.page} ${styles[width]}`}>
        <Helmet>
            <title>{`${title} | ${PROJECT_NAME}`}</title>
        </Helmet>
        <header className={styles.header}>
            <div>
                <h1 className={styles.title}>{title}</h1>
                {description && <p className={styles.description}>{description}</p>}
            </div>
            {actions && <div className={styles.actions}>{actions}</div>}
        </header>
        {children}
    </div>
);
