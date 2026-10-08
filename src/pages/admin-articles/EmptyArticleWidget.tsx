import { FileText } from "lucide-react";
import styles from "./EmptyArticleWidget.module.css";

export const EmptyArticleWidget = () => {
    return (
        <div className={styles.empty}>
            <FileText size={48} className={styles.icon} />
            <p className={styles.text}>Никакая статья пока не выбрана</p>
        </div>
    );
};
