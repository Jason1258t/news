import { AdminPage } from "widgets/admin-layout";
import { EditorsPickEditor } from "widgets/editors-pick-editor";

export const EditorsPickPage = () => (
    <AdminPage
        title="Выбор редакции"
        description="Нажмите на статью слева, чтобы добавить её в подборку на главной"
    >
        <EditorsPickEditor />
    </AdminPage>
);
