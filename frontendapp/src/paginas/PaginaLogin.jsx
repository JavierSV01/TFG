import { Login } from '../componentes/Login'
import { ChakraProvider, Box, Button, HStack } from '@chakra-ui/react'
import { Registro } from '../componentes/Registro'
import { useState } from 'react'
import colors from '../constantes/colores'

export function PaginaLogin () {
  const [isLogin, setIsLogin] = useState(true)
  return (
    <ChakraProvider>
      <Box
        minH='100vh'
        display='flex'
        alignItems='center'
        justifyContent='center'
        bg={colors.neutral}
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
              bgColor={isLogin ? colors.primary : colors.neutral}
              textColor={isLogin ? colors.white : colors.primary}
              _hover={{ bgColor: colors.white, textColor: colors.primary }}
              onClick={() => setIsLogin(true)}
              width='full'
            >
              Iniciar Sesión
            </Button>
            <Button
              bgColor={!isLogin ? colors.primary : colors.neutral}
              textColor={!isLogin ? colors.white : colors.primary}
              _hover={{ bgColor: colors.white, textColor: colors.primary }}
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
