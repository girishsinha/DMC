import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

import Login from "./components/Login";
import Home from "./components/Home";
import { UserProvider } from "./context/userContext";
import ProtectedRoute from "./middleware/ProtectedRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </UserProvider>
);
