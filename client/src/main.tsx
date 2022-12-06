import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'

import App from './App'
import { AuthRoute } from './routes'
import { Homepage, Login, Signup, Dashboard } from './components'
import store from './redux/store'

import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthRoute />,
    children: [
      {
        index: true,
        element: <Homepage />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'signup',
        element: <Signup />
      }
    ]
  },
  {
    path: '/dashboard',
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)
