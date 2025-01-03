import React, { useState } from 'react'
import axios from 'axios'
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Image,
  Stack,
  Divider,
  VStack,
  ChakraProvider,
  Select,
  Button,
  HStack,
  useToast,
  IconButton
} from '@chakra-ui/react'
import Navbar from '../componentes/Navbar'
import colors from '../constantes/colores'
import { useParams } from 'react-router-dom'
import { useAuthCheck } from '../hooks/useAuthCheck'
import { useClientInfo } from '../hooks/useClientInfo'
import { usePlantillasEntrenamiento } from '../hooks/usePlantillasEntrenamiento'
import { ENDPOINTS } from '../constantes/endponits'
import { ViewIcon, DeleteIcon } from '@chakra-ui/icons'

export function PaginaCliente () {
  const cliente = {
    foto: 'https://img.decrypt.co/insecure/rs:fit:1920:0:0:0/plain/https://cdn.decrypt.co/wp-content/uploads/2024/11/chillguy-gID_7.jpg@webp', // Reemplaza con la URL de la foto del cliente
    dieta: [
      { dia: 'Lunes', comida: 'Pollo con arroz y ensalada' },
      { dia: 'Martes', comida: 'Pasta con vegetales' },
      { dia: 'Miércoles', comida: 'Salmón con quinoa' }
    ]
  }
  const { authenticated, message } = useAuthCheck()
  const { usuario } = useParams()
  const { userData, loading, error, reload } = useClientInfo(usuario)

  const [selectedOption, setSelectedOption] = useState('')
  const { plantillas } = usePlantillasEntrenamiento()

  const toast = useToast()

  const handleChange = (e) => {
    setSelectedOption(e.target.value)
  }

  const handlePostAgregarEntrenamiento = async () => {
    console.log('Opción seleccionada:', selectedOption)
    if (!selectedOption) {
      console.log('No se ha seleccionado una opción')
      toast({
        title: 'Error',
        description: 'Selecciona una opción antes de agregar un entrenamiento.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      return
    }
    try {
      const idEntrenamiento = selectedOption
      const data = {
        cliente: usuario,
        id_workout: idEntrenamiento
      }
      axios.defaults.withCredentials = true
      const respuesta = await axios.post(ENDPOINTS.ASSOCIATION.ADDWORKOUT, data)

      if (respuesta.status === 201) {
        reload()
        setSelectedOption('')
        toast({
          title: 'Entrenamiento agregado',
          description: 'El entrenamiento fue agregado correctamente.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un error al agregar el entrenamiento.' + error,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      console.error('Error en la petición:', error)
    }
  }

  const handleDeleteEntrenamiento = async (usuarioCliente, workoutId) => {
    try {
      axios.defaults.withCredentials = true
      await axios.delete(ENDPOINTS.ASSOCIATION.REMOVEWORKOUT, {
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ cliente: usuarioCliente, id_workout: workoutId })
      })
      reload()
      toast({
        title: 'Entrenamiento borrado',
        description: 'El entrenamiento fue borrado correctamente.',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un error al borrar el entrenamiento. ' + error,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  if (!authenticated) {
    return <div>{message}</div>
  } else if (loading) {
    return <div>Cargando...</div>
  } else if (error) {
    return <div>Error: {error}</div>
  }
  return (
    <ChakraProvider>
      <Navbar />
      <Box minH='100vh' bg={colors.neutral} p={10}>
        <Grid
          templateColumns={{
            base: '1fr',
            lg: '1fr 2fr'
          }}
          gap={10}
        >
          <GridItem>
            <Box boxShadow='md' borderRadius='lg' overflow='hidden'>
              <Image src={cliente.foto} alt='Foto del cliente' boxSize='100%' objectFit='cover' />
            </Box>
          </GridItem>
          <GridItem margin={5}>
            <Stack spacing={5}>
              <Box>
                <Heading as='h2' size='lg'>Información del Cliente</Heading>
                <Text><strong>Nombre:</strong> {userData?.datos?.nombre ? userData.datos.nombre : ''} </Text>
                <Text><strong>Edad:</strong> {userData?.datos?.edad ? userData.datos.edad : ''} años</Text>
                <Text><strong>Altura:</strong> {userData?.datos?.altura ? userData.datos.altura : ''}</Text>
                <Text><strong>Objetivo:</strong> {userData?.datos?.objetivo ? userData.datos.objetivo : ''}</Text>
              </Box>

              <Divider />

              <Box>
                <Heading as='h3' size='md'>Entrenamiento</Heading>
                <Box p={4}>

                  {userData.asociacion?.map((asociacion, idx) => (
                    <div key={asociacion._id.$oid} alignItems='center'>
                      {asociacion.entrenamientos?.map((entrenamiento, entIdx) => {
                      // Convierte la fecha a formato local
                        const fecha = new Date(entrenamiento.fecha.$date).toLocaleString()
                        // Asume que solo quieres mostrar el primer elemento del array "entrenamiento"
                        const [detalle] = entrenamiento.entrenamiento

                        return (
                          <div key={entIdx}>
                            <Box
                              p={2}
                              mb={2}
                              display='flex'
                              alignItems='center'
                              textColor={colors.primary}
                              fontSize={16}
                            >
                              <Box width='65%'>
                                <Text>Entrenamiento: {detalle?.title}</Text>
                                <Text>Fecha: {fecha}</Text>
                              </Box>
                              <Box width='35%' textAlign='end'>
                                <IconButton
                                  icon={<ViewIcon />}
                                  aria-label='Ver'
                                  bgColor={colors.secondary}
                                  textColor={colors.white}
                                  _hover={{ bgColor: colors.primary, color: colors.neutral }}
                                />
                                <IconButton
                                  icon={<DeleteIcon />}
                                  aria-label='Borrar'
                                  bgColor={colors.secondary}
                                  textColor={colors.white}
                                  _hover={{ bgColor: colors.primary, color: colors.neutral }}
                                  ml={2}
                                  onClick={() => handleDeleteEntrenamiento(asociacion.usuarioCliente, entrenamiento._id.$oid)}
                                />
                              </Box>
                            </Box>
                            <Box position='relative'>
                              <Divider borderColor={colors.white} />
                            </Box>
                          </div>
                        )
                      })}
                    </div>
                  ))}

                  <HStack mt={2} spacing={4}>
                    <Select placeholder='Selecciona una opción' onChange={handleChange}>
                      {plantillas.map((plantilla, index) => (
                        <option key={index} value={plantilla.title}>
                          {plantilla.title}
                        </option>
                      ))}
                    </Select>
                    <Button colorScheme='blue' onClick={handlePostAgregarEntrenamiento}>
                      Agregar
                    </Button>
                  </HStack>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Heading as='h3' size='md'>Dieta de esta Semana</Heading>
                <VStack align='start' spacing={3}>
                  {cliente.dieta.map((item, index) => (
                    <Text key={index}>
                      <strong>{item.dia}:</strong> {item.comida}
                    </Text>
                  ))}
                </VStack>
              </Box>
            </Stack>
          </GridItem>

        </Grid>
      </Box>

    </ChakraProvider>
  )
}
