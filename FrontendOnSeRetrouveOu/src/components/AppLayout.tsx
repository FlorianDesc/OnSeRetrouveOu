import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { Spinner } from "./ui/spinner";
import UnauthorizedHandler from "./UnauthorizedHandler";

export default function AppLayout() {
  return (
    <div className="min-h-screen">
      <UnauthorizedHandler />
      <NavBar />
      <main>
        <Suspense
          fallback={
            <div className="fixed inset-0 flex justify-center items-center">
              <Spinner className="size-7 text-gray-700" />
            </div>
          }>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
