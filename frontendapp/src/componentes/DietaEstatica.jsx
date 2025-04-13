import { Box, Heading, Divider, Grid, Text, Button } from '@chakra-ui/react'
import colors from '../constantes/colores'
import { useNavigate } from 'react-router-dom'

export const DietaEstatica = ({ detalle, entrenador }) => {
  const navigate = useNavigate()
  return (
    <Box bgColor={colors.neutral} color={colors.primary} minH='100vh' p={4}>
      <Heading textAlign='center' size='xl' m={2} textColor={colors.primary}>
        Plan nutricional: {detalle.title}
      </Heading>

      {detalle.days?.map((day, dayIndex) => (
        <Box key={dayIndex} m={6} p={4}>
          <Heading textAlign='center' size='lg' m={2} textColor={colors.primary}>
            Día: {day.name}
          </Heading>
          {day.meals?.map((meal, mealIndex) => (
            <Box key={mealIndex} m={4} p={4}>
              <Text fontSize='lg' fontWeight='bold'>Comida: {meal.name}</Text>
              <Divider borderColor={colors.primary} my={2} />
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                {meal.foods?.map((food, foodIndex) => (
                  <Box key={foodIndex} mt={2} p={2} borderWidth='1px' borderRadius='md'>
                    <Text fontWeight='semibold'>{food.name}</Text>
                    <Text>Cantidad: {food.quantity}</Text>
                  </Box>
                ))}
              </Grid>
              <Box mt={4} display='flex' justifyContent='end'>
                <Button colorScheme='blue' onClick={() => navigate(`/publicarcomida/${entrenador}/${dayIndex}/${mealIndex}`)}>
                  Compartir
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  )
}
