const saveToken = token => {
  sessionStorage.setItem('Auth Token', token)
}

const removeToken = () => {
  sessionStorage.removeItem('Auth Token')
}

export default {
  saveToken,
  removeToken
}
