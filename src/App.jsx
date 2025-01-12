import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import PageNotFound from "./pages/PageNotFound";
import { Calendar, Inbox } from "lucide-react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Goals from "./pages/Goals";
import MyCircle from "./pages/MyCircle";
import References from "./pages/References";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* we do this with the index route in order to go directly to the dashboard as soon as you open up the page. Open up page - goes to this index route, then we have the Nviagate component redirect us to the dashboard page, which is defined in a route below this line. Replace replaces the link in the history stack*/}
          <Route index element={<Navigate replace to="inbox" />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="goals" element={<Goals />} />
          <Route path="references" element={<References />} />
          <Route path="my-circle" element={<MyCircle />} />
        </Route>

        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
