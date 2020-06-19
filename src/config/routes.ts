import Program from '../components/Spamer/Main/Program/Program'
import Auth from '../components/Spamer/Main/Auth/Auth'

const routes = {
  spamer: {
    path: '/',
    component: Program,
    subroutes: {
      accounts: {
        path: '/accounts',
        component: Auth
      }
    }
  }
}

export default routes
