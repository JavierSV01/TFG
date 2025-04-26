// ListaDePublicaciones.js
import React from 'react'
import {
  Box,
  VStack,
  Heading,
  Text,
  HStack,
  Button
} from '@chakra-ui/react'
import ImageLoader from './ImageLoader'
import FotoDePerfil from './FotoDePerfil'
import { StarIcon } from '@chakra-ui/icons'

function FormatearFecha (fechaString) {
  const fecha = new Date(fechaString)
  const fechaFormateada = fecha.toLocaleDateString('es-ES')
  return fechaFormateada
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
    <VStack spacing={4} align='stretch'>
      {publicaciones.map((post, index) => {
        const isFavorito = favoritos.includes(post._id)
        return (
          <React.Fragment key={post._id || index}>
            <Box
              p={4}
              shadow='md'
              borderWidth='1px'
              borderRadius='md'
              w='100%'
            >

              <HStack m={2} justifyContent='space-between'>
                <HStack>
                  <Box width='100px'><FotoDePerfil username={post.usuario} /></Box>
                  <Heading as='h3' size='md' mb={2}>
                    {post.usuario || `Publicación ${post._id}`}
                  </Heading>
                </HStack>
                <Button
                  variant='ghost'
                  onClick={() => onGuardar(post._id)}
                >
                  <StarIcon color={isFavorito ? 'yellow.400' : 'gray.400'} />
                </Button>
              </HStack>

              <Box textAlign='right' mt={2} />

              <Box m={2} display='flex' justifyContent='center'>
                <ImageLoader imageId={post.imagenId} />
              </Box>

              <Box m={2} display='flex' justifyContent='center'>
                <Text>
                  {post.texto || 'Contenido no disponible.'}
                </Text>
              </Box>

              {post.tipo === '2' && (
                <Box m={2}>
                  {post.meal.name}
                  {post.meal.foods?.map((food, foodIndex) => (
                    <Box key={foodIndex} mt={2} p={2} borderWidth='1px' borderRadius='md'>
                      <Text fontWeight='semibold'>{food.name}</Text>
                      <Text>Cantidad: {food.quantity}</Text>
                    </Box>
                  ))}
                </Box>
              )}

              {post.tipo === '3' && (
                <Box m={2}>
                  {post.day.exercises?.map((exercise, exerciseIndex) => (
                    <Box key={exerciseIndex} mt={2} p={2} borderWidth='1px' borderRadius='md'>
                      <Text fontWeight='semibold'>{exercise.name}</Text>
                      <Text>Series: {exercise.sets}</Text>
                      <Text>Repeticiones: {exercise.reps}</Text>
                      <Text>RIR: {exercise.rir}</Text>
                    </Box>
                  ))}
                </Box>
              )}

              <Box m={2} textAlign='right'>
                <Text>{FormatearFecha(post.fecha) || 'Contenido no disponible.'}</Text>
              </Box>

            </Box>
          </React.Fragment>
        )
      })}
    </VStack>
  )
}
