import React, { useCallback, useState, useMemo, useEffect } from 'react'
import {
  ChakraProvider,
  Box,
  Text,
  Heading,
  Divider,
  Input,
  Grid,
  GridItem,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  IconButton,
  VStack, // Usar para espaciado vertical
  HStack, // Usar para alinear horizontalmente
  Card, // Para agrupar contenido de cada ejercicio
  CardHeader,
  CardBody,
  Tag, // Para mostrar RIR, Series Objetivo, Reps Objetivo
  Icon, // Para iconos
  Alert, // Para mostrar mensajes (si fuera necesario)
  AlertIcon,
  Spinner // Para estados de carga (si se implementan)
} from '@chakra-ui/react'
import { useParams, useNavigate } from 'react-router-dom'
import useMisAsociaciones from '../hooks/useMisAsociaciones' // Asegúrate que la ruta sea correcta
import { useAuthCheck } from '../hooks/useAuthCheck' // Asegúrate que la ruta sea correcta
import colors from '../constantes/colores' // Asegúrate que la ruta sea correcta
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits' // Asegúrate que la ruta sea correcta
import { useUserNameId } from '../hooks/useUserNameId' // Asegúrate que la ruta sea correcta
import { DeleteIcon, InfoIcon, AddIcon, CalendarIcon } from '@chakra-ui/icons' // Importar iconos necesarios

