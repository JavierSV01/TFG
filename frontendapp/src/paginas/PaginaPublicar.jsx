import { useAuthCheck } from '../hooks/useAuthCheck'
import { ChakraProvider, Box, Heading } from '@chakra-ui/react'
import colors from '../constantes/colores'
import { SubirPublicacion } from '../componentes/SubirPublicacion'
export function PaginaPublicar () {
  const { authenticated, message } = useAuthCheck()

  if (!authenticated) {
    return <div>{message}</div>
  }

  return (
    <ChakraProvider>
      <Box bg={colors.neutral} color={colors.white} minH='100vh' p={6}>
        <Box bg={colors.secondary} borderRadius='3xl' p={10} width='100%'>
          <Heading mb={10}> Nueva publicación</Heading>
          <SubirPublicacion />
        </Box>
      </Box>
    </ChakraProvider>
  )
}
