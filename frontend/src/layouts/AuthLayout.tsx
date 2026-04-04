import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-ink-50 px-4 py-10 sm:px-6">
      <div className="w-full max-w-lg rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-card backdrop-blur sm:p-8">
        <Outlet />
      </div>
    </div>
  );
}
