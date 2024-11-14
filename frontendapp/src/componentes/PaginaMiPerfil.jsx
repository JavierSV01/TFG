import React from 'react'
import Navbar from './Navbar'
import { useAuthCheck } from '../hooks/useAuthCheck'
import { Box, Heading, List, ListItem, Flex, ChakraProvider } from '@chakra-ui/react'
import { useUserRole } from '../context/useUserRole'
import { GraficaPeso } from '../GraficaPeso'
import Notificaciones from './SolicitudesAsesoramiento'

export function PaginaMiPerfil () {
  const { authenticated, message } = useAuthCheck()
  const userRol = useUserRole()

  if (!authenticated) {
    return <div>{message}</div>
  }
  console.log(userRol)
  if (userRol === 'entrenador') {
    return (

      <ChakraProvider>
        <Navbar />
        <Box bg='blue.500' color='white' minH='100vh' p={6}>
          {/* Contenedor principal usando Flex */}
          <Flex direction='column' gap={6}>
            {/* Sección de "Mis Clientes" */}

            <Box bg='blue.800' borderRadius='md' p={6} width='100%' display='flex' flexDirection='column' alignItems='center' justifyContent='center'>

              <Heading size='lg' mb={4}>Mis Clientes</Heading>
              <List spacing={3}>
                <ListItem>Cliente 1 - Juan Pérez</ListItem>
                <ListItem>Cliente 2 - María García</ListItem>
                <ListItem>Cliente 3 - Pedro López</ListItem>
                <ListItem>Cliente 4 - Laura Martínez</ListItem>
              </List>
            </Box>

            {/* Sección de "Mis Entrenamientos" y "Mis Dietas" en dos columnas */}
            <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
              <Box bg='blue.800' borderRadius='md' p={6} flex={1} display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                <Heading size='lg' mb={4}>Mis Entrenamientos</Heading>
                <List spacing={3}>
                  <ListItem>Entrenamiento de Fuerza - Semana 1</ListItem>
                  <ListItem>Cardio y Resistencia - Semana 2</ListItem>
                  <ListItem>Entrenamiento HIIT - Semana 3</ListItem>
                  <ListItem>Cardio y Resistencia - Semana 2</ListItem>
                  <ListItem>Entrenamiento HIIT - Semana 3</ListItem>
                </List>
              </Box>
              <Box bg='blue.800' borderRadius='md' p={6} flex={1} display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                <Heading size='lg' mb={4}>Mis Dietas</Heading>
                <List spacing={3}>
                  <ListItem>Dieta para Ganancia Muscular</ListItem>
                  <ListItem>Dieta de Definición</ListItem>
                  <ListItem>Dieta de Mantenimiento</ListItem>
                </List>
              </Box>
            </Flex>

            {/* Sección de "Notificaciones" */}

            <Box bg='blue.800' borderRadius='md' p={6} width='100%' display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
              <Heading size='lg' mb={4}>Notificaciones</Heading>
              <Notificaciones />
            </Box>

          </Flex>
        </Box>
      </ChakraProvider>

    )
  } else {
    return (
      <ChakraProvider>
        <Navbar />
        <Box bg='blue.500' color='white' minH='100vh' p={6}>
          <Flex direction='column' gap={6}>

            {/* Sección de "Mis Datos Personales" */}

            <Box bg='blue.800' borderRadius='md' p={6} width='100%' display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
              <Heading size='lg' mb={4}>Mis Datos Personales</Heading>
              <List spacing={3}>
                <ListItem>Nombre: Juan Pérez</ListItem>
                <ListItem>Edad: 30 años</ListItem>
                <ListItem>Altura: 1.75 m</ListItem>
                <ListItem>Peso actual: 70 kg</ListItem>
              </List>
            </Box>

            {/* Sección de "Evolución de Peso" y "Mi Evolución Física" */}
            <Flex direction={{ base: 'column', md: 'row' }} gap={6}>

              {/* Gráfica de Evolución de Peso */}
              <Box bg='blue.800' borderRadius='md' p={6} flex={1} display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                <Heading size='lg' mb={4}>Evolución de Peso</Heading>
                {/* Aquí podrías integrar una librería de gráficos, como Chart.js o Recharts */}
                <Box bg='gray.700' borderRadius='md' p={4}>
                  {/* Espacio para la gráfica */}
                  <GraficaPeso />
                </Box>
              </Box>

              {/* Sección de "Mi Evolución Física" */}
              <Box bg='blue.800' borderRadius='md' p={6} flex={1} display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                <Heading size='lg' mb={4}>Mi Evolución Física</Heading>
                <Flex gap={4} wrap='wrap'>
                  {/* Imágenes de evolución física */}
                  <Box bg='gray.600' borderRadius='md' width='100px' height='100px' />
                  <Box bg='gray.600' borderRadius='md' width='100px' height='100px' />
                  <Box bg='gray.600' borderRadius='md' width='100px' height='100px' />
                </Flex>
              </Box>
            </Flex>

            {/* Sección de "Mis Notificaciones" */}

            <Box bg='blue.800' borderRadius='md' p={6} width='100%' display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
              <Heading size='lg' mb={4}>Mis Notificaciones</Heading>
              <List spacing={3}>
                <ListItem>Nueva recomendación de ejercicio</ListItem>
                <ListItem>Actualización de dieta sugerida</ListItem>
                <ListItem>Recordatorio: Próxima sesión programada</ListItem>
              </List>
            </Box>
          </Flex>
        </Box>
      </ChakraProvider>
    )
  }
}
