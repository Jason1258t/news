import { Navigate } from "react-router-dom";
import { useSession } from "entities/session";
import { LoadingWidget } from "shared/ui/loading-widget";

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useSession();

    if (loading) {
        return <LoadingWidget />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
