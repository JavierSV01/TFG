import { React } from 'react'
import Navbar from '../componentes/Navbar'
import { Box, Heading, List, ListItem, Flex, ChakraProvider, Input, Stack, FormLabel, Button, useToast } from '@chakra-ui/react'
import { GraficaPeso } from '../GraficaPeso'
import colors from '../constantes/colores'
import { useUserNameId } from '../hooks/useUserNameId'
import { useUserData } from '../hooks/useUserData'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'
import MisEntrenadores from './MisEntrenadores'

export function MiPerfilCliente () {
  const { username } = useUserNameId()
  const { userData } = useUserData(username)
  const { register, handleSubmit } = useForm()
  const toast = useToast()

  const onSubmit = async (e) => {
    try {
      // Realizamos la petición POST con Axios
      const response = await axios.post(ENDPOINTS.USER.UPDATE_DATA, e, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 201) {
        toast({
          title: 'Datos actualizados',
          description: 'Tus datos personales han sido actualizados correctamente.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })
      }

      console.log('Respuesta del servidor:', response.data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al cargar las notificaciones.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })

      console.error('Error al enviar datos:', error)
    }
  }

  const margen = 10

  // Si los datos no están disponibles
  if (!userData) {
    return <div>Cargando...</div>
  }

  return (
    <ChakraProvider>
      <Navbar />
      <Box bg={colors.neutral} color={colors.white} minH='100vh' p={margen}>
        <Flex direction='column' gap={margen}>
          <Box bg={colors.secondary} borderRadius='3xl' p={margen} width='100%' display='flex' flexDirection='column' alignItems='start' justifyContent='center'>
            <Heading color={colors.white} size='lg' mb={4}>Mis Datos Personales</Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <FormLabel>Nombre:</FormLabel>
                <Input {...register('nombre')} type='text' defaultValue={userData?.datos?.nombre ? userData.datos.nombre : ''} placeholder='Introduce tu nombre completo' />

                <FormLabel>Edad:</FormLabel>
                <Input {...register('edad')} type='text' defaultValue={userData?.datos?.edad ? userData.datos.edad : ''} placeholder='Introduce tu edad' />

                <FormLabel>Altura:</FormLabel>
                <Input {...register('altura')} type='text' defaultValue={userData?.datos?.altura ? userData.datos.altura : ''} placeholder='Introduce tu altura' />

                <FormLabel>Objetivo:</FormLabel>
                <Input {...register('objetivo')} type='text' defaultValue={userData?.datos?.objetivo ? userData.datos.objetivo : ''} placeholder='Introduce tu objetivo' />

                <Button colorScheme='blue' type='submit' w='100%'>
                  Guardar
                </Button>
              </Stack>
            </form>

          </Box>

          <Flex direction={{ base: 'column', md: 'row' }} gap={margen}>

            <Box bg={colors.secondary} borderRadius='3xl' p={margen} flex={1} display='flex' flexDirection='column' alignItems='start' justifyContent='center'>
              <Heading color={colors.white} size='lg' mb={4}>Evolución de Peso</Heading>
              <Box bg={colors.neutral} borderRadius='3xl' p={4}>
                <GraficaPeso />
              </Box>
            </Box>

            <Box bg={colors.secondary} borderRadius='3xl' p={margen} flex={1} display='flex' flexDirection='column' alignItems='start' justifyContent='center'>
              <Heading color={colors.white} size='lg' mb={4}>Mis entrenadores</Heading>
              <MisEntrenadores />
            </Box>
          </Flex>

          <Box bg={colors.secondary} borderRadius='3xl' p={margen} width='100%' display='flex' flexDirection='column' alignItems='start' justifyContent='center'>
            <Heading color={colors.white} size='lg' mb={4}>Mis Notificaciones</Heading>
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
