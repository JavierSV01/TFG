import { useState, useEffect } from 'react'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'

export const useUserData = (usuario) => {
  const [userData, setUserData] = useState(null) // Estado para los datos del usuario
  const [error, setError] = useState(null) // Estado para errores
  const [loading, setLoading] = useState(true) // Estado para manejo de carga
  // Función para obtener los datos del usuario
  const fetchUserData = async () => {
    try {
      if (!usuario) return
      const data = { usuario }
      setLoading(true) // Activar estado de carga
      setError(null) // Resetear error previo

      axios.withCredentials = true
      const response = await axios.post(ENDPOINTS.USER.INFO, data)
      console.log(response.data.usuario)
      setUserData(response.data) // Guardar los datos obtenidos
    } catch (err) {
      setError(err.message || 'Error fetching user data') // Manejar errores
    } finally {
      setLoading(false) // Desactivar estado de carga
    }
  }
  useEffect(() => {
    fetchUserData()
  }, [usuario]) // Ejecutar efecto cuando cambia `userId`

  return { userData, loading, error, fetchUserData } // Retornar datos, estado de carga y errores
}
