import { createBrowserRouter } from "react-router";
import Intro from "./pages/Intro";
import ContractBuilder from "./pages/ContractBuilder";
import Resources from "./pages/Resources";
import { RootLayout } from "./pages/RootLayout";

export const router = createBrowserRouter([
  { path: "/", Component: Intro },
  { path: "/home", Component: Intro },
  {
    path: "/builder",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: ContractBuilder,
      },
    ],
  },
  {
    path: "/resources",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Resources,
      },
    ],
  },
  { path: "*", Component: Intro },
]);
