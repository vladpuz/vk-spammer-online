import Program from '../components/Spamer/Main/Program/Program'
import Auth from '../components/Spamer/Main/Auth/Auth'

export type RouteType = {
  path: string
  component?: any
  exact?: boolean
  redirect?: string
  routes?: RouteType[]
}

// Централизованное управление роутингом
const routes: RouteType[] = [
  {
    path: '/spamer',
    component: Program,
    exact: true
  },
  {
    path: '/accounts',
    component: Auth,
    exact: true
  },
  {
    path: '/',
    redirect: '/spamer'
  }
]

export default routes
