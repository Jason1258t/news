import React from "react";

export const RenderHtml = ({ html }) => <span dangerouslySetInnerHTML={{ __html: html }} />;
