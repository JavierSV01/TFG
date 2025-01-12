import React from 'react'
import { ChakraProvider, Box, Text, Heading, Divider, AbsoluteCenter } from '@chakra-ui/react'
import Navbar from '../componentes/Navbar'
import { useParams } from 'react-router-dom'
import useMisAsociaciones from '../hooks/useMisAsociaciones'
import { useAuthCheck } from '../hooks/useAuthCheck'
import colors from '../constantes/colores'

export function PaginaDiaEntrenamiento () {
  const { authenticated, message } = useAuthCheck()
  const { entrenador, idEntrenamiento, semIndex, dayIndex } = useParams()
  const asociaciones = useMisAsociaciones()

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
            {diaEntrenamiento && diaEntrenamiento.map((ejercicio, index) => (
              <Box key={index} m={6}>
                <Box position='relative'>
                  <Divider borderColor={colors.primary} />
                  <AbsoluteCenter textColor={colors.primary} bg={colors.neutral} px='4' fontSize={18}>{ejercicio.name}</AbsoluteCenter>
                </Box>
                <Box m={2}>
                  <Text>Series: {ejercicio.sets}</Text>
                  <Text>Repeticiones: {ejercicio.reps}</Text>
                  <Text>Descanso: {ejercicio.rir}</Text>
                </Box>
              </Box>
            ))}

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
