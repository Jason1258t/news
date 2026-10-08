import { Navigate } from "react-router-dom";
import { useAuth } from "entities/session/model/useSession";
import LoadingWidget from "shared/ui/loading-widget/LoadingWidget";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingWidget />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
