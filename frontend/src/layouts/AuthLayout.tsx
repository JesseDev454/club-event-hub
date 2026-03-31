import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white p-8 shadow-card">
        <Outlet />
      </div>
    </div>
  );
}
