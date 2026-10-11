import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { TELEGRAM_CHANNEL_URL } from "shared/config";
import { renderWithProviders } from "test/render";
import { SubscribeCta } from "./SubscribeCta";

const renderCta = () =>
    renderWithProviders(
        <Routes>
            <Route path="/" element={<SubscribeCta />} />
            <Route path="/about" element={<p>about page</p>} />
        </Routes>,
    );

describe("SubscribeCta", () => {
    it("opens the Telegram channel in a new tab without access to this page", async () => {
        const open = vi.spyOn(window, "open").mockReturnValue(null);
        renderCta();

        await userEvent.click(screen.getByRole("button", { name: "Подписаться" }));

        expect(open).toHaveBeenCalledWith(TELEGRAM_CHANNEL_URL, "_blank", "noopener,noreferrer");
    });

    it("leads to the about page", async () => {
        renderCta();

        await userEvent.click(screen.getByRole("button", { name: "О проекте" }));

        expect(screen.getByText("about page")).toBeInTheDocument();
    });
});
