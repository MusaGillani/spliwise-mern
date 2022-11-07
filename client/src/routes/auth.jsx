import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Outlet } from 'react-router-dom'
import { toast } from 'react-toastify'
import { yupResolver } from '@hookform/resolvers/yup'

import { AuthNav } from '../components'
import { signUp, login } from '../redux/actions/authActionsCreator'
import { showError } from '../helpers/helper'
import {
  signUpFormInitValues,
  signUpSchema,
  loginFormInitValues,
  loginSchema
} from '../constants/constants'

export default function Auth() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const notifyError = message =>
    showError(message, pathname === '/signup' ? 'signUp' : 'login', toast.POSITION.TOP_CENTER)

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitSuccessful },
    reset
  } = useForm({
    defaultValues: pathname === '/signup' ? signUpFormInitValues : loginFormInitValues,
    resolver: yupResolver(pathname === '/signup' ? signUpSchema : loginSchema)
  })

  const user = useSelector(state => state.user.user)
  const signUpError = useSelector(state => state.user.signUpError)
  const loginError = useSelector(state => state.user.loginError)

  const onSubmit = data => dispatch(pathname === '/signup' ? signUp(data) : login(data))

  const formProps = {
    control,
    handleSubmit,
    onSubmit,
    errors
  }

  const dependency = pathname === '/signup' ? signUpError : loginError

  useEffect(() => {
    if (dependency) notifyError(pathname === '/signup' ? signUpError : loginError)
  }, [dependency])

  useEffect(() => {
    if (user) {
      reset(pathname === '/signup' ? signUpFormInitValues : loginFormInitValues)
      navigate('/dashboard')
    }
  }, [isSubmitSuccessful, user])

  return (
    <>
      <AuthNav />
      <Outlet context={formProps} />
    </>
  )
}
