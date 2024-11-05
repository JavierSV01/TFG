import React from 'react'
import Navbar from './Navbar'
import { useAuthCheck } from '../hooks/useAuthCheck'
import { Box, Center, Heading, List, ListItem, Flex, ChakraProvider } from '@chakra-ui/react'

export function PaginaMiPerfil () {
  const { authenticated, message } = useAuthCheck()

  if (!authenticated) {
    return <div>{message}</div>
  }

  return (

    <ChakraProvider>

      <Navbar />
      <Box bg='blue.500' color='white' minH='100vh' p={6}>
        {/* Contenedor principal usando Flex */}
        <Flex direction='column' gap={6}>
          {/* Sección de "Mis Clientes" */}
          <Center>
            <Box bg='blue.800' borderRadius='md' p={6} width='100%'>
              <Heading size='lg' mb={4}>Mis Clientes</Heading>
              <List spacing={3}>
                <ListItem>Cliente 1 - Juan Pérez</ListItem>
                <ListItem>Cliente 2 - María García</ListItem>
                <ListItem>Cliente 3 - Pedro López</ListItem>
                <ListItem>Cliente 4 - Laura Martínez</ListItem>
              </List>
            </Box>
          </Center>

          {/* Sección de "Mis Entrenamientos" y "Mis Dietas" en dos columnas */}
          <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
            <Box bg='blue.800' borderRadius='md' p={6} flex={1}>
              <Heading size='lg' mb={4}>Mis Entrenamientos</Heading>
              <List spacing={3}>
                <ListItem>Entrenamiento de Fuerza - Semana 1</ListItem>
                <ListItem>Cardio y Resistencia - Semana 2</ListItem>
                <ListItem>Entrenamiento HIIT - Semana 3</ListItem>
                <ListItem>Cardio y Resistencia - Semana 2</ListItem>
                <ListItem>Entrenamiento HIIT - Semana 3</ListItem>
              </List>
            </Box>
            <Box bg='blue.800' borderRadius='md' p={6} flex={1}>
              <Heading size='lg' mb={4}>Mis Dietas</Heading>
              <List spacing={3}>
                <ListItem>Dieta para Ganancia Muscular</ListItem>
                <ListItem>Dieta de Definición</ListItem>
                <ListItem>Dieta de Mantenimiento</ListItem>
              </List>
            </Box>
          </Flex>

          {/* Sección de "Notificaciones" */}
          <Center>
            <Box bg='blue.800' borderRadius='md' p={6} width='100%'>
              <Heading size='lg' mb={4}>Notificaciones</Heading>
              <List spacing={3}>
                <ListItem>Nuevo mensaje de Juan Pérez</ListItem>
                <ListItem>Recordatorio: Actualiza tu dieta</ListItem>
                <ListItem>Próxima sesión de entrenamiento programada</ListItem>
              </List>
            </Box>
          </Center>
        </Flex>
      </Box>
    </ChakraProvider>
  )
}
