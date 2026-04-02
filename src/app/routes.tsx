import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import Home from "./components/Home";
import Tasks from "./components/Tasks";
import Focus from "./components/Focus";
import Analytics from "./components/Analytics";
import Account from "./components/Account";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import LandingPage from "./components/LandingPage";
import WorldRank from "./components/WorldRank";
import OmeTV from "./components/OmeTV";
import MusicMixer from "./components/MusicMixer";

const basename = (import.meta as unknown as { env: { PROD: boolean } }).env.PROD
  ? '/UI_UX-Final-Exam'
  : '';

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/app",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "tasks", Component: Tasks },
      { path: "focus", Component: Focus },
      { path: "analytics", Component: Analytics },
      { path: "account", Component: Account },
      { path: "world-rank", Component: WorldRank },
      { path: "music", Component: MusicMixer },
      { path: "omestudy", Component: OmeTV },
      { path: "ometv", Component: OmeTV },
    ],
  },
], {
  basename: basename,
});
