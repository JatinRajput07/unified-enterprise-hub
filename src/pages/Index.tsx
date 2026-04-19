// Index now just redirects to the default module via App routes.
// Kept for backwards compatibility with any external link.
import { Navigate } from "react-router-dom";

const Index = () => <Navigate to="/sales" replace />;

export default Index;
