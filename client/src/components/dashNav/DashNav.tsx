import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { logout } from '../../redux/actions/authActionsCreator'
import { logo } from '../../assets'

import './dashNav.css'

export default function DashNav() {
  const dispatch = useDispatch()
  const logoutUser = () => dispatch(logout())

  return (
    <nav className='navbar navbar-dark container-fluid nav-height m-0 nav-color'>
      <Link to='dashboard' className='navbar-brand mx-1'>
        <img src={logo} alt='logo' width='30' height='24' />
      </Link>
      <button className='nav-link ms-auto p-2 logout-btn' onClick={logoutUser}>
        Log out
      </button>
    </nav>
  )
}
