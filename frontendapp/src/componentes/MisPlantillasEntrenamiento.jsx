import { Box, Button, Heading, Stack } from '@chakra-ui/react'
import { usePlantillasEntrenamiento } from '../hooks/usePlantillasEntrenamiento'
import { useNavigate } from 'react-router-dom'

function MisPlantillasEntrenamiento () {
  const { plantillas } = usePlantillasEntrenamiento()
  const navigate = useNavigate()
  return (
    <Box>
      <Heading as='h1' mb={6}>
        Mis Plantillas de Entrenamiento
      </Heading>
      <Stack spacing={6}>
        {plantillas.map((plantilla, index) => (
          <li key={index}>
            <h2>{plantilla.title}
              <Button margin='2' size='sm' onClick={() => { navigate(`/modificarEntrenamiento/${plantilla.title}`) }}>Modificar</Button>
              <Button margin='2' size='sm' onClick={() => {}}>Borrar</Button>
            </h2>

          </li>
        ))}
      </Stack>
    </Box>
  )
}

export default MisPlantillasEntrenamiento
