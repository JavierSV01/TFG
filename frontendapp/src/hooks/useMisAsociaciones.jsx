import { useState, useEffect } from 'react'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'

const useMisAsociaciones = () => {
  const [entrenadores, setEntrenadores] = useState([])

  useEffect(() => {
    const fetchEntrenadores = async () => {
      try {
        axios.defaults.withCredentials = true
        const response = await axios.get(ENDPOINTS.ASSOCIATION.GETASSOCITIONSBYUSER)
        setEntrenadores(response.data.associations)
      } catch (error) {
        console.error('Error fetching entrenadores:', error)
      }
    }

    fetchEntrenadores()
  }, [])

  return entrenadores
}

export default useMisAsociaciones
