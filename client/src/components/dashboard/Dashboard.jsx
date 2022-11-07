import { useState, useEffect } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { MutatingDots } from 'react-loader-spinner'

import { ExpenseModal } from '../../components'
import { getUserExpenses, settleUserExpense } from '../../firebase/database'
import { showModal, hideModal, toggleSettle, calculateBalances } from '../../helpers/helper'

import './dashboard.css'

export default function Dashboard() {
  const [dashboardState, setDashboardState] = useState({
    show: false,
    settled: false,
    loading: false,
    expenses: []
  })

  const handleSettle = (expenseId, uid) => {
    settleUserExpense(expenseId, uid).then(() => toggleSettle(setDashboardState))
  }

  const { totalBalance, owed, owe, owedFromUsers, oweToUsers } = calculateBalances(
    dashboardState.expenses
  )

  const columnEntry = (email, balance, expenseId, uid, type, label) => (
    <div className={`expense-entry border-${type} mb-2 d-flex justify-content-between`} key={uid}>
      <div>
        <p>{email}</p>
        <p className={type}>
          {label} <span className='fw-bold'>${balance}</span>
        </p>
      </div>
      <Button className='btn-settle' onClick={() => handleSettle(expenseId, uid)}>
        Settle Up
      </Button>
    </div>
  )

  const oweColumn = oweToUsers.map(({ balance, email, uid, expenseId }) =>
    columnEntry(email, balance, expenseId, uid, 'negative', 'You owe')
  )

  const owedColumn = owedFromUsers.map(({ balance, email, uid, expenseId }) =>
    columnEntry(email, balance, expenseId, uid, 'positive', 'Owes you')
  )

  const balanceLayout = [
    {
      style: 'right-line',
      text: 'Total balance',
      amountStyle: totalBalance !== 0 ? (totalBalance > 0 ? 'positive' : 'negative') : '',
      amount: totalBalance
    },
    {
      style: 'right-line',
      text: 'You owe',
      amountStyle: 'negative',
      amount: owe
    },
    {
      style: '',
      text: 'You are owed',
      amountStyle: 'positive',
      amount: owed
    }
  ]

  const balanceSummary = balanceLayout.map(({ style, text, amountStyle, amount }, index) => (
    <Col className={style} key={index}>
      <p>{text}</p>
      <p className={amountStyle}>${amount}</p>
    </Col>
  ))

  const expenseLayout = [
    { style: '', text: 'YOU OWE', column: oweColumn },
    { style: 'text-right', text: 'YOU ARE OWED', column: owedColumn }
  ]

  const expensesSection = expenseLayout.map(({ style, text, column }, index) => (
    <Col key={index}>
      <p className={`expense-headings ${style}`}>{text}</p>
      {column}
    </Col>
  ))

  useEffect(() => {
    if (!dashboardState.show) {
      const fetchUsers = async () => {
        setDashboardState(currentState => {
          return {
            ...currentState,
            loading: true
          }
        })
        const res = await getUserExpenses()
        setDashboardState(currentState => {
          return {
            ...currentState,
            expenses: res,
            loading: false
          }
        })
      }
      fetchUsers()
    }
  }, [dashboardState.show, dashboardState.settled])

  return (
    <Container className='dash-max-w dash-h shadow'>
      <Row className='p-2 bg-grey border border-top-0'>
        <Col>
          <p className='h3'>Dashboard</p>
        </Col>
        <Col xs='auto'>
          <Button className='btn-add-expense' onClick={() => showModal(setDashboardState)}>
            Add an expense
          </Button>
        </Col>
      </Row>
      <Row className='bg-grey border border-top-0 text-center balance-title'>{balanceSummary}</Row>
      <Row>{expensesSection}</Row>
      <div className='d-flex justify-content-center'>
        <MutatingDots
          height='100'
          width='100'
          color='#4fa94d'
          secondaryColor='#4fa94d'
          radius='12.5'
          ariaLabel='mutating-dots-loading'
          visible={dashboardState.loading}
        />
      </div>
      <ExpenseModal show={dashboardState.show} hideModal={() => hideModal(setDashboardState)} />
    </Container>
  )
}
