import { useState, useEffect } from 'react'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'

export const useDietsPlans = () => {
  const [dietas, setDietas] = useState([])

  useEffect(() => {
    axios
      .get(ENDPOINTS.USER.DIETS)
      .then((response) => {
        setDietas(response.data)
      })
      .catch((error) => {
        console.error('Error al obtener las plantillas:', error)
      })
  }, [])
  return { dietas }
}
