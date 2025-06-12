import { useAuthCheck } from '../hooks/useAuthCheck'
import { ChakraProvider, Box, Heading, Text } from '@chakra-ui/react'
import colors from '../constantes/colores'
import { SubirPublicacionComida } from '../componentes/SubirPublicacionComida'
import { useParams } from 'react-router-dom'
import useMisAsociaciones from '../hooks/useMisAsociaciones'

export function obtenerComida (data, entrenador, diaIndex, comidaIndex) {
  if (!data || !data.associations) {
    console.error('La estructura de datos principal no es válida.')
    return null
  }
  const asociacion = data.associations.find(assoc => assoc.usuarioEntrenador === entrenador)
  if (!asociacion) {
    console.log(`No se encontró asociación para el entrenador: ${entrenador}`)
    return null
  }
  // Asume que siempre quieres la primera dieta (índice [0])
  const comida = asociacion.dietaData?.dieta?.[0]?.days?.[diaIndex]?.meals?.[comidaIndex]
  if (comida) {
    return comida
  } else {
    console.log(`No se pudo encontrar la comida para el entrenador ${entrenador}, día ${diaIndex}, comida ${comidaIndex}.`)
    return null
  }
}

export function PaginaPublicarComida () {
  const { authenticated, message } = useAuthCheck()
  const entrenadores = useMisAsociaciones() // Asumimos que esto devuelve el array [...]
  const { entrenador, dia, comida } = useParams()

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
  const comidaIndex = parseInt(comida, 10)

  // --- Validar que los índices son números válidos ---
  if (isNaN(diaIndex) || isNaN(comidaIndex)) {
    console.error("Los parámetros 'dia' o 'comida' no son números válidos:", dia, comida)
    // Puedes mostrar un mensaje de error al usuario aquí
    return <ChakraProvider><Box>Error: Los parámetros de día o comida en la URL no son válidos.</Box></ChakraProvider>
  }

  // --- Modificación Clave ---
  // Envuelve 'entrenadores' en un objeto con la clave 'associations'
  const datosParaFuncion = { associations: entrenadores }

  // Llama a la función con la estructura correcta y los índices parseados
  const comidaParaSubir = obtenerComida(datosParaFuncion, entrenador, diaIndex, comidaIndex)

  return (
    <ChakraProvider>
      <Box bg={colors.neutral} color={colors.white} minH='100vh' p={6}>
        <Box bg={colors.secondary} borderRadius='3xl' p={10} width='100%'>
          <Heading mb={10}>Nueva publicación de comida</Heading>
          {/* Pasa el resultado de la función */}
          <SubirPublicacionComida meal={comidaParaSubir} />
          {/* Muestra un mensaje si no se encontró la comida */}
          {!comidaParaSubir && (
            <Text color='yellow.400' mt={4}>No se encontró la información de la comida especificada.</Text>
          )}
        </Box>
      </Box>
    </ChakraProvider>
  )
}
