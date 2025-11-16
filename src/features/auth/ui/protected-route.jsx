import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingWidget from "shared/ui/status/loading";

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
