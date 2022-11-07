import { useOutletContext } from 'react-router-dom'
import { Form, Container, Row, Col } from 'react-bootstrap'
import { Controller } from 'react-hook-form'
import { ToastContainer } from 'react-toastify'

import { logo } from '../../assets'

import 'react-toastify/dist/ReactToastify.css'
import './signup.css'

export default function Signup() {
  const { control, handleSubmit, onSubmit, errors } = useOutletContext()

  const formFields = [
    {
      type: 'name',
      controlId: 'formBasicName',
      label: 'Hi there! My name is'
    },
    {
      type: 'email',
      controlId: 'formBasicEmail',
      label: (
        <>
          Here&apos;s my <strong>email address</strong>:
        </>
      )
    },
    {
      type: 'password',
      controlId: 'formBasicPassword',
      label: (
        <>
          And here&apos;s my <strong>password</strong>:
        </>
      )
    }
  ]

  return (
    <Container fluid className='d-flex justify-content-center min-h my-2'>
      <div className='w-75'>
        <Row className='justify-content-center'>
          <Col xs='auto' className='logo-alignment'>
            <img src={logo} className='logo' />
          </Col>
          <Col className='form-max-w'>
            <p className='h6 text-muted'>INTRODUCE YOURSELF</p>
            <Form validated={false} onSubmit={handleSubmit(onSubmit)}>
              {formFields.map(({ type, controlId, label }, index) => (
                <Form.Group className='mb-3' controlId={controlId} key={index}>
                  <Form.Label>{label}</Form.Label>
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
              <button className='button-signup text-center' type='submit'>
                Sign me up!
              </button>
            </Form>
          </Col>
        </Row>
      </div>
      <ToastContainer />
    </Container>
  )
}
