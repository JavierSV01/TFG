import React from 'react'
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Flex,
  Icon
} from '@chakra-ui/react'
import colors from '../constantes/colores'
import ImageLoader from './ImageLoader'
import FotoDePerfil from './FotoDePerfil'
import { StarIcon } from '@chakra-ui/icons'
function FormatearFecha (fechaInput) {
  let fechaStringParaProcesar = fechaInput
  if (typeof fechaInput === 'object' && fechaInput !== null && '$date' in fechaInput) {
    fechaStringParaProcesar = fechaInput.$date // Usar el valor de $date como el string de fecha
  }
  if (fechaStringParaProcesar === null || typeof fechaStringParaProcesar === 'undefined') {
    return 'Fecha no proporcionada' // O cualquier placeholder que prefieras
  }

  try {
    const fecha = new Date(String(fechaStringParaProcesar))

    if (isNaN(fecha.getTime())) {
      return (typeof fechaStringParaProcesar === 'string' ? fechaStringParaProcesar : 'Fecha inválida (formato original no string)')
    }

    const fechaFormateada = fecha.toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
    return fechaFormateada
  } catch (e) {
    console.error('Error en FormatearFecha:', e, 'Input original:', fechaInput)
    return (typeof fechaInput === 'string' ? fechaInput : 'Error al formatear fecha')
  }
}

export function ListaDePublicaciones ({ publicaciones, onGuardar, favoritos }) {
  if (!publicaciones || publicaciones.length === 0) {
    return (
      <Box p={4} textAlign='center'>
        <Text fontSize='lg' color='gray.500'>No hay publicaciones disponibles.</Text>
      </Box>
    )
  }
  return (
    <VStack spacing={6} align='stretch' px={2}>
      {publicaciones.map((post, index) => {
        const safePost = {
          _id: 'defaultId' + index,
          usuario: 'Usuario Anónimo',
          imagenId: null,
          texto: '',
          tipo: '1',
          meal: { name: '', foods: [] },
          day: { exercises: [] },
          fecha: new Date().toISOString(),
          ...post
        }

        const isFavorito = favoritos?.includes(safePost._id)

        return (
          <React.Fragment key={safePost._id}>
            <Box
              p={4}
              shadow='md'
              borderWidth='2px'
              borderRadius='xl'
              borderColor={colors.neutral}
              w='100%'
            >
              <Flex mb={4} justifyContent='space-between' alignItems='center'>
                <Flex alignItems='center' flexShrink={1} overflow='hidden'>
                  <Box width={{ base: '60px', md: '80px' }} flexShrink={0}>
                    <FotoDePerfil username={safePost.usuario} />
                  </Box>
                  <Heading
                    as='h3'
                    size='md'
                    ml={3}
                    isTruncated
                  >
                    {safePost.usuario || `Publicación ${safePost._id}`}
                  </Heading>
                </Flex>

                <Button
                  variant='ghost'
                  onClick={() => onGuardar(safePost._id)}
                  aria-label={isFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                  ml={2}
                >
                  <Icon as={StarIcon} color={isFavorito ? 'yellow.400' : 'gray.400'} boxSize={6} />
                </Button>
              </Flex>

              <Flex
                mb={4}
                gap={4}
                direction={{ base: 'column', md: 'row' }}
                alignItems={{ base: 'stretch', md: 'flex-start' }}
              >

                <Box
                  width={{ base: '100%', md: 'auto' }}
                  flex={{ md: '1' }}
                  display='flex'
                  justifyContent='center'
                  alignItems='center'
                  mb={{ base: 4, md: 0 }}
                >
                  {safePost.imagenId && <ImageLoader imageId={safePost.imagenId} />}
                  {!safePost.imagenId && (
                    <Box h='100px' display='flex' alignItems='center' justifyContent='center' color='gray.400'>
                      <Text fontSize='sm'>(Sin imagen)</Text>
                    </Box>
                  )}
                </Box>

                <Flex
                  width={{ base: '100%', md: 'auto' }}
                  flex={{ md: '2' }}
                  direction='column'
                  gap={3}
                >
                  {safePost.texto && (
                    <Box>
                      <Text>
                        {safePost.texto}
                      </Text>
                    </Box>
                  )}

                  {safePost.tipo === '2' && (
                    <Box borderRadius='md' p={3}>
                      <Text fontWeight='bold' mb={2}>{safePost.meal?.name ? `Comida: ${safePost.meal.name}` : 'Detalle de comida'}</Text>
                      {safePost.meal?.foods?.map((food, foodIndex) => (
                        <Box key={foodIndex} mt={2} p={2} borderWidth='1px' borderRadius='md'>
                          <Text fontWeight='semibold'>{food.name}</Text>
                          <Text fontSize='sm'>Cantidad: {food.quantity}</Text>
                        </Box>
                      ))}
                      {(!safePost.meal?.foods || safePost.meal.foods.length === 0) && (
                        <Text fontSize='sm' color='gray.500'>No hay alimentos detallados.</Text>
                      )}
                    </Box>
                  )}
                  {safePost.tipo === '3' && (
                    <Box borderRadius='md' p={3}>
                      <Text fontWeight='bold' mb={2}>Rutina de Ejercicio:</Text>
                      {safePost.day?.exercises?.map((exercise, exerciseIndex) => (
                        <Box key={exerciseIndex} mt={2} p={2} borderWidth='1px' borderRadius='md'>
                          <Text fontWeight='semibold'>{exercise.name}</Text>
                          <Text fontSize='sm'>Series: {exercise.sets}</Text>
                          <Text fontSize='sm'>Repeticiones: {exercise.reps}</Text>
                          <Text fontSize='sm'>RIR: {exercise.rir}</Text>
                        </Box>
                      ))}
                      {(!safePost.day?.exercises || safePost.day.exercises.length === 0) && (
                        <Text fontSize='sm' color='gray.500'>No hay ejercicios detallados.</Text>
                      )}
                    </Box>
                  )}
                </Flex>

              </Flex>

              <Box textAlign='right'>
                <Text fontSize='xs'>
                  {FormatearFecha(safePost.fecha) || 'Fecha no disponible.'}
                </Text>
              </Box>

            </Box>
          </React.Fragment>
        )
      })}
    </VStack>
  )
}
