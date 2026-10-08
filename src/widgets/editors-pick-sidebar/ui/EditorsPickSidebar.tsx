import { EditorsPickCard, useEditorsPicks } from "entities/editors-pick";
import { Link } from "react-router-dom";
import { SidebarCard } from "shared/ui/sidebar-card";
import { LoadingSpinner } from "shared/ui/loading-widget";

export const EditorsPickSidebar = () => {
    const { loading, editorsPicks } = useEditorsPicks();

    return (
        <SidebarCard title="👑 Выбор редакции">
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    editorsPicks.map((pick, index) => (
                        <Link
                            key={index}
                            to={pick.articleUrl}
                            style={{ textDecoration: "none" }}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <EditorsPickCard key={index} pick={pick} />
                        </Link>
                    ))
                )}
            </div>
        </SidebarCard>
    );
};
