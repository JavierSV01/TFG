import { useAuthCheck } from '../hooks/useAuthCheck'
import { ChakraProvider, Box, Heading, Text } from '@chakra-ui/react'
import colors from '../constantes/colores'
import { SubirPublicacionComida } from '../componentes/SubirPublicacionComida'
import { useParams } from 'react-router-dom'
import useMisAsociaciones from '../hooks/useMisAsociaciones'

export function PaginaPublicarComida () {
  const { authenticated, message } = useAuthCheck()
  useMisAsociaciones()
  const { entrenador, dia, comida } = useParams()
  if (!authenticated) {
    return <div>{message}</div>
  }

  return (
    <ChakraProvider>
      <Box bg={colors.neutral} color={colors.white} minH='100vh' p={6}>
        <Box bg={colors.secondary} borderRadius='3xl' p={10} width='100%'>
          <Heading mb={10}>Nueva publicación de comida</Heading>
          <SubirPublicacionComida />
          <Text>{entrenador + dia + comida}</Text>
        </Box>
      </Box>
    </ChakraProvider>
  )
}
