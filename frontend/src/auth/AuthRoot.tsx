import { Outlet } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";

/** Router root: mounts the auth context inside the router so it can navigate. */
export function AuthRoot() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
