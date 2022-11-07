import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'

import { DashNav } from './components'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import './App.css'

function App() {
  const navigate = useNavigate()
  const { user } = useSelector(state => state.user)

  useEffect(() => {
    if (user == null) {
      let token = sessionStorage.getItem('Auth Token')
      if (!token) navigate('/login')
    }
  }, [user])

  return (
    user && (
      <>
        <DashNav />
        <Outlet />
        <ToastContainer position='top-center' />
      </>
    )
  )
}

export default App
