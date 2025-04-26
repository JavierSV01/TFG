import { useState, useCallback } from 'react'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'

export function useFavoritos () {
  const [favoritos, setFavoritos] = useState([])
  const [loadingFavoritos, setLoadingFavoritos] = useState(false)
  const [errorFavoritos, setErrorFavoritos] = useState(null)

  const fetchFavoritos = useCallback(async () => {
    setLoadingFavoritos(true)
    setErrorFavoritos(null)
    try {
      const response = await axios.get(ENDPOINTS.USER.GETFAVORITEPOSTSIDS)
      setFavoritos(response.data.favoritos || [])
    } catch (error) {
      console.error('Error cargando favoritos:', error)
      setErrorFavoritos('No se pudieron cargar los favoritos.')
    } finally {
      setLoadingFavoritos(false)
    }
  }, [])

  return { favoritos, fetchFavoritos, loadingFavoritos, errorFavoritos }
}
