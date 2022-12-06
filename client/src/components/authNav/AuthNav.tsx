import { Link } from 'react-router-dom'

import { logo } from '../../assets'

import './authnav.css'

export default function AuthNav() {
  return (
    <nav className='navbar navbar-dark container-fluid nav-height m-0 px-5'>
      <Link to='dashboard' className='navbar-brand mx-1'>
        <div className='d-flex'>
          <img src={logo} alt='logo' width='30' height='24' />
          <h3 className='logo-heading'>Splitwise</h3>
        </div>
      </Link>
      <Link to='login' className='nav-link ms-auto login m-1 p-2'>
        Log in
      </Link>
      <Link to='signup' className='nav-link signup m-1 p-2'>
        Sign Up
      </Link>
    </nav>
  )
}
