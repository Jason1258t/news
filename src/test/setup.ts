import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Unit tests never talk to Firebase: without this, importing any API module would
// initialize the real app from .env (and fail in CI, where there is no .env).
vi.mock("shared/api/firebase", () => ({ app: {}, db: {}, auth: {} }));

afterEach(() => {
    cleanup();
});
