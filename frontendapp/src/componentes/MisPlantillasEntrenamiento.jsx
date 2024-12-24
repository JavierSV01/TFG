import { Box, Button, Heading, Stack } from '@chakra-ui/react'
import { usePlantillasEntrenamiento } from '../hooks/usePlantillasEntrenamiento'

function MisPlantillasEntrenamiento () {
  const { plantillas } = usePlantillasEntrenamiento()

  return (
    <Box>
      <Heading as='h1' mb={6}>
        Mis Plantillas de Entrenamiento
      </Heading>
      <Stack spacing={6}>
        {plantillas.map((plantilla, index) => (
          <li key={index}>
            <h2>{plantilla.title}
              <Button margin='2' size='sm' onClick={() => {}}>Botón 1</Button>
              <Button margin='2' size='sm' onClick={() => {}}>Botón 2</Button>

            </h2>

          </li>
        ))}
      </Stack>
    </Box>
  )
}

export default MisPlantillasEntrenamiento
