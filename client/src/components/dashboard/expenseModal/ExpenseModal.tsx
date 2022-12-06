import { useEffect, useState, Fragment } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Modal, Row, InputGroup, Form, Button } from 'react-bootstrap'
import Select from 'react-select'
import DatePicker from 'react-date-picker'
import { yupResolver } from '@hookform/resolvers/yup'

import { getUsers } from '../../../firebase/database'
import { getCurrentUser } from '../../../firebase/auth'
import { uploadIcon } from '../../../assets'
import { modalFormInitValues, modalSchema } from '../../../constants/constants'
import { watchFormValue, submitForm, selectStyles } from '../../../helpers/helper'

import './expenseModal.css'

export default function ExpenseModal({ show, hideModal }) {
  const [modalState, setModalState] = useState({ users: [], loading: false })

  const currentUser = { uid: getCurrentUser().uid, email: getCurrentUser().email }

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset
  } = useForm({
    defaultValues: {
      ...modalFormInitValues,
      paidBy: currentUser.uid,
      users: [{ value: currentUser.uid, label: currentUser.email, isFixed: true }]
    },
    resolver: yupResolver(modalSchema)
  })

  const onHide = () => {
    reset({
      ...modalFormInitValues,
      paidBy: currentUser.uid,
      users: [{ value: currentUser.uid, label: currentUser.email, isFixed: true }]
    })
    hideModal()
  }

  const userSelection = modalState.users
    .filter(({ uid }) => uid !== currentUser.uid)
    .map(({ uid, email }) => ({ value: uid, label: email }))

  const splitOptions = watchFormValue('users', watch).map(({ value: uid, label: email }) => {
    return (
      <option value={uid} key={uid}>
        {uid === currentUser.uid ? 'You' : email}
      </option>
    )
  })

  const expenseDetails = [
    {
      name: 'description',
      placeholder: 'Description(optional)',
      isInvalid: errors.description,
      errorMessage: errors.description?.message
    },
    {
      name: 'totalPrice',
      placeholder: '$0.00',
      isInvalid: errors.totalPrice,
      errorMessage: errors.totalPrice?.message
    }
  ]

  const expenseDetailsLayout = expenseDetails.map(
    ({ name, placeholder, isInvalid, errorMessage }, index) => (
      <InputGroup size='sm' className='mb-3' key={index}>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, ref, value } }) => (
            <Form.Control
              placeholder={placeholder}
              onChange={onChange}
              ref={ref}
              isInvalid={isInvalid}
              value={value}
            />
          )}
        />
        <Form.Control.Feedback type='invalid'>{errorMessage}</Form.Control.Feedback>
      </InputGroup>
    )
  )

  const billDetails = [
    {
      text: 'Paid by ',
      name: 'paidBy',
      options: (
        <>
          {splitOptions}
          <option value='multiple'>Multiple</option>
        </>
      )
    },
    {
      text: 'And split ',
      name: 'split',
      options: (
        <>
          <option value='equally'>Equally</option>
          <option value='unequally'>Unequally</option>
        </>
      )
    }
  ]

  const billDetailsLayout = billDetails.map(({ text, name, options }, index) => (
    <Fragment key={index}>
      <p>{text}</p>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, ref, value } }) => (
          <Form.Select
            aria-label='Default select example'
            bsPrefix='user'
            onChange={onChange}
            ref={ref}
            value={value}
          >
            {options}
          </Form.Select>
        )}
      />
    </Fragment>
  ))

  const costInput = (name, uid, email, index) => (
    <InputGroup size='sm' className='mb-3 w-50' key={uid}>
      <Form.Label className='summary'>{uid === currentUser.uid ? 'You' : email}</Form.Label>
      <Controller
        control={control}
        name={`${name}.${index}.${uid}`}
        render={({ field: { onChange, ref, value } }) => (
          <Form.Control
            placeholder='$0.00'
            onChange={onChange}
            ref={ref}
            isInvalid={errors[name]}
            value={value}
            bsPrefix='user round-borders w-25 mx-2'
          />
        )}
      />
      <Form.Control.Feedback type='invalid'>{errors[name]?.uid?.message}</Form.Control.Feedback>
    </InputGroup>
  )

  const onSubmit = data =>
    submitForm(watchFormValue('split', watch), watchFormValue('paidBy', watch), data, onHide)

  const footerButtonsData = [
    { style: 'cancel-btn', onClick: onHide, text: 'Cancel' },
    { style: 'save-btn', onClick: handleSubmit(onSubmit), text: 'Save' }
  ]

  const footerButtons = footerButtonsData.map(({ style, onClick, text }, index) => (
    <Button className={style} onClick={onClick} key={index}>
      {text}
    </Button>
  ))

  useEffect(() => {
    const fetchUsers = async () => {
      setModalState(currentState => {
        return { ...currentState, loading: true }
      })
      const data = await getUsers()
      setModalState(currentState => {
        return { ...currentState, users: data, loading: false }
      })
    }
    fetchUsers()
  }, [])

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton closeVariant='white' className='header-bg'>
        Add an expense
      </Modal.Header>
      <Modal.Body className=''>
        <Row className='p-0 m-0 mt-2'>
          <p className='name-text w-25 '>With you and:</p>
          <InputGroup size='sm' className='mb-3 w-75'>
            <Controller
              control={control}
              name='users'
              render={({ field: { onChange, ref, value } }) => (
                <Select
                  options={userSelection}
                  ref={ref}
                  onChange={(newValue, { action, removedValue }) => {
                    switch (action) {
                      case 'remove-value':
                      case 'pop-value':
                        if (removedValue.isFixed) {
                          return
                        }
                        break
                      case 'clear':
                        newValue = userSelection.filter(v => v.isFixed)
                        break
                      default:
                        break
                    }
                    onChange(newValue)
                  }}
                  value={value}
                  styles={selectStyles}
                  isClearable={false}
                  isMulti
                  isLoading={modalState.loading}
                  noOptionsMessage={() => 'No users found'}
                  className='w-100'
                />
              )}
            />
            {errors.users && <p className='text-danger'>{errors.users?.message}</p>}
          </InputGroup>
        </Row>
        <div className='d-flex justify-content-center p-1'>
          <img src={uploadIcon} className='upload-img m-2' />
          <div className='mt-1'>{expenseDetailsLayout}</div>
        </div>
        <div className='d-flex justify-content-center summary'>{billDetailsLayout}</div>
        {watchFormValue('paidBy', watch) === 'multiple' && (
          <div className='d-flex flex-column align-items-center m-2 summary'>
            <p>Paid Values</p>
            {watchFormValue('users', watch).map(({ value: uid, label: email }, index) =>
              costInput('paidByMultiple', uid, email, index)
            )}
          </div>
        )}
        {watchFormValue('split', watch) === 'unequally' && (
          <div className='d-flex flex-column align-items-center m-2 summary'>
            <p>Split values</p>
            {watchFormValue('users', watch).map(({ value: uid, label: email }, index) =>
              costInput('splitValues', uid, email, index)
            )}
          </div>
        )}
        <div className='d-flex justify-content-evenly m-2'>
          <Controller
            control={control}
            name='date'
            render={({ field: { onChange, ref, value } }) => (
              <DatePicker className='px-4' inputRef={ref} onChange={onChange} value={value} />
            )}
          />
          <label className='rounded-btn px-4'>
            <input type='file' {...register('imageFile')} />
            {watchFormValue('imageFile', watch)
              ? watchFormValue('imageFile', watch)[0].name
              : 'Upload image'}
          </label>
        </div>
      </Modal.Body>
      <Modal.Footer>{footerButtons}</Modal.Footer>
    </Modal>
  )
}
