export const statsKeys = {
    all: ["stats"] as const,
    range: (from: string, to: string) => [...statsKeys.all, from, to] as const,
};
