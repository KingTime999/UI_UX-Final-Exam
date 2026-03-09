import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import Home from "./components/Home";
import Tasks from "./components/Tasks";
import Focus from "./components/Focus";
import Analytics from "./components/Analytics";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

const basename = import.meta.env.PROD ? '/UI_UX-Final-Exam' : '';

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "tasks", Component: Tasks },
      { path: "focus", Component: Focus },
      { path: "analytics", Component: Analytics },
    ],
  },
], {
  basename: basename,
});
