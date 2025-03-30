import { useState } from 'react'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'
import { useToast } from '@chakra-ui/react'

import { DietaModificable } from './DietaModificable'

export function CrearDieta () {
  const [days, setDays] = useState([])

  const [dietName, setDietName] = useState('')

  const toast = useToast()

  const saveDiet = async () => {
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
      await axios.post(ENDPOINTS.USER.DIET, dietData)
      setDays([])
      setDietName('')
      toast({
        title: 'Dierta guardada correctamente',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: 'Error al guardar la dieta',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  return (
    <DietaModificable days={days} setDays={setDays} dietName={dietName} setDietName={setDietName} buttonText='Guardar nueva dieta' buttonAction={saveDiet} textTitle='Crear dieta' />
  )
};
