import { Outlet } from "react-router-dom";

import { Navbar } from "../components/common/Navbar";
import { PageContainer } from "../components/common/PageContainer";
import { SiteFooter } from "../components/common/SiteFooter";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      <Navbar />
      <main className="py-6 pb-28 sm:py-10 md:pb-10">
        <PageContainer>
          <Outlet />
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}
