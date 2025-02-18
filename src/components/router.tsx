import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import { Dashboard } from "@/pages/Dashboard"
import { Journal } from "@/pages/Journal"
import { Calendar } from "@/pages/Calendar"
import { Analytics } from "@/pages/Analytics"
import { Settings } from "@/pages/Settings"
import { Auth } from "@/pages/Auth"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "journal",
        element: <Journal />,
      },
      {
        path: "calendar",
        element: <Calendar />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
])

export function Router() {
  return <RouterProvider router={router} />
} 