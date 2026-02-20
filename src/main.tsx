import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Root, {loader as rootLoader} from "./Root";
import Team from "./team/Team";
import { Table } from "./table/Table";
import Home from "./home/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    loader: rootLoader,
    children: [
      {
        path: "/",
        element: <Home/>,
      },
      {
        path: "/tables",
        element: <Table/>,
      },
      {
        path: "team/:teamNumber",
        element: <Team />,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
