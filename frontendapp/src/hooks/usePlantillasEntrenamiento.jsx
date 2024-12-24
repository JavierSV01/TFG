import { useState, useEffect } from 'react'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'

export const usePlantillasEntrenamiento = () => {
  const [plantillas, setPlantillas] = useState([])

  useEffect(() => {
    axios
      .get(ENDPOINTS.USER.WORKOUTS)
      .then((response) => {
        setPlantillas(response.data)
      })
      .catch((error) => {
        console.error('Error al obtener las plantillas:', error)
      })
  }, [])
  return { plantillas }
}
