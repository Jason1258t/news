import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "entities/session";
import { LoadingWidget } from "shared/ui/loading-widget";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useSession();

    if (loading) {
        return <LoadingWidget />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};
