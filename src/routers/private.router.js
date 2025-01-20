import { lazy } from 'react';

const overviewRouter = lazy(() => import('../views/Overview/overview.router'));
const usersRouter = lazy(() => import('../views/Members/members.router'));
const meetingsRouter = lazy(() => import('../views/Meetings/meetings.router'));
const activityLogRouter = lazy(() => import('../views/ActivityLog/activityLog.router'));
const newsRouter = lazy(() => import('../views/News/news.router'));
const inboxRouter = lazy(() => import('../views/inbox/inbox.router'));
const committeeTasksRouter = lazy(() => import('../views/CommitteeTasks/committeeTasks.router'));
const doucmentsRouter = lazy(() => import('../views/RelatedDocuments/relatedDocuments.router'));
const agreementsRouter = lazy(() => import('../views/Tasks/tasks.router'));
const projectsRouter = lazy(() => import('../views/RelatedProjects/relatedProjects.router'));
const adminRouter = lazy(() => import('../views/Admin/admin.router'));

export const PrivateRouter = [
  {
    path: '/overview/*',
    name: 'overview',
    component: overviewRouter,
    exact: true,
  },
  {
    path: '/users/*',
    name: 'users',
    component: usersRouter,
    exact: true,
  },
  {
    path: '/meetings/*',
    name: 'meetings',
    component: meetingsRouter,
    exact: true,
  },
  {
    path: '/activity-log/*',
    name: 'activityLog',
    component: activityLogRouter,
    exact: true,
  },
  {
    path: '/news/*',
    name: 'news',
    component: newsRouter,
    exact: true,
  },
  {
    path: '/inbox/*',
    name: 'inbox',
    component: inboxRouter,
    exact: true,
  },
  {
    path: '/committee-tasks/*',
    name: 'committeeTasks',
    component: committeeTasksRouter,
    exact: true,
  },
  {
    path: '/related-documents/*',
    name: 'relatedDocuments',
    component: doucmentsRouter,
    exact: true,
  },
  {
    path: '/tasks/*',
    name: 'agreements',
    component: agreementsRouter,
    exact: true,
  },
  {
    path: '/related-projects/*',
    name: 'projects',
    component: projectsRouter,
    exact: true,
  },
  {
    path: '/admin/*',
    name: 'admin',
    component: adminRouter,
    exact: true,
  },
];
