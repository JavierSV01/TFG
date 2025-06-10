import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ImageLoader from './ImageLoader' // Asegúrate de que la ruta sea la correcta
import { ENDPOINTS } from '../constantes/endponits'

const FotoDePerfil = ({ username, triggerRecarga }) => {
  const [imageId, setImageId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargarImagen = async () => {
    axios.get(ENDPOINTS.USER.GETPROFILEIMAGE + `?username=${username}`)
      .then(response => {
        // Ajusta según cómo venga el dato en tu respuesta
        setImageId(response.data.imagenId)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error al obtener la imagen:', err)
        setError('No se pudo cargar la imagen')
        setLoading(false)
      })
  }

  useEffect(() => {
    cargarImagen()
  }, [triggerRecarga, username])

  if (loading) return <p>Cargando imagen...</p>
  if (error) return <p>{error}</p>
  if (!imageId) return <p>Sin imagen</p>

  return <ImageLoader imageId={imageId} />
}

export default FotoDePerfil
