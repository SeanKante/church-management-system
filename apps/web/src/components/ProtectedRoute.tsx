import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import type { Permission } from "@cms/shared";
import { useAuth } from "@/lib/auth";

export function ProtectedRoute({
  children,
  permission,
}: {
  children: ReactNode;
  permission?: Permission;
}) {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-slate-400">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
