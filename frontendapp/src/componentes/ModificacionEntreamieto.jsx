import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { ENDPOINTS } from '../constantes/endponits'
import { EntrenamientoModificable } from './EntrenamientoModificable'
import { usePlantillasEntrenamiento } from '../hooks/usePlantillasEntrenamiento'

export function ModificacionEntrenamieto ({ tituloPrevio }) {
  const [weeks, setWeeks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const { plantillas } = usePlantillasEntrenamiento()
  const [error, setError] = useState(null)
  const toast = useToast()
  const navigate = useNavigate()
  useEffect(() => {
    if (plantillas && tituloPrevio) {
      const entrenamientoEncontrado = plantillas.find(
        (entrenamiento) => entrenamiento.title === tituloPrevio
      )

      if (!entrenamientoEncontrado) {
        setError('No tienes ningún entrenamiento con el título: ' + tituloPrevio)
        return // Detiene la ejecución si no se encuentra el entrenamiento
      } else {
        setError(null)
      }

      setTitle(entrenamientoEncontrado.title)
      setDescription(entrenamientoEncontrado.description)
      setWeeks(entrenamientoEncontrado.weeks)
    }
  }, [plantillas, tituloPrevio]) // Dependencias para que se ejecute cuando cambian

  const modificarEntrenamieto = async () => {
    const trainingData = {
      title,
      description,
      weeks
    }
    try {
      const response = await axios.post(`${ENDPOINTS.USER.MODIFYWORKOUT}?titulo=${tituloPrevio}`, trainingData)
      navigate('/perfil')
      console.log(response.data.message) // Mensaje de éxito
    } catch (error) {
      toast({
        title: 'Error del servidor',
        description: 'Ocurrió un error al modificar el entrenamiento.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      console.error('Error al guardar el entrenamiento:', error)
    }
  }

  if (error) {
    return error
  }

  return (
    <EntrenamientoModificable
      weeks={weeks} setWeeks={setWeeks}
      title={title} setTitle={setTitle}
      description={description} setDescription={setDescription}
      buttonText='Guardar cambios' buttonAction={modificarEntrenamieto}
    />
  )
}
