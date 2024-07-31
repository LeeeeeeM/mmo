import Login from "./Pages/login";
import Register from "./Pages/register";
import { Link, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <h1>login</h1>
        <Link to={"register"}>register</Link>
        <Login />
      </>
    ),
  },
  {
    path: "register",
    element: (
      <>
        <h1>register</h1>
        <Link to={"/"}>login</Link>
        <Register />
      </>
    ),
  },
]);

export default () => <RouterProvider router={router} />;
