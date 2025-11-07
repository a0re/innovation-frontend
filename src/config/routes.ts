/**
 * Centralized route configuration
 * All routes are defined here for single source of truth
 */

import { Dashboard } from '@/pages/Dashboard'
import { ModelTest } from '@/pages/ModelTest'
import { AboutUs } from '@/pages/AboutUs'
import { Documentation } from '@/pages/Documentation'
import { NotFound } from '@/pages/NotFound'

export interface RouteConfig {
  path: string
  label: string
  element: React.ComponentType
  showInNav?: boolean
}

/**
 * Application routes configuration
 */
export const routes: RouteConfig[] = [
  {
    path: '/',
    label: 'Dashboard',
    element: Dashboard,
    showInNav: true,
  },
  {
    path: '/model-test',
    label: 'Model Test',
    element: ModelTest,
    showInNav: true,
  },
  {
    path: '/about',
    label: 'About Us',
    element: AboutUs,
    showInNav: true,
  },
  {
    path: '/documentation',
    label: 'Documentation',
    element: Documentation,
    showInNav: true,
  },
  {
    path: '*',
    label: 'Not Found',
    element: NotFound,
    showInNav: false,
  },
]

/**
 * Navigation items (routes that appear in the nav bar)
 */
export const navItems = routes.filter((route) => route.showInNav)

/**
 * Route paths as constants for type-safe navigation
 */
export const ROUTE_PATHS = {
  HOME: '/',
  DASHBOARD: '/',
  MODEL_TEST: '/model-test',
  ABOUT: '/about',
  DOCUMENTATION: '/documentation',
} as const

