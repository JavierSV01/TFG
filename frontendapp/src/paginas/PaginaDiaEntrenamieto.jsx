import React, { useCallback, useState, useMemo, useEffect } from 'react'
import { ChakraProvider, Box, Text, Heading, Divider, AbsoluteCenter, Input, Grid, GridItem, Button, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, useToast, Stack, IconButton } from '@chakra-ui/react'
import Navbar from '../componentes/Navbar'
import { useParams } from 'react-router-dom'
import useMisAsociaciones from '../hooks/useMisAsociaciones'
import { useAuthCheck } from '../hooks/useAuthCheck'
import colors from '../constantes/colores'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'
import { useUserNameId } from '../hooks/useUserNameId'
import { DeleteIcon } from '@chakra-ui/icons'

export function PaginaDiaEntrenamiento () {
  const { authenticated, message } = useAuthCheck()
  const { username } = useUserNameId()
  const { entrenador, idEntrenamiento, semIndex, dayIndex } = useParams()
  const asociaciones = useMisAsociaciones()
  const [estadoEntrenamiento, setEstadoEntrenamiento] = useState('Sin empezar')
  const toast = useToast()

  const asociacion = useMemo(() => {
    return asociaciones?.find(asociacion => asociacion.usuarioEntrenador === entrenador)
  }, [asociaciones, entrenador])

  const entrenamientoEncontrado = useMemo(() => {
    return asociacion?.entrenamientos?.find(ent => ent._id.$oid === idEntrenamiento)
  }, [asociacion, idEntrenamiento])

  const [diaEntrenamiento, setDiaEntrenamiento] = useState([])

  useEffect(() => {
    if (entrenamientoEncontrado) {
      setEstadoEntrenamiento(entrenamientoEncontrado.entrenamiento[0].weeks[semIndex].days[dayIndex].estado || 'Sin empezar')
      setDiaEntrenamiento(entrenamientoEncontrado.entrenamiento[0].weeks[semIndex].days[dayIndex].exercises || [])
    } else {
      setDiaEntrenamiento([])
    }
  }, [entrenamientoEncontrado, semIndex, dayIndex]) // Dependencias importantes

  const handleButtonAddSerie = useCallback((exerciseIndex, diaEntrenamiento) => {
    setDiaEntrenamiento((prevDiaEntrenamiento) => {
      const newDiaEntrenamiento = [...prevDiaEntrenamiento]
      if (!newDiaEntrenamiento[exerciseIndex].series) {
        newDiaEntrenamiento[exerciseIndex].series = []
      }
      newDiaEntrenamiento[exerciseIndex].series.push({ reps: 0, weight: 0 })
      return newDiaEntrenamiento
    })
  }, [])

  const handlerGuardarDatos = useCallback((idEntrenamiento, diaEntrenamiento, idEntrenador, idUsuario, estadoEntrenamiento, semIndex, dayIndex) => {
    console.log('Guardando datos')
    console.log('Entrenamiento guardado', diaEntrenamiento)
    console.log('Entrenamineto encontrado', entrenamientoEncontrado)
    console.log(idEntrenamiento, idEntrenador, idUsuario, diaEntrenamiento, estadoEntrenamiento, semIndex, dayIndex)
    axios.defaults.withCredentials = true
    axios.put(ENDPOINTS.ASSOCIATION.UPDATEWORKOUT, { idEntrenamiento, idEntrenador, idUsuario, entrenamiento: diaEntrenamiento, estado: estadoEntrenamiento, semIndex, dayIndex })
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: 'Entrenamiento guardado',
            description: 'Los datos feron guardados correctamente.',
            status: 'success',
            duration: 5000,
            isClosable: true
          })
        } else {
          toast({
            title: 'Error al guardar',
            status: 'error',
            duration: 5000,
            isClosable: true
          })
        }
        console.log(res.data)
      })
      .catch((err) => {
        toast({
          title: 'Error al enviar solicitud',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
        console.error(err)
      })
  }, [])

  const handleInputPesoChange = useCallback((exerciseIndex, serieIndex, value, diaEntrenamiento) => {
    setDiaEntrenamiento((prevDiaEntrenamiento) => {
      const newDiaEntrenamiento = [...prevDiaEntrenamiento]
      newDiaEntrenamiento[exerciseIndex].series[serieIndex].weight = value
      return newDiaEntrenamiento
    })
  }, [])

  const handleInputRepsChange = useCallback((exerciseIndex, serieIndex, value, diaEntrenamiento) => {
    setDiaEntrenamiento((prevDiaEntrenamiento) => {
      const newDiaEntrenamiento = [...prevDiaEntrenamiento]
      newDiaEntrenamiento[exerciseIndex].series[serieIndex].reps = value
      return newDiaEntrenamiento
    })
  }, [])

  const handlerExeciseText = useCallback((index, value, diaEntrenamiento) => {
    setDiaEntrenamiento((prevDiaEntrenamiento) => {
      const newDiaEntrenamiento = [...prevDiaEntrenamiento]
      newDiaEntrenamiento[index].additionalInfo = value
      console.log(newDiaEntrenamiento)
      return newDiaEntrenamiento
    })
  }, [])

  const handlerButtonEstado = useCallback(() => {
    setEstadoEntrenamiento((prevEstadoEntrenamiento) => {
      if (prevEstadoEntrenamiento === 'Sin empezar') {
        return 'En proceso'
      } else if (prevEstadoEntrenamiento === 'En proceso') {
        return 'Acabado'
      } else {
        return 'Sin empezar'
      }
    })
  }, [])

  if (!authenticated) {
    return <div>{message}</div>
  }

  if (!asociacion) {
    return <div>Usted no está siendo asesorado por {entrenador}</div>
  }

  if (!entrenamientoEncontrado) {
    return <div>Entrenamiento no encontrado</div>
  }

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
                    onChange={(event) => handlerExeciseText(index, event.target.value, diaEntrenamiento)}
                    size='md'
                    defaultValue={ejercicio.additionalInfo}
                  />
                </GridItem>
                <GridItem p={2}>
                  <Button size='sm' onClick={() => handleButtonAddSerie(index, diaEntrenamiento)}>
                    Agregar serie
                  </Button>
                  {ejercicio.series?.map((serie, sIndex) => (
                    <Box key={sIndex} mt={2}>

                      <Stack direction='row' spacing={4} align='center'>

                        <Text>Serie {sIndex + 1}</Text>
                        <IconButton
                          icon={<DeleteIcon />}
                          size='sm'
                          aria-label='Borrar'
                          bgColor={colors.secondary}
                          textColor={colors.white}
                          _hover={{ bgColor: colors.primary, color: colors.neutral }}
                          ml={2}
                          onClick={() => {
                            const updated = [...diaEntrenamiento]
                            updated[index].series.splice(sIndex, 1)
                            setDiaEntrenamiento(updated)
                          }}
                        />

                      </Stack>
                      <Grid templateColumns='1fr 2fr' gap={4}>
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

                      <Grid templateColumns='1fr 2fr' gap={4}>
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
          <Button
            onClick={handlerButtonEstado}
            style={{
              padding: '10px 20px',
              backgroundColor: colors.primary,
              color: colors.white,
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Estado: {estadoEntrenamiento}
          </Button>
          <Button onClick={() => (handlerGuardarDatos(entrenamientoEncontrado._id.$oid, diaEntrenamiento, entrenador, username, estadoEntrenamiento, semIndex, dayIndex))} style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: colors.primary, color: colors.white, border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Guardar datos
          </Button>

        </Box>
      </Box>
    </ChakraProvider>
  )
}
