import { Login } from './Login'
import { ChakraProvider, Box, Button, HStack } from '@chakra-ui/react'
import { Registro } from '../componentes/Registro'
import { useState } from 'react'

export function PaginaInicio () {
  const [isLogin, setIsLogin] = useState(true)
  return (
    <ChakraProvider>
      <Box
        minH='100vh'
        display='flex'
        alignItems='center'
        justifyContent='center'
        bg='gray.100'
      >
        <Box
          bg='white'
          p={8}
          rounded='md'
          shadow='md'
          width={{ base: '90%', md: '400px' }}
        >

          <HStack spacing={4} mb={6}>
            <Button
              colorScheme={isLogin ? 'blue' : 'gray'}
              onClick={() => setIsLogin(true)}
              width='full'
            >
              Iniciar Sesión
            </Button>
            <Button
              colorScheme={!isLogin ? 'blue' : 'gray'}
              onClick={() => setIsLogin(false)}
              width='full'
            >
              Registrarse
            </Button>
          </HStack>

          {/* Renderizar condicionalmente el formulario de Login o Registro */}
          {isLogin ? <Login /> : <Registro />}
        </Box>
      </Box>
    </ChakraProvider>
  )
}
