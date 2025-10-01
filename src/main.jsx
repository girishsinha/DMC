import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeProvider";

import Login from "./components/Login";
import Home from "./components/Home";
import UploadFile from "./components/UploadFile";
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
        path: "/uplod",
        element: (
          <ProtectedRoute>
            <UploadFile />
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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    </ThemeProvider>
  </UserProvider>
);
