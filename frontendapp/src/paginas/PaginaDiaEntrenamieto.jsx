import React, { useState } from 'react'
import { ChakraProvider, Box, Text, Heading, Divider, AbsoluteCenter, Input, Grid, GridItem, Button, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react'
import Navbar from '../componentes/Navbar'
import { useParams } from 'react-router-dom'
import useMisAsociaciones from '../hooks/useMisAsociaciones'
import { useAuthCheck } from '../hooks/useAuthCheck'
import colors from '../constantes/colores'

export function PaginaDiaEntrenamiento () {
  const { authenticated, message } = useAuthCheck()
  const { entrenador, idEntrenamiento, semIndex, dayIndex } = useParams()
  const asociaciones = useMisAsociaciones()
  const [contador, setContador] = useState(0)
  let handleButtonAddSerie = null
  const handleInputPesoChange = (exerciseIndex, serieIndex, value, diaEntrenamiento) => {
    diaEntrenamiento[exerciseIndex].series[serieIndex].weight = value
    const nuevoValor = contador + 1
    setContador(nuevoValor)
  }
  const handleInputRepsChange = (exerciseIndex, serieIndex, value, diaEntrenamiento) => {
    diaEntrenamiento[exerciseIndex].series[serieIndex].reps = value
    const nuevoValor = contador + 1
    setContador(nuevoValor)
  }
  if (!authenticated) {
    return <div>{message}</div>
  } else if (asociaciones) {
    const asociacion = asociaciones.find(asociacion => asociacion.usuarioEntrenador === entrenador)
    let entrenamientoEncontrado = null
    let diaEntrenamiento = null
    if (asociacion) {
      entrenamientoEncontrado = asociacion.entrenamientos.find(
        ent => ent._id.$oid === idEntrenamiento
      )
      handleButtonAddSerie = (exerciseIndex) => {
        const nuevoValor = contador + 1
        setContador(nuevoValor)
        if (!diaEntrenamiento[exerciseIndex].series) {
          diaEntrenamiento[exerciseIndex].series = []
        }
        diaEntrenamiento[exerciseIndex].series.push({ reps: 0, weight: 0 })
        console.log(diaEntrenamiento)
      }
      diaEntrenamiento = entrenamientoEncontrado.entrenamiento[0].weeks[semIndex].days[dayIndex].exercises
      console.log(diaEntrenamiento.exercises)
    } else {
      console.log('No se encontró ninguna asociación con ese usuarioEntrenador')
    }

    if (!asociacion) {
      return <div>Usted no esta siendo asesorado por {entrenador}</div>
    } else if (!entrenamientoEncontrado) {
      return <div>Entrenamiento no encontrado</div>
    } else {
      return (
        <ChakraProvider>
          <Navbar />

          <Box bgColor={colors.neutral} color={colors.primary} minH='100vh' p={4}>
            <Heading textAlign='center' size='lg' m={2} textColor={colors.primary}>
              Entrenamiento {entrenamientoEncontrado.entrenamiento[0].title}
            </Heading>

            <Text m={8} fontSize='xl' fontWeight='semibold'>
              Semana: {parseInt(semIndex) + 1} - Día {parseInt(dayIndex) + 1}
            </Text>
            {diaEntrenamiento && diaEntrenamiento.map((ejercicio, index) => {
              return (
                <Box key={index} m={6} p={4}>
                  <Box position='relative' mb={4}>
                    <Divider borderColor={colors.primary} />
                    <AbsoluteCenter textColor={colors.primary} bg={colors.neutral} px='4' fontSize={18}>{ejercicio.name}</AbsoluteCenter>
                  </Box>
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                    <GridItem p={2}>
                      <Text>Series Base: {ejercicio.sets}</Text>
                      <Text>Repeticiones Base: {ejercicio.reps}</Text>
                      <Text>Descanso Base: {ejercicio.rir}</Text>
                      <Text htmlFor={`additional-info-${index}`}>Información Adicional:</Text>
                      <Input
                        id={`additional-info-${index}`}
                        placeholder='Ingresa detalles adicionales'
                        size='md'
                      />
                    </GridItem>
                    <GridItem p={2}>
                      <Button size='sm' onClick={() => handleButtonAddSerie(index)}>
                        Agregar serie
                      </Button>
                      {ejercicio.series?.map((serie, sIndex) => (
                        <Box key={sIndex} mt={2}>

                          <Text>Serie {sIndex + 1}</Text>
                          <Grid templateColumns='1fr 1fr' gap={4}>
                            <GridItem
                              display='flex'
                              flexDirection='column'
                              alignItems='center'
                              justifyContent='center'
                              textAlign='center'
                            >
                              <Text>Peso: </Text>
                            </GridItem>
                            <GridItem>
                              <NumberInput
                                value={serie.weight} // Usa el valor de la serie actual
                                onChange={(value) => handleInputPesoChange(index, sIndex, value, diaEntrenamiento)}
                                min={0}
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </GridItem>
                          </Grid>

                          <Grid templateColumns='1fr 1fr' gap={4}>
                            <GridItem
                              display='flex'
                              flexDirection='column'
                              alignItems='center'
                              justifyContent='center'
                              textAlign='center'
                            >
                              <Text>Reps: </Text>
                            </GridItem>
                            <GridItem>
                              <NumberInput
                                value={serie.reps} // Usa el valor de la serie actual
                                onChange={(value) => handleInputRepsChange(index, sIndex, value, diaEntrenamiento)}
                                min={0}
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </GridItem>
                          </Grid>

                        </Box>
                      ))}
                    </GridItem>
                  </Grid>

                </Box>
              )
            })}

            <Box position='fixed' bottom='4' right='4'>
              <button style={{ padding: '10px 20px', backgroundColor: colors.primary, color: colors.white, border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Guardar datos y acabar entrenamiento
              </button>
            </Box>
          </Box>
        </ChakraProvider>
      )
    }
  }
}
