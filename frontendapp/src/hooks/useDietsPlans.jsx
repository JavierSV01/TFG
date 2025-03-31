import { useState, useEffect } from 'react'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'

export const useDietsPlans = () => {
  const [dietas, setDietas] = useState([])

  const fetchDietsData = async () => {
    axios
      .get(ENDPOINTS.USER.DIETS)
      .then((response) => {
        setDietas(response.data)
      })
      .catch((error) => {
        console.error('Error al obtener las plantillas:', error)
      })
  }

  useEffect(() => {
    fetchDietsData()
  }, [])
  return { dietas, reload: fetchDietsData }
}
