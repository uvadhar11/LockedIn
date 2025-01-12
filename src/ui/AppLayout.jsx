import { Outlet } from "react-router-dom";
import Header from "./Header";

function AppLayout() {
  return (
    <div
      // ${expanded ? "18.5rem" : "4.5rem"}
      className={`grid grid-rows-[18.5rem_1fr] h-screen bg-gray-50`}
    >
      {/* NEED A DIV HERE WRAPPING THE SIDEBAR IN ORDER FOR GRID TO DETECT IT AS AN OBJECT.*/}
      <Header />

      <div className="px-10 py-4 bg-slate-600">
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
