import * as yup from 'yup'

export const modalFormInitValues = {
  description: '',
  totalPrice: '',
  paidByMultiple: [],
  split: 'equally',
  splitValues: [],
  imageFile: null,
  date: new Date()
}

export const loginFormInitValues = {
  email: '',
  password: ''
}

export const signUpFormInitValues = {
  name: '',
  email: '',
  password: ''
}

const arraySchema = yup.array().of(
  yup.lazy(value => {
    const newEntries = Object.keys(value).reduce(
      (acc, val) => ({
        ...acc,
        [val]: yup.number().typeError('price must be a number').required('Please enter a price')
      }),
      {}
    )
    return yup.object().shape(newEntries)
  })
)

export const modalSchema = yup
  .object({
    users: yup.array().min(2, 'Select atleast one user'),
    description: yup.string(),
    totalPrice: yup.number().typeError('price must be a number').required('Please enter a price'),
    paidByMultiple: arraySchema,
    splitValues: arraySchema,
    date: yup.date()
  })
  .required()

export const signUpSchema = yup
  .object({
    name: yup.string().required(),
    email: yup.string().email().required('Please enter a valid Email!'),
    password: yup
      .string()
      .required('No password provided.')
      .min(6, 'Password is too short - should be 6 chars minimum.')
      .matches(/[a-zA-Z1-9]/, 'Password must contain digits and letters.')
  })
  .required()

export const loginSchema = yup
  .object({
    email: yup.string().email().required('Please enter a valid Email!'),
    password: yup
      .string()
      .required('No password provided.')
      .min(6, 'Password is too short - should be 6 chars minimum.')
      .matches(/[a-zA-Z1-9]/, 'Password must contain digits and letters.')
  })
  .required()
