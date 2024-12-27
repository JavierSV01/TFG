import React from 'react'
import { useParams } from 'react-router-dom'
import { useAuthCheck } from '../hooks/useAuthCheck'
import { ChakraProvider, Box, Heading, Text } from '@chakra-ui/react'
import Navbar from '../componentes/Navbar'
import useMisAsociaciones from '../hooks/useMisAsociaciones'

export function PaginaMiEntrenador () {
  const { authenticated, message } = useAuthCheck()
  const { entrenador } = useParams()
  const asociaciones = useMisAsociaciones()
  const asociacion = asociaciones.find(asociacion => asociacion.usuarioEntrenador === entrenador)
  if (!authenticated) {
    return <div>{message}</div>
  } else if (!asociacion) {
    return <div>Usted no esta siendo asesorado por {entrenador}</div>
  } else {
    return (
      <ChakraProvider>
        <Navbar />
        <Box w='30%' display='flex' gap={4} p={4}>
          <Box borderWidth='1px' borderRadius='md' p={4}>
            <Heading size='md' mb={4}>Lista de Entrenamientos</Heading>
            {asociacion.entrenamientos?.map((entrenamiento, idx) => (
              <Box key={idx} mb={2} p={2} borderWidth='1px' borderRadius='md'>
                <Text fontWeight='bold'>{entrenamiento.entrenamiento.title}</Text>
                <Text fontSize='sm'>{entrenamiento.entrenamiento.description}</Text>
              </Box>
            ))}
          </Box>
          <Box flex='1' borderWidth='1px' borderRadius='md' p={4}>
            <Heading size='md' mb={4}>Detalle de Entrenamiento</Heading>
            <Text>Aquí va el detalle del entrenamiento seleccionado.</Text>
          </Box>
        </Box>
        <div>
          <h1>Mi Entrenador : {entrenador}</h1>
        </div>
      </ChakraProvider>
    )
  }
}
