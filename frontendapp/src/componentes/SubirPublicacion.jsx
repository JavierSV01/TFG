import React, { useState, useCallback, useEffect } from 'react'
import axios from 'axios' // Importa axios
import { useImageSelection } from '../hooks/useImageSelection'
import ImageSelector from './ImageSelector'
import {
  Input,
  Box,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
  Progress, // Usaremos Progress para el progreso de subida
  Text // Para mostrar el porcentaje
} from '@chakra-ui/react'
import { ENDPOINTS } from '../constantes/endponits'

export function SubirPublicacion () {
  const { selectedFile, previewUrl, selectionError, getInputProps, clearSelection } = useImageSelection()
  const [uploadStatus, setUploadStatus] = useState({ message: '', type: null })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0) // Estado para el progreso

  const [inputText, setInputText] = useState('')
  const [tieneTexto, setTieneTexto] = useState(false)

  const handleInputChange = (event) => {
    setInputText(event.target.value)
  }

  useEffect(() => {
    setTieneTexto(inputText.length > 0)
  }, [inputText])

  const handleProfileUpload = useCallback(async () => {
    if (!selectedFile) {
      setUploadStatus({ message: 'Primero selecciona una imagen.', type: 'error' })
      return
    }

    setIsUploading(true)
    setUploadProgress(0) // Resetear progreso al iniciar
    setUploadStatus({ message: 'Subiendo foto...', type: 'info' })
    const formData = new FormData()
    formData.append('foto', selectedFile)
    formData.append('text', inputText)
    formData.append('tipo', '1')
    // Configuración para axios, incluyendo onUploadProgress
    const config = {
      headers: {
        // ¡Importante! Axios detecta FormData y establece
        // 'Content-Type': 'multipart/form-data' automáticamente
        // con el boundary correcto. NO lo establezcas manualmente aquí.
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        setUploadProgress(percentCompleted)
      }
    }

    try {
      // Realizar la petición POST con axios
      const response = await axios.post(ENDPOINTS.PUBLICACION.POSTPUBLICACION1, formData, config)

      // Axios considera éxito si el status es 2xx
      // response.data ya contiene el cuerpo de la respuesta parseado (si es JSON)
      setUploadStatus({ message: `Publicacion subida! ${response.data.message || ''}`, type: 'success' })
      clearSelection()
      setUploadProgress(0) // Resetear progreso al finalizar con éxito
    } catch (error) {
      // Axios lanza un error para respuestas no 2xx
      console.error('Error al subir la publicacion:', error)
      let errorMessage = 'Error al subir la publicacion.'
      if (error.response) {
        // El servidor respondió con un estado fuera del rango 2xx
        console.error('Data:', error.response.data)
        console.error('Status:', error.response.status)
        console.error('Headers:', error.response.headers)
        // Intenta obtener el mensaje del cuerpo de la respuesta de error
        errorMessage = error.response.data?.message || `Error del servidor: ${error.response.status}`
      } else if (error.request) {
        // La petición se hizo pero no se recibió respuesta
        console.error('Request:', error.request)
        errorMessage = 'No se recibió respuesta del servidor. Verifica tu conexión.'
      } else {
        // Algo ocurrió al configurar la petición
        console.error('Error Message:', error.message)
        errorMessage = `Error: ${error.message}`
      }
      setUploadStatus({ message: errorMessage, type: 'error' })
      setUploadProgress(0) // Resetear progreso en caso de error
    } finally {
      setIsUploading(false)
    }
  }, [selectedFile, clearSelection, inputText])

  return (

    <Box display='flex' flexDirection={{ base: 'column', md: 'column' }}>
      {/* Contenedor para los dos primeros elementos */}
      <Box display='flex' flexDirection={{ base: 'column', md: 'row' }}>
        <Box width={{ base: 'full', md: '30%' }} p={4}>
          <ImageSelector
            label='Foto:'
            previewUrl={previewUrl}
            selectionError={selectionError}
            getInputProps={getInputProps}
            triggerText='Elegir nueva foto'
          />

          {/* Mostrar estado/feedback de la subida */}
          {uploadStatus.type && uploadStatus.type !== 'info' && ( // No mostrar el de 'info' si hay progreso
            <Alert status={uploadStatus.type} variant='subtle' borderRadius='md'>
              <AlertIcon />
              <AlertDescription>{uploadStatus.message}</AlertDescription>
            </Alert>
          )}

          {/* Barra de progreso y porcentaje durante la subida */}
          {isUploading && (
            <Box>
              <Progress size='sm' value={uploadProgress} hasStripe isAnimated={uploadProgress < 100} />
              <Text fontSize='xs' textAlign='right'>{uploadProgress}%</Text>
            </Box>
          )}
        </Box>

        <Box width={{ base: 'full', md: '70%' }} p={4}>
          <Text mb={4}>Comentario:</Text>
          <Input
            placeholder='Introduce texto'
            value={inputText}
            onChange={handleInputChange}
            size='md'
          />
        </Box>
      </Box>

      <Box width='full' p={4} mt={4}>
        <Button
          onClick={handleProfileUpload}
          colorScheme='blue'
          isLoading={isUploading}
          loadingText='Guardando...'
          isDisabled={!selectedFile || isUploading || !tieneTexto}
          width='full'
        >
          Subir publicacion
        </Button>
      </Box>
    </Box>

  )
}
