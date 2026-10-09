import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import type { User } from "firebase/auth";
import { describe, expect, it } from "vitest";
import { SessionContext } from "entities/session";
import { ProtectedRoute } from "./ProtectedRoute";

const LoginProbe = () => <p>login page, back to {String(useLocation().state?.from)}</p>;

const renderWithAuth = (value: { user: User | null; loading: boolean }) =>
    render(
        <SessionContext.Provider value={value}>
            <MemoryRouter initialEntries={["/admin"]}>
                <Routes>
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <p>secret</p>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<LoginProbe />} />
                </Routes>
            </MemoryRouter>
        </SessionContext.Provider>,
    );

describe("ProtectedRoute", () => {
    it("shows a loader while auth state is unknown", () => {
        renderWithAuth({ user: null, loading: true });
        expect(screen.getByText("Загрузка...")).toBeInTheDocument();
        expect(screen.queryByText("secret")).not.toBeInTheDocument();
    });

    it("redirects guests to the login page", () => {
        renderWithAuth({ user: null, loading: false });
        expect(screen.getByText("login page, back to /admin")).toBeInTheDocument();
    });

    it("renders children for a signed-in user", () => {
        renderWithAuth({ user: { email: "a@b.c" } as User, loading: false });
        expect(screen.getByText("secret")).toBeInTheDocument();
    });
});
