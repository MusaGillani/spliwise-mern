import { toast } from 'react-toastify'
import { getCurrentUser } from '../firebase/auth'
import { addExpense } from '../firebase/database'

export const showModal = setDashboardState =>
  setDashboardState(currentState => {
    return {
      ...currentState,
      show: true
    }
  })
export const hideModal = setDashboardState =>
  setDashboardState(currentState => {
    return {
      ...currentState,
      show: false
    }
  })
export const toggleSettle = setDashboardState =>
  setDashboardState(currentState => {
    return { ...currentState, settled: !currentState.settled }
  })

export const calculateBalances = expenses => {
  let result = {
    owedFromUsers: [],
    oweToUsers: [],
    owed: 0,
    owe: 0,
    totalBalance: 0
  }

  for (const expenseData of expenses) {
    const { totalPrice, paidBy, paidByMultiple, split, splitValues, users, expenseId } = expenseData
    let splitValue
    let paymentMade

    splitValue = findUser(getCurrentUser().uid, splitValues)[getCurrentUser().uid]

    if (paidBy === getCurrentUser().uid) {
      paymentMade = totalPrice
      let userBalances
      if (split === 'equally') {
        userBalances = users
          .filter(({ value: uid }) => uid !== getCurrentUser().uid)
          .map(({ label: email, value: uid }) => {
            return {
              expenseId,
              balance: splitValue,
              email,
              uid
            }
          })
      } else {
        userBalances = users
          .filter(({ value: uid }) => uid !== getCurrentUser().uid)
          .map(({ label: email, value: uid }) => {
            let balance = findUser(uid, splitValues)[uid]
            return {
              expenseId,
              balance,
              email,
              uid
            }
          })
      }
      result.owedFromUsers.push(...userBalances)
    } else if (paidBy == 'multiple') {
      paymentMade = findUser(getCurrentUser().uid, paidByMultiple)[getCurrentUser().uid]

      if (paymentMade > splitValue) {
        const amountToGet = paymentMade - splitValue
        let userBalances = users
          .filter(({ value: uid }) => uid !== getCurrentUser().uid)
          .map(({ label: email, value: uid }) => {
            let balance = findUser(uid, paidByMultiple)[uid] - findUser(uid, splitValues)[uid]
            return {
              expenseId,
              balance,
              email,
              uid
            }
          })
        let oweFromUsers = []
        userBalances.forEach(obj => {
          if (obj.balance < 0) {
            obj.balance = obj.balance * -1
            if (obj.balance > amountToGet) {
              obj.balance = amountToGet
            }
            oweFromUsers.push(obj)
          }
        })
        result.owedFromUsers.push(...oweFromUsers)
      } else if (paymentMade < splitValue) {
        const amountToPay = splitValue - paymentMade
        let userBalances = users
          .filter(({ value: uid }) => uid !== getCurrentUser().uid)
          .map(({ label: email, value: uid }) => {
            let balance = findUser(uid, paidByMultiple)[uid] - findUser(uid, splitValues)[uid]
            return {
              expenseId,
              balance,
              email,
              uid
            }
          })
        let oweToUsers = []
        userBalances.forEach(obj => {
          if (obj.balance > 0) {
            obj.balance = calculateBalance(amountToPay, obj.balance)
            oweToUsers.push(obj)
          }
        })
        result.oweToUsers.push(...oweToUsers)
      }
    } else {
      paymentMade = 0
      const { label: email, value: uid } = users.find(({ value: uid }) => uid === paidBy)
      result.oweToUsers.push({
        expenseId,
        balance: splitValue,
        email,
        uid
      })
    }
    const bal = paymentMade - splitValue
    if (bal > 0) {
      result.owed += bal
    } else {
      result.owe += bal * -1
    }
  }
  result.totalBalance = result.owed - result.owe
  return result
}

/**
 *
 * To be used only with splitValues and paidByMultiple arrays
 * @param {String} uid of user to search for
 * @param {Number<any>} list of user objects
 * @returns returns a user obj
 */
const findUser = (uid, list) => {
  return list.find(obj => Object.keys(obj)[0] === uid)
}

const calculateBalance = (amountToPay, balance) => {
  if (balance >= amountToPay) return amountToPay
  else return balance
}

/**
 *
 * @param {String} errorLabel Paid or Split errorLabel
 * @param {Number} checkPrice totalPrice to check
 * @param {Array<*>} prices splitValues or paidByMultiple arrays
 * @returns true incase of error, false incase no error
 */
const checkTotal = (errorLabel, checkPrice, prices) => {
  const equal = checkPrice === prices.reduce((prev, obj) => prev + Object.values(obj)[0], 0)
  if (!equal) {
    showError(`${errorLabel} prices should add up to be Total Price`, errorLabel)
    return true
  }
  return false
}
/**
 *
 * @param {String} error toast error to show
 * @param {String} toastId custom toastId (not required)
 * @param {*} postion toast position (not required)
 */
export const showError = (error, toastId, position) => {
  toast.error(error, {
    position: position,
    toastId: toastId
  })
}

/**
 *
 * @param {Number} totalAmount totalAmount to divide
 * @param {Array<*>} list of users
 * @returns {Array<*>} array with equal split amounts of each user
 */
const populateEqualAmounts = (totalAmount, list) => {
  let splitAmount = totalAmount / list.length
  return list.map(({ value: uid }) => {
    return { [uid]: splitAmount }
  })
}

export const submitForm = (splitType, paidBy, data, hideModal) => {
  let { totalPrice, users, splitValues, paidByMultiple, ...otherDetails } = data
  let index = users.findIndex(user => user.value === getCurrentUser().uid)
  delete users[index].isFixed
  if (splitType === 'unequally' && checkTotal('Split', totalPrice, splitValues)) return
  if (splitType === 'equally') splitValues = populateEqualAmounts(totalPrice, users)

  if (paidBy === 'multiple' && checkTotal('Paid', totalPrice, paidByMultiple)) return
  addExpense({
    users,
    totalPrice,
    paidByMultiple,
    splitValues,
    ...otherDetails
  }).then(() => hideModal())
}

export const watchFormValue = (key, watch) => watch(key)

export const selectStyles = {
  multiValue: (base, state) => {
    return state.data.isFixed ? { ...base, backgroundColor: 'gray' } : base
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, fontWeight: 'bold', color: 'white', paddingRight: 6 }
      : base
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: 'none' } : base
  }
}
