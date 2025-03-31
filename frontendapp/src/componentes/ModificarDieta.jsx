import { useState, useEffect } from 'react'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'
import { useToast } from '@chakra-ui/react'
import { DietaModificable } from './DietaModificable'
import { useDietsPlans } from '../hooks/useDietsPlans'
import { useNavigate } from 'react-router-dom'

export function ModificarDieta ({ tituloPrevio }) {
  const [days, setDays] = useState([])
  const [dietName, setDietName] = useState('')
  const { dietas } = useDietsPlans()

  const [error, setError] = useState(null)
  const toast = useToast()

  const navigate = useNavigate()

  useEffect(() => {
    if (dietas && tituloPrevio) {
      const dietaEncontrada = dietas.find(
        (dieta) => dieta.title === tituloPrevio
      )

      if (!dietaEncontrada) {
        setError('No tienes ninguna dieta con el título: ' + tituloPrevio)
        return // Detiene la ejecución si no se encuentra el entrenamiento
      } else {
        setError(null)
      }

      setDietName(dietaEncontrada.title)
      setDays(dietaEncontrada.days)
    }
  }, [dietas, tituloPrevio]) // Dependencias para que se ejecute cuando cambian

  const modificarDieta = async () => {
    const dietData = {
      dietName,
      days
    }
    if (dietName === '') {
      toast({
        title: 'El titulo es obligatorio',
        status: 'warning',
        duration: 5000,
        isClosable: true
      })
      return
    }

    try {
      const response = await axios.post(`${ENDPOINTS.USER.MODIFYDIET}?titulo=${tituloPrevio}`, dietData, {
        validateStatus: function (status) {
          return status >= 200 && status < 500 // Acepta códigos 2xx y 4xx
        }
      })
      if (response.status === 409) {
        toast({
          title: 'Error: Conflicto al guardar la dieta',
          description: response.data.error || 'Ya existe una dieta con ese título.',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      } else if (response.status === 201) {
        navigate('/perfil')
        toast({
          title: 'Dierta guardada correctamente',
          status: 'success',
          duration: 5000,
          isClosable: true
        })
      } else if (response.status === 401) {
        toast({
          title: 'Debes estar autenticado para realizar esta accion',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    } catch (error) {
      toast({
        title: 'Error al guardar la dieta',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }
  if (error) {
    return error
  }
  return (
    <DietaModificable days={days} setDays={setDays} dietName={dietName} setDietName={setDietName} buttonText='Guardar cambios' buttonAction={modificarDieta} textTitle='Modificar dieta' />
  )
};
