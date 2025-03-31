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

    if (title === '') {
      toast({
        title: 'El titulo es obligatorio',
        status: 'warning',
        duration: 5000,
        isClosable: true
      })
      return
    }

    try {
      const response = await axios.post(`${ENDPOINTS.USER.MODIFYWORKOUT}?titulo=${tituloPrevio}`, trainingData, {
        validateStatus: function (status) {
          return status >= 200 && status < 500 // Acepta códigos 2xx y 4xx
        }
      })
      if (response.status === 409) {
        toast({
          title: 'Error: Conflicto al guardar el entrenamiento',
          description: response.data.error || 'Ya existe un entrenamiento con ese título.',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      } else if (response.status === 201) {
        navigate('/perfil')
      } else if (response.status === 401) {
        toast({
          title: 'Debes estar autenticado para realizar esta accion',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
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
