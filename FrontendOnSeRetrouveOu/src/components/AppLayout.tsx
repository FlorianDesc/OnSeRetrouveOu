import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function AppLayout() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
