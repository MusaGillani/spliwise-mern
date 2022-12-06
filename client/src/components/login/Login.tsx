import { useOutletContext } from 'react-router-dom'
import { Controller } from 'react-hook-form'
import { Form, Container, Card } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import './login.css'

export default function Login() {
  const { control, handleSubmit, onSubmit, errors } = useOutletContext()

  const formFields = [
    {
      type: 'email',
      controlId: 'formBasicEmail',
      label: 'Email Address'
    },
    {
      type: 'password',
      controlId: 'formBasicPassword',
      label: 'Password'
    }
  ]

  return (
    <Container className='d-flex justify-content-center align-items-center min-h bg-img'>
      <div className='w-100 max-w'>
        <Card className='p-5'>
          <Card.Body>
            <Card.Title>Log in</Card.Title>
            <Form validated={false} onSubmit={handleSubmit(onSubmit)}>
              {formFields.map(({ type, controlId, label }, index) => (
                <Form.Group className='mb-3' controlId={controlId} key={index}>
                  <Form.Label> {label}</Form.Label>
                  <Controller
                    control={control}
                    name={type}
                    render={({ field: { onChange, ref, value } }) => (
                      <Form.Control
                        type={type}
                        onChange={onChange}
                        ref={ref}
                        isInvalid={errors[type]}
                        value={value}
                      />
                    )}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors[type]?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              ))}
              <button className='w-100 btn-login button text-center' type='submit'>
                Log in
              </button>
              <button className='w-100 btn-forgot-pw button' type='button'>
                Forgot your password?
              </button>
            </Form>
          </Card.Body>
        </Card>
      </div>
      <ToastContainer />
    </Container>
  )
}
