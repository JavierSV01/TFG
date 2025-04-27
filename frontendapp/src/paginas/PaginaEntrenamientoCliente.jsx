import React, { useState, useEffect } from 'react'
import {
  ChakraProvider,
  Box,
  Text,
  Heading,
  Divider,
  Grid,
  GridItem,
  VStack,
  HStack,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  Tag,
  Icon,
  Spinner,
  Alert,
  AlertIcon
} from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useAuthCheck } from '../hooks/useAuthCheck'
import colors from '../constantes/colores'
import { useClientInfo } from '../hooks/useClientInfo'
import { CalendarIcon, InfoIcon } from '@chakra-ui/icons'

export function PaginaEntrenamietoCliente () {
  const { authenticated, message } = useAuthCheck()
  const { usuario, idEntrenamiento } = useParams()
  const { userData, loading, error } = useClientInfo(usuario)

  const [entrenamientoEncontrado, setEntrenamientoEncontrado] = useState(null)

  useEffect(() => {
    if (userData?.asociacion?.[0]?.entrenamientos) {
      const entrenamiento = userData.asociacion[0].entrenamientos.find(
        elemento => elemento?._id?.$oid === idEntrenamiento
      )?.entrenamiento?.[0]
      if (entrenamiento) {
        console.log('Entrenamiento encontrado:', entrenamiento)
        setEntrenamientoEncontrado(entrenamiento)
      } else {
        console.log('Entrenamiento no encontrado con ID:', idEntrenamiento)
        setEntrenamientoEncontrado(null)
      }
    }
  }, [userData, idEntrenamiento])

  // --- Estados de Carga, Error y Autenticación ---
  if (loading) {
    return (
      <ChakraProvider>
        <Box display='flex' justifyContent='center' alignItems='center' minH='100vh' bgColor={colors.neutral}>
          <Spinner size='xl' color={colors.primary} />
          <Text ml={4} color={colors.primary}>Cargando...</Text>
        </Box>
      </ChakraProvider>
    )
  }

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

  if (error) {
    return (
      <ChakraProvider>
        <Box display='flex' justifyContent='center' alignItems='center' minH='100vh' bgColor={colors.neutral}>
          <Alert status='error'>
            <AlertIcon />
            Error al cargar datos: {error}
          </Alert>
        </Box>
      </ChakraProvider>
    )
  }

  return (
    <ChakraProvider>
      <Box bgColor={colors.neutral} color={colors.primary} minH='100vh' py={8} px={{ base: 2, md: 4 }}>

        <Heading textAlign='center' size='xl' mb={8} color={colors.primary}>
          Plan de Entrenamiento: {entrenamientoEncontrado?.title || 'Cargando título...'}
        </Heading>

        {!entrenamientoEncontrado && !loading && (
          <Alert status='info' justifyContent='center'>
            <AlertIcon />
            No se encontró el detalle del entrenamiento seleccionado.
          </Alert>
        )}

        <VStack spacing={8} align='stretch'>
          {entrenamientoEncontrado?.weeks?.map((semana, semanaIndex) => (
            <Box key={semanaIndex} p={4}>
              <Heading textAlign='center' size='lg' mb={6} color={colors.primary}>
                <Icon as={CalendarIcon} mr={2} /> Semana: {semanaIndex + 1}
              </Heading>

              <VStack spacing={6} align='stretch'>
                {semana.days?.map((dia, diaIndex) => (
                  <Card key={diaIndex} variant='outline' borderColor={colors.primary} borderWidth='1px'>
                    <CardHeader bg={colors.primary} color={colors.white} py={2} px={4} borderTopRadius='md'>
                      <Heading size='md'>
                        Día {diaIndex + 1}
                      </Heading>
                    </CardHeader>
                    <CardBody p={4}>
                      <VStack spacing={4} align='stretch'>
                        {dia.exercises?.map((ejercicio, ejercicioIndex) => (
                          <Box key={ejercicioIndex} p={4} borderWidth='1px' borderColor='gray.200' borderRadius='md' shadow='sm'>
                            <HStack justify='space-between' mb={3}>
                              <Heading size='sm' color={colors.secondary}>{ejercicio.name}</Heading>
                            </HStack>

                            <HStack spacing={4} mb={4} wrap='wrap'>
                              <Tag colorScheme='blue' variant='subtle'>Series: {ejercicio.sets}</Tag>
                              <Tag colorScheme='green' variant='subtle'>Reps: {ejercicio.reps}</Tag>
                              <Tag colorScheme='orange' variant='subtle'>RIR: {ejercicio.rir}</Tag>
                            </HStack>

                            <Divider borderColor={colors.primary} my={3} />

                            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                              <GridItem>
                                <HStack mb={2}>
                                  <Icon as={InfoIcon} color={colors.secondary} />
                                  <Text fontWeight='bold'>Anotaciones para el entrenador:</Text>
                                </HStack>
                                <Text fontSize='sm' fontStyle='italic' color='gray.600' pl={6}>
                                  {ejercicio.additionalInfo || 'Sin anotaciones.'}
                                </Text>
                              </GridItem>

                              <GridItem>
                                <Text fontWeight='bold' mb={2}>Registro de Series:</Text>
                                {ejercicio.series && ejercicio.series.length > 0
                                  ? (
                                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={3}>
                                      {ejercicio.series.map((serie, serieIndex) => (
                                        <Box key={serieIndex} p={2} borderWidth='1px' borderColor='gray.200' borderRadius='md' bg='gray.50'>
                                          <Text fontWeight='semibold' fontSize='sm'>Serie {serieIndex + 1}</Text>
                                          <Text fontSize='xs'>Peso: {serie.weight || '-'}</Text>
                                          <Text fontSize='xs'>Reps: {serie.reps || '-'}</Text>
                                        </Box>
                                      ))}
                                    </SimpleGrid>
                                    )
                                  : (
                                    <Text fontSize='sm' color='gray.500'>No hay series registradas.</Text>
                                    )}
                              </GridItem>
                            </Grid>
                          </Box>
                        ))}
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </Box>
          ))}
        </VStack>
      </Box>
    </ChakraProvider>
  )
}
