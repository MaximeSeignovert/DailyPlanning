import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import { Dashboard } from "@/pages/Dashboard"
import { Journal } from "@/pages/Journal"
import { Calendar } from "@/pages/Calendar"
import { Analytics } from "@/pages/Analytics"
import { Settings } from "@/pages/Settings"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
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
      {
        path: "*",
        element: <Dashboard />,
      },
    ],
  },
])

export function Router() {
  return <RouterProvider router={router} />
} 