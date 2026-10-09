import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "entities/session";
import { LoadingWidget } from "shared/ui/loading-widget";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useSession();
    const location = useLocation();

    if (loading) {
        return <LoadingWidget />;
    }

    if (!user) {
        // The login page sends the user back here afterwards.
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return <>{children}</>;
};
