import { useState, useEffect } from 'react'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'

export const useClientInfo = (usuario) => {
  const [userData, setUserData] = useState(null) // Estado para los datos del usuario
  const [error, setError] = useState(null) // Estado para errores
  const [loading, setLoading] = useState(true) // Estado para manejo de carga

  const fetchUserData = async () => {
    try {
      const data = { usuario }
      setLoading(true) // Activar estado de carga
      setError(null) // Resetear error previo

      axios.withCredentials = true
      const response = await axios.post(ENDPOINTS.USER.CLIENT_INFO, data)
      if (response.status === 200) {
        setUserData(response.data) // Guardar los datos obtenidos
      }
    } catch (err) {
      console.log(err.response.data.error)
      setError(err.response.data.error || 'Error fetching user data') // Manejar errores
    } finally {
      setLoading(false) // Desactivar estado de carga
    }
  }
  useEffect(() => {
    if (!usuario) return
    fetchUserData()
  }, []) // Ejecutar efecto cuando cambia `userId`

  return { userData, loading, error, reload: fetchUserData } // Retornar datos, estado de carga y errores
}
