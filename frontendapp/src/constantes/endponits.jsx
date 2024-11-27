const backendHost = process.env.REACT_APP_BACKEND_HOST
const backendPort = process.env.REACT_APP_BACKEND_PORT
const BASE_URL = 'http://' + backendHost + ':' + backendPort

export const ENDPOINTS = {
  USER: {
    LOGIN: `${BASE_URL}/user/login`,
    LOGOUT: `${BASE_URL}/user/logout`,
    REGISTER: `${BASE_URL}/user/register`,
    STATUS: `${BASE_URL}/user/status`,
    ROL: `${BASE_URL}/user/role`,
    TRAINERS: `${BASE_URL}/user/trainers`,
    WORKOUT: `${BASE_URL}/user/workout`,
    CLIENTS: `${BASE_URL}/user/clients`

  },

  SOLICITUDE: {
    MYSOLICITUDE: `${BASE_URL}/sol/mysolicitude`,
    APPLY: `${BASE_URL}/sol/apply`,
    ACCEPT: `${BASE_URL}/sol/accept`
  }
}
