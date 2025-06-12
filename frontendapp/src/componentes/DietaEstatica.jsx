import React from 'react'
import {
  ChakraProvider,
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Card,
  CardHeader,
  CardBody,
  Icon,
  SimpleGrid
} from '@chakra-ui/react'
import colors from '../constantes/colores'
import { useNavigate } from 'react-router-dom'
import { CalendarIcon } from '@chakra-ui/icons'

export const DietaEstatica = ({ detalle, entrenador }) => {
  const navigate = useNavigate()

  if (!detalle || !detalle.days) {
    return (
      <ChakraProvider>
        <Box display='flex' justifyContent='center' alignItems='center' minH='100vh' bgColor={colors.neutral} color={colors.primary}>
          <Text>No hay detalles de la dieta para mostrar.</Text>
        </Box>
      </ChakraProvider>
    )
  }

  return (
    <Box bgColor={colors.neutral} color={colors.primary} minH='100vh' py={8} px={{ base: 2, md: 4 }}>
      <Heading textAlign='center' size='xl' mb={8} color={colors.primary}>
        Plan Nutricional: {detalle.title || 'Sin título'}
      </Heading>

      <VStack spacing={8} align='stretch'>
        {detalle.days.map((day, dayIndex) => (
          <Box key={dayIndex} w='100%'>
            <Heading textAlign={{ base: 'center', md: 'left' }} size='lg' mb={4} color={colors.primary}>
              <Icon as={CalendarIcon} mr={2} verticalAlign='middle' />
              Día: {day.name || `Día ${dayIndex + 1}`}
            </Heading>

            <VStack spacing={6} align='stretch'>
              {day.meals?.map((meal, mealIndex) => (
                <Card key={mealIndex} variant='outline' borderColor={colors.secondary} borderWidth='1px' shadow='sm'>
                  <CardHeader bg={colors.secondary} color={colors.white} py={2} px={4} borderTopRadius='md'>
                    <Heading size='md'>Comida: {meal.name || `Comida ${mealIndex + 1}`}</Heading>
                  </CardHeader>
                  <CardBody p={4}>
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4} mb={4}>
                      {meal.foods?.map((food, foodIndex) => (
                        <Box
                          key={foodIndex}
                          p={3}
                          borderWidth='1px'
                          borderColor='gray.200'
                          borderRadius='md'
                          bg='gray.50'
                        >
                          <Text fontWeight='semibold' fontSize='sm' color='gray.800'>{food.name || 'Alimento sin nombre'}</Text>
                          <Text fontSize='xs' color='gray.600'>Cantidad: {food.quantity || '-'}</Text>
                        </Box>
                      ))}
                    </SimpleGrid>

                    <HStack justify='flex-end'>
                      <Button colorScheme='blue' onClick={() => navigate(`/publicarcomida/${entrenador}/${dayIndex}/${mealIndex}`)}>

                        Compartir

                      </Button>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
              {(!day.meals || day.meals.length === 0) && (
                <Text fontStyle='italic' color='gray.500' textAlign='center'>No hay comidas registradas para este día.</Text>
              )}
            </VStack>
          </Box>
        ))}
      </VStack>
    </Box>
  )
}
