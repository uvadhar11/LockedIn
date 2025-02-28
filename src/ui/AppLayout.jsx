import { Outlet } from "react-router-dom";
import Header from "./Header";

function AppLayout() {
  return (
    <div className={`grid grid-rows-[4rem_1fr] h-screen bg-gray-50`}>
      {/* NEED A DIV HERE WRAPPING THE SIDEBAR IN ORDER FOR GRID TO DETECT IT AS AN OBJECT.*/}
      <Header/>

      <div className="px-10 py-4 bg-slate-50">
        <Outlet />
      </div>
    </div>
  );git
}

export default AppLayout;
