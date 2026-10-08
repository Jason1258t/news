import type { ReactNode } from "react";
import { Container } from "../container/Container";
import { Main, type MainSpacing } from "../main/Main";
import { Surface } from "../surface/Surface";

interface SurfacePageProps {
    children: ReactNode;
    fullWidthOnMobile?: boolean;
    spacing?: MainSpacing;
}

export const SurfacePage = ({ children, fullWidthOnMobile = false, spacing }: SurfacePageProps) => {
    return (
        <Main spacing={spacing}>
            <Container fullWidthOnMobile={fullWidthOnMobile}>
                <Surface>{children}</Surface>
            </Container>
        </Main>
    );
};
