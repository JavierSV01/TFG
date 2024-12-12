import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'
import { Box, Button, Heading, Stack } from '@chakra-ui/react'

function MisPlantillasEntrenamiento () {
  const [plantillas, setPlantillas] = useState([])

  useEffect(() => {
    axios
      .get(ENDPOINTS.USER.WORKOUTS)
      .then((response) => {
        setPlantillas(response.data)
      })
      .catch((error) => {
        console.error('Error al obtener las plantillas:', error)
      })
  }, [])

  return (
    <Box>
      <Heading as='h1' mb={6}>
        Mis Plantillas de Entrenamiento
      </Heading>
      <Stack spacing={6}>
        {plantillas.map((plantilla, index) => (
          <li key={index}>
            <h2>{plantilla.title}</h2>
            <Button size='sm' onClick={() => {}}>Botón 1</Button>
            <Button size='sm' onClick={() => {}}>Botón 2</Button>
          </li>
        ))}
      </Stack>
    </Box>
  )
}

export default MisPlantillasEntrenamiento
