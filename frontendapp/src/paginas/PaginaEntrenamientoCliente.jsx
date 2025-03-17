import React, { useState, useEffect } from 'react'
import { ChakraProvider, Box, Text, Heading, Divider, AbsoluteCenter, Grid, GridItem, Stack, IconButton } from '@chakra-ui/react'
import Navbar from '../componentes/Navbar'
import { useParams } from 'react-router-dom'
import { useAuthCheck } from '../hooks/useAuthCheck'
import colors from '../constantes/colores'
import { DeleteIcon } from '@chakra-ui/icons'
import { useClientInfo } from '../hooks/useClientInfo'
export function PaginaEntrenamietoCliente () {
  const { authenticated, message } = useAuthCheck()
  const { usuario, idEntrenamiento, semIndex, dayIndex } = useParams()
  const { userData, loading, error } = useClientInfo(usuario)

  const [diaEntrenamiento, setDiaEntrenamiento] = useState([])

  const [entrenamientoEncontrado, setEntrenamientoEncontrado] = useState([])

  useEffect(() => {
    if (userData?.asociacion && userData?.asociacion.length > 0 && userData?.asociacion[0]?.entrenamientos) {
      const entrenamiento = userData.asociacion[0].entrenamientos && userData.asociacion[0].entrenamientos.find(
        elemento => {
          if (elemento._id && elemento._id.$oid === idEntrenamiento) {
            console.log('Siiiii')
            console.log(elemento)
            return true
          }
          console.log('Noooo')
          return false
        }
      ).entrenamiento[0]
      setEntrenamientoEncontrado(entrenamiento)
    }
  }, [userData, idEntrenamiento])

  if (!authenticated) {
    return <div>{message}</div>
  }
  /*
  if (!userData.asociacion[0]) {
    return <div>Usted no asesora a {usuario}</div>
  }
*/

  if (loading) {
    return <div>Cargando...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <ChakraProvider>
      <Navbar />

      <Box bgColor={colors.neutral} color={colors.primary} minH='100vh' p={4}>
        <Heading textAlign='center' size='lg' m={2} textColor={colors.primary}>
          Entrenamiento {entrenamientoEncontrado.title}
        </Heading>

        <Text m={8} fontSize='xl' fontWeight='semibold'>
          Semana: {parseInt(semIndex) + 1} - Día {parseInt(dayIndex) + 1}
        </Text>
        {entrenamientoEncontrado?.weeks?.map((ejercicio, index) => {
          return (
            <Box key={index} m={6} p={4}>
              <Box position='relative' mb={4}>
                <Divider borderColor={colors.primary} />
                <AbsoluteCenter textColor={colors.primary} bg={colors.neutral} px='4' fontSize={18}>{ejercicio.name}</AbsoluteCenter>
              </Box>
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                <GridItem p={2}>
                  <Text>Series: {ejercicio.sets}</Text>
                  <Text>Repeticiones: {ejercicio.reps}</Text>
                  <Text>RIR: {ejercicio.rir}</Text>
                  <Text htmlFor={`additional-info-${index}`}>Anotaciones para el entrenador:</Text>

                </GridItem>
                <GridItem p={2}>
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
                      </Grid>

                    </Box>
                  ))}
                </GridItem>
              </Grid>

            </Box>
          )
        })}
      </Box>
    </ChakraProvider>
  )
}
