import React from 'react'
import Navbar from './Navbar'
import { useAuthCheck } from '../hooks/useAuthCheck'

import { ChakraProvider, Box } from '@chakra-ui/react'

export function PaginaPrincipal () {
  const { authenticated, message } = useAuthCheck()

  if (!authenticated) {
    return <div>{message}</div>
  }

  return (
    <ChakraProvider>

      <Navbar />
      <Box bg='blue.500' color='white' minH='100vh' p={6}>

        <h1 color='white'>{message}  </h1>
      </Box>
    </ChakraProvider>
  )
}
