import React, { useState } from 'react'
import axios from 'axios'

export function PaginaPrincipal () {
  const [indetificado, setIdentificado] = useState(false)
  const [message, setMessage] = useState('')

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        axios.defaults.withCredentials = true
        const response = await axios.get('http://localhost:3001/panel')
        if (response.status === 200) {
          setIdentificado(true)
          setMessage(response.data.mensaje || 'Sesion iniciada')
        } else {
          setIdentificado(false)
        }
      } catch (error) {
        const serverMessage = error.response?.data?.mensaje || 'Ocurrió un error. Inténtalo de nuevo.'
        setMessage(serverMessage) // Muestra el mensaje del servidor o uno predeterminado
        setIdentificado(false)
      }
    }

    fetchData()
  }, [])

  if (!indetificado) {
    return <div>{message}</div>
  }

  return (
    <div>
      <h1>{message}  </h1>
    </div>
  )
}