// --- Componente Principal Adaptado ---
export function PaginaDiaEntrenamiento () {
  const { authenticated, message } = useAuthCheck()
  const { username } = useUserNameId()
  const { entrenador, idEntrenamiento, semIndex, dayIndex } = useParams()
  const asociaciones = useMisAsociaciones() // Asumiendo que esto ya maneja la carga
  const [estadoEntrenamiento, setEstadoEntrenamiento] = useState('Sin empezar')
  const toast = useToast()
  const navigate = useNavigate()

  // --- Lógica para obtener datos (similar a como estaba) ---
  const asociacion = useMemo(() => {
    return asociaciones?.find(asoc => asoc.usuarioEntrenador === entrenador)
  }, [asociaciones, entrenador])

  const entrenamientoEncontrado = useMemo(() => {
    // Añadir validación más robusta por si falta alguna propiedad
    return asociacion?.entrenamientos?.find(ent => ent?._id?.$oid === idEntrenamiento)
  }, [asociacion, idEntrenamiento])

  const [diaEntrenamiento, setDiaEntrenamiento] = useState([])
  const [tituloEntrenamiento, setTituloEntrenamiento] = useState('')

  useEffect(() => {
    // Lógica más robusta para acceder a los datos
    const weekData = entrenamientoEncontrado?.entrenamiento?.[0]?.weeks?.[semIndex]
    const dayData = weekData?.days?.[dayIndex]

    if (dayData) {
      setEstadoEntrenamiento(dayData.estado || 'Sin empezar')
      setDiaEntrenamiento(dayData.exercises || [])
      setTituloEntrenamiento(entrenamientoEncontrado.entrenamiento[0].title || 'Entrenamiento')
    } else {
      setEstadoEntrenamiento('Sin empezar')
      setDiaEntrenamiento([])
      setTituloEntrenamiento('Entrenamiento')
      // Podrías mostrar un mensaje si no se encuentra el día específico
    }
  }, [entrenamientoEncontrado, semIndex, dayIndex])

  // --- Callbacks (sin cambios en lógica, solo nombres si quieres) ---
  const handleButtonAddSerie = useCallback((exerciseIndex) => {
    setDiaEntrenamiento((prevDia) => {
      const newDia = [...prevDia]
      const exercise = newDia[exerciseIndex]
      if (!exercise.series) {
        exercise.series = []
      }
      // Añadir valores por defecto o vacíos según prefieras
      exercise.series.push({ reps: '', weight: '' })
      return newDia
    })
  }, [])

  const handleButtonDeleteSerie = useCallback((exerciseIndex, serieIndex) => {
    setDiaEntrenamiento((prevDia) => {
      const newDia = [...prevDia]
      newDia[exerciseIndex].series.splice(serieIndex, 1)
      return newDia
    })
  }, [])

  const handlerGuardarDatos = useCallback(() => {
    // Asegúrate de que los parámetros necesarios están disponibles
    if (!entrenamientoEncontrado?._id?.$oid || !username) {
      toast({
        title: 'Error',
        description: 'Faltan datos necesarios para guardar.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      return
    }

    axios.defaults.withCredentials = true
    axios.put(ENDPOINTS.ASSOCIATION.UPDATEWORKOUT, {
      idEntrenamiento: entrenamientoEncontrado._id.$oid,
      idEntrenador: entrenador, // El entrenador viene de useParams
      idUsuario: username, // El ID del usuario logueado
      entrenamiento: diaEntrenamiento, // Solo los ejercicios del día actual
      estado: estadoEntrenamiento,
      semIndex,
      dayIndex
    })
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: 'Entrenamiento guardado',
            description: 'Los datos fueron guardados correctamente.',
            status: 'success',
            duration: 5000,
            isClosable: true
          })
        } else {
          throw new Error('Respuesta no exitosa')
        }
        console.log(res.data)
      })
      .catch((err) => {
        toast({
          title: 'Error al guardar',
          description: err.response?.data?.message || err.message || 'Ocurrió un error inesperado.',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
        console.error(err)
      })
  }, [entrenamientoEncontrado, diaEntrenamiento, entrenador, username, estadoEntrenamiento, semIndex, dayIndex, toast])

  const handleInputPesoChange = useCallback((exerciseIndex, serieIndex, value) => {
    setDiaEntrenamiento((prevDia) => {
      const newDia = [...prevDia]
      newDia[exerciseIndex].series[serieIndex].weight = value
      return newDia
    })
  }, [])

  const handleInputRepsChange = useCallback((exerciseIndex, serieIndex, value) => {
    setDiaEntrenamiento((prevDia) => {
      const newDia = [...prevDia]
      newDia[exerciseIndex].series[serieIndex].reps = value
      return newDia
    })
  }, [])

  const handlerExeciseTextChange = useCallback((index, value) => {
    setDiaEntrenamiento((prevDia) => {
      const newDia = [...prevDia]
      // Asegurarse que additionalInfo exista antes de asignarlo
      newDia[index] = { ...newDia[index], additionalInfo: value }
      return newDia
    })
  }, [])

  const handlerButtonEstado = useCallback(() => {
    setEstadoEntrenamiento((prevEstado) => {
      if (prevEstado === 'Sin empezar') return 'En proceso'
      if (prevEstado === 'En proceso') return 'Acabado'
      return 'Sin empezar'
    })
  }, [])

  // --- Estados de Carga, Error y Autenticación (simplificado, puedes añadir más como en el primer ejemplo si es necesario) ---
  if (!authenticated) {
    return (
      <ChakraProvider>
        <Box display='flex' justifyContent='center' alignItems='center' minH='100vh' bgColor={colors.neutral}>
          <Alert status='warning'>
            <AlertIcon />
            {message || 'Acceso no autorizado.'}
          </Alert>
        </Box>
      </ChakraProvider>
    )
  }

  // Puedes añadir un estado de carga aquí si `useMisAsociaciones` lo proporciona
  // if (loadingAsociaciones) return <Spinner />;

  if (!asociacion && !asociaciones) { // Podría ser que asociaciones aún no cargó
    return (
      <ChakraProvider>
        <Box display='flex' justifyContent='center' alignItems='center' minH='100vh' bgColor={colors.neutral}>
          <Spinner size='xl' color={colors.primary} />
          <Text ml={4} color={colors.primary}>Cargando asociaciones...</Text>
        </Box>
      </ChakraProvider>
    )
  }

  if (!asociacion) {
    return (
      <ChakraProvider>
        <Box display='flex' justifyContent='center' alignItems='center' minH='100vh' bgColor={colors.neutral}>
          <Alert status='error'>
            <AlertIcon />
            No se encontró asociación con el entrenador: {entrenador}.
          </Alert>
        </Box>
      </ChakraProvider>
    )
  }

  if (!entrenamientoEncontrado) {
    return (
      <ChakraProvider>
        <Box display='flex' justifyContent='center' alignItems='center' minH='100vh' bgColor={colors.neutral}>
          <Alert status='info' justifyContent='center'>
            <AlertIcon />
            No se encontró el plan de entrenamiento especificado.
          </Alert>
        </Box>
      </ChakraProvider>
    )
  }

  // --- Renderizado Principal Adaptado ---
  return (
    <ChakraProvider>
      {/* Contenedor principal */}
      <Box bgColor={colors.neutral} color={colors.primary} minH='100vh' py={8} px={{ base: 2, md: 4 }}>

        {/* Título Principal */}
        <Heading textAlign='center' size='xl' mb={4} color={colors.primary}>
          {tituloEntrenamiento}
        </Heading>
        <Heading textAlign='center' size='lg' mb={8} color={colors.primary} fontWeight='normal'>
          <Icon as={CalendarIcon} mr={2} /> Semana {parseInt(semIndex) + 1} - Día {parseInt(dayIndex) + 1}
          {/* Botón compartir opcional, estilizado */}
          <Button colorScheme='blue' onClick={() => navigate(`/publicarentrenamieto/${entrenador}/${entrenamientoEncontrado.entrenamiento[0].title}/${semIndex}/${dayIndex}`)} ml={4}>
            Compartir
          </Button>
        </Heading>

        {/* Mapeo de Ejercicios usando VStack y Card */}
        <VStack spacing={6} align='stretch'>
          {(
            diaEntrenamiento.map((ejercicio, index) => (
              <Card key={index} variant='outline' borderColor={colors.primary} borderWidth='1px'>
                <CardHeader bg={colors.primary} color={colors.white} py={2} px={4} borderTopRadius='md'>
                  <Heading size='md'>{ejercicio.name}</Heading>
                </CardHeader>
                <CardBody p={4}>
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                    {/* Columna Izquierda: Info Objetivo y Anotaciones */}
                    <GridItem>
                      <VStack spacing={4} align='stretch'>
                        {/* Información Objetivo */}
                        <Box>
                          <Text fontWeight='bold' mb={2}>Objetivo:</Text>
                          <HStack spacing={4} wrap='wrap'>
                            <Tag colorScheme='blue' variant='subtle'>Series: {ejercicio.sets}</Tag>
                            <Tag colorScheme='green' variant='subtle'>Reps: {ejercicio.reps}</Tag>
                            <Tag colorScheme='orange' variant='subtle'>RIR: {ejercicio.rir}</Tag>
                          </HStack>
                        </Box>

                        <Divider borderColor={colors.primary} />

                        {/* Anotaciones */}
                        <Box>
                          <HStack mb={2}>
                            <Icon as={InfoIcon} color={colors.secondary} />
                            <Text fontWeight='bold'>Tus Anotaciones:</Text>
                          </HStack>
                          <Input
                            id={`additional-info-${index}`}
                            placeholder='Sensaciones, molestias, intensidad...'
                            value={ejercicio.additionalInfo || ''} // Controlar el input
                            onChange={(e) => handlerExeciseTextChange(index, e.target.value)}
                            size='md'
                            borderColor='gray.300' // Darle un borde visible
                            focusBorderColor={colors.secondary}
                          />
                        </Box>
                      </VStack>
                    </GridItem>

                    {/* Columna Derecha: Registro de Series */}
                    <GridItem>
                      <VStack spacing={4} align='stretch'>
                        <HStack justify='space-between'>
                          <Text fontWeight='bold'>Registro de Series Realizadas:</Text>
                          <Button
                            leftIcon={<AddIcon />}
                            size='sm'
                            colorScheme='green' // Cambiar color para diferenciar de borrar
                            onClick={() => handleButtonAddSerie(index)}
                          >
                            Añadir Serie
                          </Button>
                        </HStack>

                        {(
                          <VStack spacing={3} align='stretch'>
                            {ejercicio.series?.map((serie, sIndex) => (
                              <HStack
                                key={sIndex}
                                p={2}
                                borderWidth='1px'
                                borderColor='gray.200'
                                borderRadius='md'
                                bg='gray.50'
                                spacing={3}
                                align='center'
                                justify='space-between'
                              >
                                <Text fontWeight='semibold' fontSize='sm' minW='50px'>Serie {sIndex + 1}</Text>

                                <HStack flex={1}> {/* Ocupa espacio disponible */}
                                  <Text fontSize='sm' minW='40px'>Peso:</Text>
                                  <NumberInput
                                    size='sm'
                                    value={serie.weight || ''} // Controlar input
                                    onChange={(valueString) => handleInputPesoChange(index, sIndex, valueString)}
                                    min={0}
                                    maxW='100px' // Limitar ancho
                                    borderColor='gray.300'
                                    focusBorderColor={colors.secondary}
                                  >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                      <NumberIncrementStepper />
                                      <NumberDecrementStepper />
                                    </NumberInputStepper>
                                  </NumberInput>
                                </HStack>

                                <HStack flex={1}> {/* Ocupa espacio disponible */}
                                  <Text fontSize='sm' minW='40px'>Reps:</Text>
                                  <NumberInput
                                    size='sm'
                                    value={serie.reps || ''} // Controlar input
                                    onChange={(valueString) => handleInputRepsChange(index, sIndex, valueString)}
                                    min={0}
                                    maxW='100px' // Limitar ancho
                                    borderColor='gray.300'
                                    focusBorderColor={colors.secondary}
                                  >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                      <NumberIncrementStepper />
                                      <NumberDecrementStepper />
                                    </NumberInputStepper>
                                  </NumberInput>
                                </HStack>

                                <IconButton
                                  icon={<DeleteIcon />}
                                  size='sm'
                                  aria-label='Borrar Serie'
                                  colorScheme='red' // Usar colorScheme para consistencia
                                  variant='ghost' // Menos intrusivo
                                  onClick={() => handleButtonDeleteSerie(index, sIndex)}
                                />
                              </HStack>
                            ))}
                          </VStack>
                        )}
                      </VStack>
                    </GridItem>
                  </Grid> {/* Fin Grid principal del ejercicio */}
                </CardBody>
              </Card>
            ))
          )}
        </VStack>

        {/* Botones Flotantes */}
        <Box position='fixed' bottom='6' right='6' zIndex='sticky'>
          <HStack spacing={4}>
            <Button
              onClick={handlerButtonEstado}
              colorScheme={
                estadoEntrenamiento === 'Sin empezar'
                  ? 'gray'
                  : estadoEntrenamiento === 'En proceso'
                    ? 'yellow'
                    : 'green' // Acabado
              }
              variant='solid' // O 'outline' si prefieres
              boxShadow='md' // Añadir sombra
            >
              Estado: {estadoEntrenamiento}
            </Button>
            <Button
              onClick={handlerGuardarDatos}
              colorScheme='blue' // Usar colorScheme
              variant='solid'
              boxShadow='md'
            >
              Guardar Datos del Día
            </Button>
          </HStack>
        </Box>
      </Box> {/* Fin Contenedor principal */}
    </ChakraProvider>
  )
}
