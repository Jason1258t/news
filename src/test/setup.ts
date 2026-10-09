import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import {
    resetIntersectionMocking,
    setupIntersectionMocking,
} from "react-intersection-observer/test-utils";
import { afterEach, beforeEach, vi } from "vitest";

// Unit tests never talk to Firebase: without this, importing any API module would
// initialize the real app from .env (and fail in CI, where there is no .env).
vi.mock("shared/api/firebase", () => ({ app: {}, db: {}, auth: {} }));

// jsdom has no IntersectionObserver (infinite scroll). Tests drive it with mockAllIsIntersecting.
// The library mocks it with vi.fn(arrowFn), which Vitest 4+ cannot `new`, hence the wrapper.
const constructibleFn = ((impl: (...args: unknown[]) => unknown) =>
    vi.fn(function (...args: unknown[]) {
        return impl(...args);
    })) as unknown as typeof vi.fn;

beforeEach(() => {
    setupIntersectionMocking(constructibleFn);
});

afterEach(() => {
    cleanup();
    resetIntersectionMocking();
});
