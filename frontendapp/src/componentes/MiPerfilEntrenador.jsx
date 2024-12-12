import { React } from 'react'
import { ChakraProvider, Box, Heading, Flex, List, ListItem } from '@chakra-ui/react'
import Navbar from './Navbar'
import MisClientes from '../componentes/MisClientes'
import SolicitudesAsesoramiento from '../componentes/SolicitudesAsesoramiento'
import colors from '../constantes/colores'
import MisPlantillasEntrenamiento from './MisPlantillasEntrenamiento'

export function MiPerfilEntrenador () {
  const margen = 10
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
              <MisPlantillasEntrenamiento />
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

          <Box bg={colors.secondary} borderRadius='3xl' p={margen} width='100%' display='flex' flexDirection='column' alignItems='start' justifyContent='center'>
            <Heading color={colors.white} size='lg' mb={4}>Solicutudes asesoramiento</Heading>
            <SolicitudesAsesoramiento />
          </Box>

        </Flex>
      </Box>
    </ChakraProvider>
  )
}
