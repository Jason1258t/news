import { Link } from "react-router-dom";
import { EditorsPickCard, useEditorsPicks } from "entities/editors-pick";
import { LoadingSpinner } from "shared/ui/loading-widget";
import { SidebarCard } from "shared/ui/sidebar-card";

export const EditorsPickSidebar = () => {
    const { data: editorsPicks = [], isLoading } = useEditorsPicks();

    return (
        <SidebarCard title="👑 Выбор редакции">
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    editorsPicks.map((pick) => (
                        <Link
                            key={pick.id}
                            to={pick.articleUrl}
                            style={{ textDecoration: "none" }}
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
