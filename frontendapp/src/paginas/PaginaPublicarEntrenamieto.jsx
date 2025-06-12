import { useAuthCheck } from '../hooks/useAuthCheck'
import { ChakraProvider, Box, Heading, Text } from '@chakra-ui/react'
import colors from '../constantes/colores'
import { useParams } from 'react-router-dom'
import useMisAsociaciones from '../hooks/useMisAsociaciones'
import { SubirPublicacionEntrenamieto } from '../componentes/SubirPublicacionEntrenamieto'

export function obtenerEntrenamiento (data, entrenador, titulo, semIndex, diaIndex) {
  if (!data || !data.associations) {
    console.error('La estructura de datos principal no es válida.')
    return null
  }

  const asociacion = data.associations.find(assoc => assoc.usuarioEntrenador === entrenador)
  if (!asociacion) {
    console.log(`No se encontró asociación para el entrenador: ${entrenador}`)
    return null
  }

  // const entrenamiento = asociacion.entrenamientos?.entrenamiento?.find(ent => ent.title === titulo)
  const entrenamiento = asociacion.entrenamientos
    ?.flatMap(e => e.entrenamiento) // aplana todos los arrays de entrenamiento
    ?.find(ent => ent.title === titulo)
  if (!entrenamiento) {
    console.log(`No se encontró entrenamiento con el título: ${titulo} para el entrenador ${entrenador}`)
    return null
  }

  const semana = entrenamiento.weeks?.[semIndex]
  if (!semana) {
    console.log(`No se encontró la semana con índice ${semIndex} en el entrenamiento ${titulo}`)
    return null
  }

  const dia = semana.days?.[diaIndex]
  if (dia) {
    return dia
  } else {
    console.log(`No se encontró el día con índice ${diaIndex} en la semana ${semIndex} del entrenamiento ${titulo}`)
    return null
  }
}

export function PaginaPublicarEntrenamieto () {
  const { authenticated, message } = useAuthCheck()
  const entrenadores = useMisAsociaciones() // Asumimos que esto devuelve el array [...]
  const { entrenador, titulo, semana, dia } = useParams()

  if (!authenticated) {
    return <div>{message}</div>
  }

  // ¡Importante! Asegúrate que el loading check funciona como esperas.
  // Si useMisAsociaciones devuelve [] inicialmente en vez de null/undefined,
  // podrías necesitar un estado de loading explícito del hook.
  if (!entrenadores) {
    return <div>Cargando asociaciones...</div>
  }

  // --- Parsear parámetros de useParams ---
  // useParams devuelve strings, necesitas números para los índices
  const diaIndex = parseInt(dia, 10)
  const semIndex = parseInt(semana, 10)

  // --- Validar que los índices son números válidos ---
  if (isNaN(diaIndex) || isNaN(semIndex)) {
    console.error("Los parámetros 'dia' o 'semana' no son números válidos:", dia, semana)
    return <ChakraProvider><Box>Error: Los parámetros de día o semana en la URL no son válidos.</Box></ChakraProvider>
  }

  // --- Modificación Clave ---
  // Envuelve 'entrenadores' en un objeto con la clave 'associations'
  const datosParaFuncion = { associations: entrenadores }

  // Llama a la función con la estructura correcta y los índices parseados
  const diaEntrenamietoParaSubir = obtenerEntrenamiento(datosParaFuncion, entrenador, titulo, semIndex, diaIndex)

  return (
    <ChakraProvider>
      <Box bg={colors.neutral} color={colors.white} minH='100vh' p={6}>
        <Box bg={colors.secondary} borderRadius='3xl' p={10} width='100%'>
          <Heading mb={10}>Nueva publicación de comida</Heading>
          {/* Pasa el resultado de la función */}
          <SubirPublicacionEntrenamieto day={diaEntrenamietoParaSubir} />
          {/* Muestra un mensaje si no se encontró la comida */}
          {!diaEntrenamietoParaSubir && (
            <Text color='yellow.400' mt={4}>No se encontró la información del dia de entrenamieto especificado.</Text>
          )}
        </Box>
      </Box>
    </ChakraProvider>
  )
}
