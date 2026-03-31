import { Outlet } from "react-router-dom";

import { Navbar } from "../components/common/Navbar";
import { PageContainer } from "../components/common/PageContainer";

export function MainLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-10">
        <PageContainer>
          <Outlet />
        </PageContainer>
      </main>
    </div>
  );
}
