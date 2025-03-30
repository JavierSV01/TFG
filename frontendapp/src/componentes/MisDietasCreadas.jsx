import { Box, Button, Heading, Stack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useDietsPlans } from '../hooks/useDietsPlans'

export function MisDietasCreadas () {
  const { dietas } = useDietsPlans()
  const navigate = useNavigate()
  return (
    <Box>
      <Heading as='h1' mb={6}>
        Mis Dietas
      </Heading>
      <Stack spacing={6}>
        {dietas.map((dieta, index) => (
          <li key={index}>
            <h2>{dieta.title}
              <Button margin='2' size='sm' onClick={() => { navigate(`/modificarDieta/${dieta.title}`) }}>Modificar</Button>
              <Button margin='2' size='sm' onClick={() => {}}>Borrar</Button>
            </h2>

          </li>
        ))}
      </Stack>
    </Box>
  )
}
