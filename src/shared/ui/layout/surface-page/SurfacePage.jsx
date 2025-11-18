import React from "react";
import { Container, Main, Surface } from "..";

export const SurfacePage = ({ children, fullWidthOnMobile = false, spacing }) => {
    return (
        <Main spacing={spacing}>
            <Container fullWidthOnMobile={fullWidthOnMobile}>
                <Surface>{children}</Surface>
            </Container>
        </Main>
    );
};
