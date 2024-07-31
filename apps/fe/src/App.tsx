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
        <Login />
        <Link to={"register"}>register</Link>
      </>
    ),
  },
  {
    path: "register",
    element: (
      <>
        <h1>register</h1>
        <Register />
        <Link to={"/"}>login</Link>
      </>
    ),
  },
]);

export default () => <RouterProvider router={router} />;
