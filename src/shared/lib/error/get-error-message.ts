/** Message of a caught value: Error.message for errors, String(value) for anything else. */
export const getErrorMessage = (error: unknown): string =>
    error instanceof Error ? error.message : String(error);
