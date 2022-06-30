import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "./token";

export default function RequireAuth({ children }) {
  let location = useLocation();
  return getToken() ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
