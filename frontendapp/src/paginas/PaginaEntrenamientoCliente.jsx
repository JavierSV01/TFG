import React, { useState, useEffect } from 'react'
import { ChakraProvider, Box, Text, Heading, Divider, Grid, GridItem } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useAuthCheck } from '../hooks/useAuthCheck'
import colors from '../constantes/colores'
import { useClientInfo } from '../hooks/useClientInfo'
export function PaginaEntrenamietoCliente () {
  const { authenticated, message } = useAuthCheck()
  const { usuario, idEntrenamiento } = useParams()
  const { userData, loading, error } = useClientInfo(usuario)

  const [entrenamientoEncontrado, setEntrenamientoEncontrado] = useState([])

  useEffect(() => {
    if (userData?.asociacion && userData?.asociacion.length > 0 && userData?.asociacion[0]?.entrenamientos) {
      const entrenamiento = userData.asociacion[0].entrenamientos && userData.asociacion[0].entrenamientos.find(
        elemento => {
          if (elemento._id && elemento._id.$oid === idEntrenamiento) {
            return true
          }
          return false
        }
      ).entrenamiento[0]
      console.log('Entrenamiento: \n' + entrenamiento)
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
      <Box bgColor={colors.neutral} color={colors.primary} minH='100vh' p={4}>
        <Heading textAlign='center' size='xl' m={2} textColor={colors.primary}>
          Entrenamiento {entrenamientoEncontrado.title}
        </Heading>

        {entrenamientoEncontrado?.weeks?.map((semana, semanaIndex) => (
          <Box key={semanaIndex} m={6} p={4}>
            <Heading textAlign='center' size='lg' m={2} textColor={colors.primary}>
              Semana: {semanaIndex + 1}
            </Heading>
            {semana.days?.map((dia, diaIndex) => (
              <Box key={diaIndex} m={4} p={4} borderWidth='0px' borderColor={colors.secondary} borderRadius='md'>
                <Text fontSize='lg' fontWeight='bold'>Semana: {semanaIndex + 1} - Día {diaIndex + 1}</Text>
                <Divider borderColor={colors.primary} my={2} />
                {dia.exercises?.map((ejercicio, ejercicioIndex) => (
                  <Box key={ejercicioIndex} p={4} borderWidth='0px' borderRadius='md' my={2}>
                    <Text fontSize='md' fontWeight='semibold'>{ejercicio.name}</Text>
                    <Text>Series: {ejercicio.sets}</Text>
                    <Text>Repeticiones: {ejercicio.reps}</Text>
                    <Text>RIR: {ejercicio.rir}</Text>
                    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                      <GridItem
                        display='flex'
                        flexDirection='column'
                        justifyContent='center'
                        alignItems='center'
                        textAlign='center'
                        p={2}
                      >
                        <Text fontWeight='bold'>Anotaciones para el entrenador: </Text>
                        <Text>{ejercicio.additionalInfo} </Text>
                      </GridItem>

                      <GridItem p={2}>
                        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                          {ejercicio.series?.map((serie, serieIndex) => (
                            <Box key={serieIndex} mt={2} p={2} borderWidth='1px' borderRadius='md'>
                              <Text fontWeight='bold'>Serie {serieIndex + 1}</Text>
                              <Text>Peso: {serie.weight}</Text>
                              <Text>Reps: {serie.reps}</Text>
                            </Box>
                          ))}
                        </Grid>
                      </GridItem>
                    </Grid>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        ))}

      </Box>
    </ChakraProvider>
  )
}
