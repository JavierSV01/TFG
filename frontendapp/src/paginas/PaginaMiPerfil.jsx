import React from 'react'
import Navbar from '../componentes/Navbar'
import { useAuthCheck } from '../hooks/useAuthCheck'
import { Box, Heading, List, ListItem, Flex, ChakraProvider } from '@chakra-ui/react'
import { useUserRole } from '../context/useUserRole'
import { GraficaPeso } from '../GraficaPeso'
import SolicitudesAsesoramiento from '../componentes/SolicitudesAsesoramiento'
import MisClientes from '../componentes/MisClientes'
import colors from '../constantes/colores'

export function PaginaMiPerfil () {
  const { authenticated, message } = useAuthCheck()
  const userRol = useUserRole()
  const margen = 8

  if (!authenticated) {
    return <div>{message}</div>
  }
  if (userRol === 'entrenador') {
    return (

      <ChakraProvider>
        <Navbar />
        <Box bg={colors.neutral} color={colors.dark} minH='100vh' p={margen}>
          {/* Contenedor principal usando Flex */}
          <Flex direction='column' gap={margen}>
            {/* Sección de "Mis Clientes" */}
            <Box bg={colors.accent} borderRadius='md' p={margen} width='100%' display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
              <Heading color={colors.dark} size='lg' mb={4}>Solicutudes asesoramiento</Heading>
              <MisClientes />
            </Box>

            {/* Sección de "Mis Entrenamientos" y "Mis Dietas" en dos columnas */}
            <Flex direction={{ base: 'column', md: 'row' }} gap={margen}>
              <Box bg={colors.accent} borderRadius='md' p={margen} flex={1} display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                <Heading color={colors.dark} size='lg' mb={4}>Mis Entrenamientos</Heading>
                <List spacing={3}>
                  <ListItem>Entrenamiento de Fuerza - Semana 1</ListItem>
                  <ListItem>Cardio y Resistencia - Semana 2</ListItem>
                  <ListItem>Entrenamiento HIIT - Semana 3</ListItem>
                  <ListItem>Cardio y Resistencia - Semana 2</ListItem>
                  <ListItem>Entrenamiento HIIT - Semana 3</ListItem>
                </List>
              </Box>
              <Box bg={colors.accent} borderRadius='md' p={margen} flex={1} display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                <Heading color={colors.dark} size='lg' mb={4}>Mis Dietas</Heading>
                <List spacing={3}>
                  <ListItem>Dieta para Ganancia Muscular</ListItem>
                  <ListItem>Dieta de Definición</ListItem>
                  <ListItem>Dieta de Mantenimiento</ListItem>
                </List>
              </Box>
            </Flex>

            {/* Sección de "Notificaciones" */}

            <Box bg={colors.accent} borderRadius='md' p={margen} width='100%' display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
              <Heading color={colors.dark} size='lg' mb={4}>Solicutudes asesoramiento</Heading>
              <SolicitudesAsesoramiento />
            </Box>

          </Flex>
        </Box>
      </ChakraProvider>

    )
  } else {
    return (
      <ChakraProvider>
        <Navbar />
        <Box bg={colors.neutral} color={colors.dark} minH='100vh' p={margen}>
          <Flex direction='column' gap={margen}>

            {/* Sección de "Mis Datos Personales" */}

            <Box bg={colors.accent} borderRadius='md' p={margen} width='100%' display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
              <Heading color={colors.dark} size='lg' mb={4}>Mis Datos Personales</Heading>
              <List spacing={3}>
                <ListItem>Nombre: Juan Pérez</ListItem>
                <ListItem>Edad: 30 años</ListItem>
                <ListItem>Altura: 1.75 m</ListItem>
                <ListItem>Peso actual: 70 kg</ListItem>
              </List>
            </Box>

            {/* Sección de "Evolución de Peso" y "Mi Evolución Física" */}
            <Flex direction={{ base: 'column', md: 'row' }} gap={margen}>

              {/* Gráfica de Evolución de Peso */}
              <Box bg={colors.accent} borderRadius='md' p={margen} flex={1} display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                <Heading color={colors.dark} size='lg' mb={4}>Evolución de Peso</Heading>
                {/* Aquí podrías integrar una librería de gráficos, como Chart.js o Recharts */}
                <Box bg={colors.neutral} borderRadius='md' p={4}>
                  {/* Espacio para la gráfica */}
                  <GraficaPeso />
                </Box>
              </Box>

              {/* Sección de "Mi Evolución Física" */}
              <Box bg={colors.accent} borderRadius='md' p={margen} flex={1} display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                <Heading color={colors.dark} size='lg' mb={4}>Mi Evolución Física</Heading>
                <Flex gap={4} wrap='wrap'>
                  {/* Imágenes de evolución física */}
                  <Box bg={colors.neutral} borderRadius='md' width='100px' height='100px' />
                  <Box bg={colors.neutral} borderRadius='md' width='100px' height='100px' />
                  <Box bg={colors.neutral} borderRadius='md' width='100px' height='100px' />
                </Flex>
              </Box>
            </Flex>

            {/* Sección de "Mis Notificaciones" */}

            <Box bg={colors.accent} borderRadius='md' p={margen} width='100%' display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
              <Heading color={colors.dark} size='lg' mb={4}>Mis Notificaciones</Heading>
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
