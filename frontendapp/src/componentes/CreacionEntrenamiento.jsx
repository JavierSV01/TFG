import React, { useState } from 'react'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'
import { EntrenamientoModificable } from './EntrenamientoModificable'
import { useToast } from '@chakra-ui/react'

export function CreacionEntrenamiento () {
  const [weeks, setWeeks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const toast = useToast()

  const saveTraining = async () => {
    const trainingData = {
      title,
      description,
      weeks // Usa el array de semanas que tienes en el estado
    }
    try {
      const response = await axios.post(ENDPOINTS.USER.WORKOUT, trainingData, {
        validateStatus: function (status) {
          return status >= 200 && status < 500 // Acepta códigos 2xx y 4xx
        }
      })

      if (response.status === 201) {
        toast({
          title: 'Entrenamiento guardado correctamente',
          status: 'success',
          duration: 5000,
          isClosable: true
        })
        setWeeks([])
        setTitle('')
        setDescription('')
        console.log(response.data.message)
      } else if (response.status === 409) {
        toast({
          title: 'Error: Conflicto al guardar el entrenamiento',
          description: response.data.error || 'Ya existe un entrenamiento con ese título.',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      } else {
        toast({
          title: 'Error del servidor',
          description: response.data.message || 'Ocurrió un error al guardar el entrenamiento.',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    } catch (error) {
      // Manejar errores de red u otros errores inesperados
      toast({
        title: 'Error inesperado',
        description: error.message || 'No se pudo guardar el entrenamiento.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      console.error('Error al guardar el entrenamiento:', error)
    }
  }

  return (
    <EntrenamientoModificable
      weeks={weeks} setWeeks={setWeeks}
      title={title} setTitle={setTitle}
      description={description} setDescription={setDescription}
      buttonText='Guardar entrenamieto' buttonAction={saveTraining}
    />
  )
}
