import { Link, RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./Pages/login";
import Register from "./Pages/register";
import Play from "./Pages/Scene/play";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <>
        <h1>login</h1>
        <Login />
        <div className="footer">
          <Link to={"/register"}>register</Link>
          <Link to={"/play"}>play</Link>
        </div>
      </>
    ),
  },
  {
    path: "/register",
    element: (
      <>
        <h1>register</h1>
        <Register />
        <div className="footer">
          <Link to={"/login"}>login</Link>
          <Link to={"/play"}>play</Link>
        </div>
      </>
    ),
  },
  {
    path: "/",
    element: (
      <>
        <h1>play</h1>
        <Play />
      </>
    ),
  },
]);

export default () => <RouterProvider router={router} />;
