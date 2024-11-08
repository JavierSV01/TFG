import { useState, useEffect } from 'react'
import axios from 'axios'

export const useAuthCheck = () => {
  const [authenticated, setAuthenticated] = useState(false)
  const [message, setMessage] = useState('')

  const backendHost = process.env.REACT_APP_BACKEND_HOST
  const backendPort = process.env.REACT_APP_BACKEND_PORT
  const backendUrl = 'http://' + backendHost + ':' + backendPort

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        axios.defaults.withCredentials = true // Para enviar las cookies al backend
        const response = await axios.get(backendUrl + '/isLogin')
        if (response.status === 200) {
          setAuthenticated(true)
          setMessage(response.data.mensaje || 'Sesión iniciada')
        } else {
          setAuthenticated(false)
        }
      } catch (error) {
        const serverMessage = error.response?.data?.mensaje || 'Ocurrió un error. Inténtalo de nuevo.'
        setMessage(serverMessage) // Muestra el mensaje del servidor o uno predeterminado
        setAuthenticated(false)
      }
    }

    checkAuthentication()
  }, [backendUrl])

  return { authenticated, message }
}
