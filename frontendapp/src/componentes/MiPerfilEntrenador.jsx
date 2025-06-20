import { React, useState } from 'react'
import { ChakraProvider, Box, Heading, Flex } from '@chakra-ui/react'
import MisClientes from '../componentes/MisClientes'
import SolicitudesAsesoramiento from '../componentes/SolicitudesAsesoramiento'
import colors from '../constantes/colores'
import MisPlantillasEntrenamiento from './MisPlantillasEntrenamiento'
import { MisDietasCreadas } from './MisDietasCreadas'
import FotoDePerfil from './FotoDePerfil'
import ProfileImageUploader from './ProfileImageUploader'
import { useUserNameId } from '../hooks/useUserNameId'

export function MiPerfilEntrenador () {
  const { username } = useUserNameId()
  const margen = 10

  const [recargarClientes, setRecargarClientes] = useState(false)

  const manejarAceptacionSolicitud = () => {
    // Cambia el estado para disparar un efecto en MisClientes
    setRecargarClientes(prev => !prev)
  }

  const [recargarImagen, setRecargarImagen] = useState(false)

  const manejarSubidaExitosa = () => {
    // Activa la recarga de la imagen
    setRecargarImagen(prev => !prev)
  }

  if (!username) {
    return <div>Cargando...</div>
  }
  return (
    <ChakraProvider>
      <Box bg={colors.neutral} color={colors.white} minH='100vh' p={margen}>
        {/* Contenedor principal usando Flex */}
        <Flex direction='column' gap={margen}>
          {/* Sección de "Mis Clientes" */}

          <Flex direction={{ base: 'column', md: 'row' }} gap={margen}>
            <Box bg={colors.secondary} borderRadius='3xl' p={margen} flex={1}>
              <Heading color={colors.white} size='lg' mb={4}>Mis Clientes</Heading>
              <MisClientes triggerRecarga={recargarClientes} />
            </Box>
            <Box bg={colors.secondary} borderRadius='3xl' p={margen} flex={1}>
              <Heading size='lg'>Foto de Perfil</Heading>
              <FotoDePerfil username={username} triggerRecarga={recargarImagen} />
              <ProfileImageUploader onUploadSuccess={manejarSubidaExitosa} />
            </Box>
          </Flex>

          {/* Sección de "Mis Entrenamientos" y "Mis Dietas" en dos columnas */}
          <Flex direction={{ base: 'column', md: 'row' }} gap={margen}>
            <Box bg={colors.secondary} borderRadius='3xl' p={margen} flex={1}>
              <MisPlantillasEntrenamiento />
            </Box>
            <Box bg={colors.secondary} borderRadius='3xl' p={margen} flex={1}>
              <MisDietasCreadas />
            </Box>
          </Flex>

          <Box bg={colors.secondary} borderRadius='3xl' p={margen} width='100%' display='flex' flexDirection='column' alignItems='start' justifyContent='center'>
            <Heading color={colors.white} size='lg' mb={4}>Solicutudes asesoramiento</Heading>
            <SolicitudesAsesoramiento onSolicitudAceptada={manejarAceptacionSolicitud} />
          </Box>

        </Flex>
      </Box>
    </ChakraProvider>
  )
}
