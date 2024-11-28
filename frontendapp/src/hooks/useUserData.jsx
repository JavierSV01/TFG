import { useState, useEffect } from 'react'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'

export const useUserData = (usuario) => {
  const [userData, setUserData] = useState(null) // Estado para los datos del usuario
  const [error, setError] = useState(null) // Estado para errores
  const [loading, setLoading] = useState(true) // Estado para manejo de carga

  useEffect(() => {
    if (!usuario) return

    // Función para obtener los datos del usuario
    const fetchUserData = async () => {
      try {
        const data = { usuario }
        setLoading(true) // Activar estado de carga
        setError(null) // Resetear error previo
        const response = await axios.post(ENDPOINTS.USER.INFO, data)
        setUserData(response.data) // Guardar los datos obtenidos
      } catch (err) {
        setError(err.message || 'Error fetching user data') // Manejar errores
      } finally {
        setLoading(false) // Desactivar estado de carga
      }
    }

    fetchUserData()
  }, [usuario]) // Ejecutar efecto cuando cambia `userId`

  return { userData, loading, error } // Retornar datos, estado de carga y errores
}
