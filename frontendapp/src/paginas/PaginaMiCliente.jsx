import React, { useState } from 'react'
import axios from 'axios'
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Stack,
  Divider,
  ChakraProvider,
  Select,
  Button,
  HStack,
  useToast,
  IconButton,
  useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalFooter
} from '@chakra-ui/react'

import { ImageEvolutionView } from '../componentes/ImageEvolutionView'
import colors from '../constantes/colores'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthCheck } from '../hooks/useAuthCheck'
import { useClientInfo } from '../hooks/useClientInfo'
import { usePlantillasEntrenamiento } from '../hooks/usePlantillasEntrenamiento'
import { ENDPOINTS } from '../constantes/endponits'
import { ViewIcon, DeleteIcon } from '@chakra-ui/icons'
import { useUserNameId } from '../hooks/useUserNameId'
import BotonChat from '../componentes/BotonChat'
import GraficasAtributos from '../componentes/GraficasAtributos'
import { useDietsPlans } from '../hooks/useDietsPlans'
import FotoDePerfil from '../componentes/FotoDePerfil'

export function PaginaMiCliente () {
  const { username } = useUserNameId()

  const { authenticated, message } = useAuthCheck()
  const { usuario } = useParams()
  const { userData, loading, error, reload } = useClientInfo(usuario)

  const [selectedOptionEntrenamieto, setSelectedOptionEntrenamieto] = useState('')
  const { plantillas } = usePlantillasEntrenamiento()
  const [selectedOptionDieta, setSelectedOptionDieta] = useState('')
  const { dietas } = useDietsPlans()

  const toast = useToast()
  const navigate = useNavigate()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [entrenamientoAEliminar, setEntrenamientoAEliminar] = useState(null)

  const handleChangeEntrenamieto = (e) => {
    setSelectedOptionEntrenamieto(e.target.value)
  }

  const handleChangeDieta = (e) => {
    setSelectedOptionDieta(e.target.value)
  }

  const handlePostAgregarEntrenamiento = async () => {
    console.log('Opción seleccionada:', selectedOptionEntrenamieto)
    if (!selectedOptionEntrenamieto) {
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
      const idEntrenamiento = selectedOptionEntrenamieto
      const data = {
        cliente: usuario,
        id_workout: idEntrenamiento
      }
      axios.defaults.withCredentials = true
      const respuesta = await axios.post(ENDPOINTS.ASSOCIATION.ADDWORKOUT, data)

      if (respuesta.status === 201) {
        reload()
        setSelectedOptionEntrenamieto('')
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

  const handlePostAgregarDieta = async () => {
    console.log('Opción seleccionada:', selectedOptionDieta)
    if (!selectedOptionDieta) {
      console.log('No se ha seleccionado una opción')
      toast({
        title: 'Error',
        description: 'Selecciona una opción antes de agregar la dieta.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      return
    }
    try {
      const idDieta = selectedOptionDieta
      const data = {
        cliente: usuario,
        id_diet: idDieta
      }
      axios.defaults.withCredentials = true
      const respuesta = await axios.put(ENDPOINTS.ASSOCIATION.PUTDIET, data)

      if (respuesta.status === 201) {
        reload()
        setSelectedOptionEntrenamieto('')
        toast({
          title: 'Dieta agregada',
          description: 'La dieta fue agregada correctamente.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un error al agregar la dieta.' + error,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      console.error('Error en la petición:', error)
    }
  }

  const confirmarEliminacion = (usuarioCliente, workoutId) => {
    setEntrenamientoAEliminar({ usuarioCliente, workoutId })
    onOpen() // Abre el modal
  }

  const handleDeleteEntrenamiento = async () => {
    if (!entrenamientoAEliminar) return

    try {
      axios.defaults.withCredentials = true
      await axios.delete(ENDPOINTS.ASSOCIATION.REMOVEWORKOUT, {
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({
          cliente: entrenamientoAEliminar.usuarioCliente,
          id_workout: entrenamientoAEliminar.workoutId
        })
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
    } finally {
      setEntrenamientoAEliminar(null)
      onClose() // Cierra el modal después de la acción
    }
  }
  const handleViewEntrenamiento = async (usuarioCliente, workoutId) => {
    try {
      navigate(`/cliente/${usuarioCliente}/${workoutId}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un error ver el entrenamiento. ' + error,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  if (!authenticated) {
    return <Box minH='100vh' bgColor={colors.neutral}>{message}</Box>
  } else if (loading) {
    return <Box minH='100vh' bgColor={colors.neutral}>Cargando...</Box>
  } else if (error) {
    return <Box minH='100vh' bgColor={colors.neutral}>Error: {error}</Box>
  }
  return (
    <ChakraProvider>
      <Box minH='100vh' bg={colors.neutral} p={10}>
        <Grid
          templateColumns={{
            base: '1fr',
            lg: '1fr 2fr'
          }}
          gap={10}
        >
          <GridItem>
            <Box
              display='flex'
              flexDirection='column' // Para que los elementos se apilen verticalmente
              alignItems='center'
            >
              <FotoDePerfil username={usuario} />
              <BotonChat user1={username} user2={usuario} />
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
                                  onClick={() => handleViewEntrenamiento(asociacion.usuarioCliente, entrenamiento._id.$oid)}
                                />
                                <IconButton
                                  icon={<DeleteIcon />}
                                  aria-label='Borrar'
                                  bgColor={colors.secondary}
                                  textColor={colors.white}
                                  _hover={{ bgColor: colors.primary, color: colors.neutral }}
                                  ml={2}
                                  onClick={() => confirmarEliminacion(asociacion.usuarioCliente, entrenamiento._id.$oid)}
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
                    <Select placeholder='Selecciona una opción' onChange={handleChangeEntrenamieto}>
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
                <Heading as='h3' size='md'>Dieta</Heading>
                <Box p={4}>

                  {userData.asociacion?.map((asociacion, idx) => {
                    const dietaData = asociacion.dietaData
                    if (!dietaData) {
                      return (<div key={asociacion._id.$oid}>Sin dieta</div>)
                    }
                    const fecha = new Date(asociacion.dietaData?.fecha.$date).toLocaleString()
                    const [detalle] = asociacion.dietaData?.dieta
                    return (
                      <div key={asociacion._id.$oid} alignItems='center'>

                        <div key={idx}>
                          <Box
                            p={2}
                            mb={2}
                            display='flex'
                            alignItems='center'
                            textColor={colors.primary}
                            fontSize={16}
                          >
                            <Box width='65%'>
                              <Text>Dieta: {detalle?.title}</Text>
                              <Text>Fecha: {fecha}</Text>
                            </Box>
                            <Box width='35%' textAlign='end'>
                              <IconButton
                                icon={<ViewIcon />}
                                aria-label='Ver'
                                bgColor={colors.secondary}
                                textColor={colors.white}
                                _hover={{ bgColor: colors.primary, color: colors.neutral }}
                                onClick={() => { navigate(`/cliente/${usuario}/dieta`) }}
                              />
                            </Box>
                          </Box>
                          <Box position='relative'>
                            <Divider borderColor={colors.white} />
                          </Box>
                        </div>

                      </div>
                    )
                  })}

                  <Divider />

                  <HStack mt={2} spacing={4}>
                    <Select placeholder='Selecciona una opción' onChange={handleChangeDieta}>
                      {dietas?.map((dieta, index) => (
                        <option key={index} value={dieta.title}>
                          {dieta.title}
                        </option>
                      ))}
                    </Select>
                    <Button colorScheme='blue' onClick={handlePostAgregarDieta}>
                      Agregar
                    </Button>
                  </HStack>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Heading as='h3' size='md'>Gráfica</Heading>
                <GraficasAtributos atributos={userData.attrDinamicos} />
              </Box>

              <Divider />

              <Box>
                <Heading as='h3' size='md'>Evolucion fisica</Heading>
                <ImageEvolutionView imagenes={userData.evolucionFisica} />
              </Box>

            </Stack>
          </GridItem>

        </Grid>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Eliminación</ModalHeader>
          <ModalBody>
            <Text>¿Estás seguro de que deseas eliminar este entrenamiento?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={handleDeleteEntrenamiento}>
              Sí, borrar
            </Button>
            <Button variant='ghost' onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  )
}
