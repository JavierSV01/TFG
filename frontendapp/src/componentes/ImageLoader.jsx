import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Box, Image, Spinner, Text } from '@chakra-ui/react'
import { ENDPOINTS } from '../constantes/endponits'

function ImageLoader ({ imageId }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageSrc, setImageSrc] = useState('')

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(ENDPOINTS.IMAGE.GETIMAGE + `?id=${imageId}`, { responseType: 'blob' })
        const imageObjectURL = URL.createObjectURL(response.data)
        setImageSrc(imageObjectURL)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching image:', error)
        setError('Error al cargar la imagen.')
        setLoading(false)
      }
    }

    if (imageId) {
      setLoading(true)
      setError(null)
      setImageSrc('')
      fetchImage()
    }
  }, [imageId])

  return (
    <Box p={2}>
      {loading && (
        <Box display='flex' justifyContent='center' alignItems='center' minH='100px'>
          <Spinner size='md' color='blue.500' />
          <Text ml={2}>Cargando imagen...</Text>
        </Box>
      )}
      {error && (
        <Box color='red.500'>
          <Text>{error}</Text>
        </Box>
      )}
      {imageSrc && !loading && !error && (
        <Image borderRadius='3xl' src={imageSrc} alt='Imagen cargada' maxW='100%' maxHeight='500px' />
      )}
      {!imageId && (
        <Box color='gray.500'>
          <Text>Por favor, proporciona una URL de imagen.</Text>
        </Box>
      )}
    </Box>
  )
}

export default ImageLoader
