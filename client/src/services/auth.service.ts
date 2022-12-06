import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:3000/auth'
})

API.interceptors.request.use(
  config => {
    // TODO get token and add it below
    if (!config.headers['authorization']) config.headers['authorization'] = 'Bearer ${token}'
    return config
  },
  error => Promise.reject(error),
  { runWhen: config => config.method !== 'post' }
)

API.interceptors.response.use(
  response => response,
  async error => {
    // TODO check if error is authorization error then run refresh
    // refresh will save tokens in storage
    // otherwise return the error with Promise.reject
    const req = error?.config
    if (error?.response?.status === 403 && !req.sent) {
      req.sent = true
      // get new tokens
    }
  }
)

const login = async data =>
  await API.post('/login', data, { headers: { 'Content-Type': 'application/json' } })

const signUp = async data =>
  await API.post('/signup', data, { headers: { 'Content-Type': 'application/json' } })

const refresh = async () => await API.get('/refresh')

const logout = async uid => await API.delete(`/logout/${uid}`)

export default {
  login,
  signUp,
  logout,
  refresh
}
