import { 
  createRootRoute, 
  createRoute, 
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Journal } from '@/pages/Journal';
import { Calendar } from '@/pages/Calendar';
import { Analytics } from '@/pages/Analytics';
import { Settings } from '@/pages/Settings';
import { Changelog } from '@/pages/Changelog';
import { Auth } from '@/pages/Auth';
import Landing from '@/pages/Landing';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Définition de la route racine
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Route de la landing page
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Landing,
});

// Route d'authentification
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: Auth,
});

// Route protégée avec layout
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app',
  component: () => (
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  ),
  beforeLoad: ({ location }) => {
    if (location.pathname === '/app') {
      throw redirect({ to: '/app/dashboard' });
    }
  },
});

// Routes enfants du layout
const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/dashboard',
  component: Dashboard,
});

const journalRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/journal',
  component: Journal,
});

const calendarRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/calendar',
  component: Calendar,
});

const analyticsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/analytics',
  component: Analytics,
});

const settingsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/settings',
  component: Settings,
});

const changelogRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/changelog',
  component: Changelog,
});

// Configuration du routeur
const routeTree = rootRoute.addChildren([
  landingRoute,
  authRoute,
  layoutRoute.addChildren([
    dashboardRoute,
    journalRoute,
    calendarRoute,
    analyticsRoute,
    settingsRoute,
    changelogRoute,
  ]),
]);

export const router = createRouter({ routeTree });

// Déclaration des types pour TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
} 