import { Helmet } from "react-helmet-async";
import { PROJECT_NAME } from "shared/config";
import { Container, Main } from "shared/ui/layout";
import { EditorsPickEditor } from "widgets/editors-pick-editor";

export const EditorsPickPage = () => {
    return (
        <>
            <Helmet>
                <title>{`Выбор редакции | ${PROJECT_NAME}`}</title>
                <meta name="description" content="Панель для настройки выбора редакции" />
            </Helmet>
            <Main>
                <Container>
                    <EditorsPickEditor />
                </Container>
            </Main>
        </>
    );
};
