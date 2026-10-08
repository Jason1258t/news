import { Link } from "react-router-dom";
import { EditorsPickCard, useEditorsPicks } from "entities/editors-pick";
import { LoadingSpinner } from "shared/ui/loading-widget";
import { SidebarCard } from "shared/ui/sidebar-card";
import styles from "./EditorsPickSidebar.module.css";

export const EditorsPickSidebar = () => {
    const { data: editorsPicks = [], isLoading } = useEditorsPicks();

    return (
        <SidebarCard title="👑 Выбор редакции">
            <div className={styles.list}>
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    editorsPicks.map((pick) => (
                        <Link
                            key={pick.id}
                            to={pick.articleUrl}
                            className={styles.link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <EditorsPickCard pick={pick} />
                        </Link>
                    ))
                )}
            </div>
        </SidebarCard>
    );
};
