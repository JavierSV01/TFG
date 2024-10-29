import { useState, useEffect } from 'react'
import axios from 'axios'

export const useAuthCheck = () => {
  const [authenticated, setAuthenticated] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        axios.defaults.withCredentials = true // Para enviar las cookies al backend
        const response = await axios.get('http://localhost:3001/isLogin')
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
  }, [])

  return { authenticated, message }
}
