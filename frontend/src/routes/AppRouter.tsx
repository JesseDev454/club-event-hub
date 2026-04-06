import { Route, Routes } from "react-router-dom";

import { AuthLayout } from "../layouts/AuthLayout";
import { MainLayout } from "../layouts/MainLayout";
import { AdminCreateEventPage } from "../pages/AdminCreateEventPage";
import { AdminEditEventPage } from "../pages/AdminEditEventPage";
import { AdminEventsPage } from "../pages/AdminEventsPage";
import { ClubDetailPage } from "../pages/ClubDetailPage";
import { ClubsPage } from "../pages/ClubsPage";
import { CreateClubPage } from "../pages/CreateClubPage";
import { EditClubProfilePage } from "../pages/EditClubProfilePage";
import { EventDetailPage } from "../pages/EventDetailPage";
import { EventsPage } from "../pages/EventsPage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleProtectedRoute } from "./RoleProtectedRoute";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="clubs" element={<ClubsPage />} />
        <Route path="clubs/:id" element={<ClubDetailPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventDetailPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="clubs/new" element={<CreateClubPage />} />
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={["club_admin"]} />}>
          <Route element={<MainLayout />}>
            <Route path="clubs/:id/edit" element={<EditClubProfilePage />} />
            <Route path="admin/events" element={<AdminEventsPage />} />
            <Route path="admin/events/new" element={<AdminCreateEventPage />} />
            <Route path="admin/events/:id/edit" element={<AdminEditEventPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
