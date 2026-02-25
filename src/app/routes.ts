import { createBrowserRouter } from "react-router";
import ContractBuilder from "./pages/ContractBuilder";
import Resources from "./pages/Resources";
import { RootLayout } from "./pages/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: ContractBuilder,
      },
      {
        path: "resources",
        Component: Resources,
      },
    ],
  },
]);