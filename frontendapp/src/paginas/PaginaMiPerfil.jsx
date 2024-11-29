import React from 'react'
import Navbar from '../componentes/Navbar'
import { useAuthCheck } from '../hooks/useAuthCheck'
import { Box, Heading, List, ListItem, Flex, ChakraProvider } from '@chakra-ui/react'
import { useUserRole } from '../context/useUserRole'
import SolicitudesAsesoramiento from '../componentes/SolicitudesAsesoramiento'
import MisClientes from '../componentes/MisClientes'
import colors from '../constantes/colores'
import { MiPerfilCliente } from '../componentes/MiPerfilCliente'

export function PaginaMiPerfil () {
  const { authenticated, message } = useAuthCheck()
  const { role } = useUserRole()

  const margen = 10

  if (!authenticated) {
    return <div>{message}</div>
  }
  if (role === 'entrenador') {
    return (

      <ChakraProvider>
        <Navbar />
        <Box bg={colors.neutral} color={colors.white} minH='100vh' p={margen}>
          {/* Contenedor principal usando Flex */}
          <Flex direction='column' gap={margen}>
            {/* Sección de "Mis Clientes" */}
            <Box bg={colors.secondary} borderRadius='3xl' p={margen} width='100%' display='flex' flexDirection='column' alignItems='start' justifyContent='center'>
              <Heading color={colors.white} size='lg' mb={4}>Mis Clientes</Heading>
              <MisClientes />
            </Box>

            {/* Sección de "Mis Entrenamientos" y "Mis Dietas" en dos columnas */}
            <Flex direction={{ base: 'column', md: 'row' }} gap={margen}>
              <Box bg={colors.secondary} borderRadius='3xl' p={margen} flex={1} display='flex' flexDirection='column' alignItems='start' justifyContent='center'>
                <Heading color={colors.white} size='lg' mb={4}>Mis Entrenamientos</Heading>
                <List spacing={3}>
                  <ListItem>Entrenamiento de Fuerza - Semana 1</ListItem>
                  <ListItem>Cardio y Resistencia - Semana 2</ListItem>
                  <ListItem>Entrenamiento HIIT - Semana 3</ListItem>
                  <ListItem>Cardio y Resistencia - Semana 2</ListItem>
                  <ListItem>Entrenamiento HIIT - Semana 3</ListItem>
                </List>
              </Box>
              <Box bg={colors.secondary} borderRadius='3xl' p={margen} flex={1} display='flex' flexDirection='column' alignItems='start' justifyContent='center'>
                <Heading color={colors.white} size='lg' mb={4}>Mis Dietas</Heading>
                <List spacing={3}>
                  <ListItem>Dieta para Ganancia Muscular</ListItem>
                  <ListItem>Dieta de Definición</ListItem>
                  <ListItem>Dieta de Mantenimiento</ListItem>
                </List>
              </Box>
            </Flex>

            {/* Sección de "Notificaciones" */}

            <Box bg={colors.secondary} borderRadius='3xl' p={margen} width='100%' display='flex' flexDirection='column' alignItems='start' justifyContent='center'>
              <Heading color={colors.white} size='lg' mb={4}>Solicutudes asesoramiento</Heading>
              <SolicitudesAsesoramiento />
            </Box>

          </Flex>
        </Box>
      </ChakraProvider>

    )
  } else {
    return (
      <MiPerfilCliente />
    )
  }
}
