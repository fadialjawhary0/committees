import { lazy } from 'react';

const loginRouter = lazy(() => import('../views/User/user.router'));

export const PublicRouter = [
  {
    path: '/login/*',
    name: 'login',
    component: loginRouter,
    exact: true,
  },
];
