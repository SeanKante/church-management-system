import { Navigate, Route, Routes } from "react-router-dom";
import { Permission } from "@cms/shared";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { DashboardHome } from "@/pages/DashboardHome";
import { Members } from "@/pages/Members";
import { Placeholder } from "@/pages/Placeholder";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route
          path="members"
          element={
            <ProtectedRoute permission={Permission.MEMBERS_VIEW}>
              <Members />
            </ProtectedRoute>
          }
        />
        <Route
          path="structure"
          element={
            <ProtectedRoute permission={Permission.STRUCTURE_VIEW}>
              <Placeholder title="Church Structure" phase="Phase 2" />
            </ProtectedRoute>
          }
        />
        <Route
          path="events"
          element={
            <ProtectedRoute permission={Permission.EVENTS_VIEW}>
              <Placeholder title="Events" phase="Phase 2" />
            </ProtectedRoute>
          }
        />
        <Route
          path="attendance"
          element={
            <ProtectedRoute permission={Permission.ATTENDANCE_VIEW}>
              <Placeholder title="Attendance" phase="Phase 2" />
            </ProtectedRoute>
          }
        />
        <Route
          path="communication"
          element={
            <ProtectedRoute permission={Permission.COMMUNICATION_SEND}>
              <Placeholder title="Communication" phase="Phase 3" />
            </ProtectedRoute>
          }
        />
        <Route
          path="pastoral-care"
          element={
            <ProtectedRoute permission={Permission.PASTORAL_VIEW}>
              <Placeholder title="Pastoral Care" phase="Phase 3" />
            </ProtectedRoute>
          }
        />
        <Route
          path="content"
          element={
            <ProtectedRoute permission={Permission.CONTENT_VIEW}>
              <Placeholder title="Content Library" phase="Phase 3" />
            </ProtectedRoute>
          }
        />
        <Route
          path="analytics"
          element={
            <ProtectedRoute permission={Permission.ANALYTICS_VIEW}>
              <Placeholder title="Analytics" phase="Phase 4" />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute permission={Permission.USERS_MANAGE}>
              <Placeholder title="User Management" phase="Phase 4" />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
