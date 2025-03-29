import { useState } from 'react'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'
import { Button, useToast, Input, ChakraProvider, Box, Heading, VStack, HStack, IconButton, SimpleGrid, FormControl, FormLabel } from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import colors from '../constantes/colores'

export function CrearDieta () {
  const [days, setDays] = useState([])

  const [dietName, setDietName] = useState('')

  const toast = useToast()

  const addDay = () => {
    setDays([...days, { name: '', meals: [] }])
  }

  const removeDay = (dayIndex) => {
    setDays(days.filter((_, index) => index !== dayIndex))
  }

  const addMeal = (dayIndex) => {
    const newDays = [...days]
    newDays[dayIndex].meals.push({ name: '', foods: [] })
    setDays(newDays)
  }

  const removeMeal = (dayIndex, mealIndex) => {
    const newDays = [...days]
    newDays[dayIndex].meals = newDays[dayIndex].meals.filter((_, index) => index !== mealIndex)
    setDays(newDays)
  }

  const handleMealChange = (dayIndex, mealIndex, field, value) => {
    const newDays = [...days]
    newDays[dayIndex].meals[mealIndex][field] = value
    setDays(newDays)
  }

  const addFood = (dayIndex, mealIndex) => {
    const newDays = [...days]
    newDays[dayIndex].meals[mealIndex].foods.push({ name: '', quantity: '' })
    setDays(newDays)
  }

  const removeFood = (dayIndex, mealIndex, foodIndex) => {
    const newDays = [...days]
    newDays[dayIndex].meals[mealIndex].foods = newDays[dayIndex].meals[mealIndex].foods.filter((_, index) => index !== foodIndex)
    setDays(newDays)
  }

  const handleFoodChange = (dayIndex, mealIndex, foodIndex, field, value) => {
    const newDays = [...days]
    newDays[dayIndex].meals[mealIndex].foods[foodIndex][field] = value
    setDays(newDays)
  }

  const handleDayNameChange = (dayIndex, value) => {
    const newDays = [...days]
    newDays[dayIndex].name = value
    setDays(newDays)
  }

  const saveDiet = async () => {
    const dietData = {
      dietName,
      days
    }
    try {
      await axios.post(ENDPOINTS.USER.DIET, dietData)
      setDays([])
      setDietName('')
      toast({
        title: 'Dierta guardada correctamente',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: 'Error al guardar la dieta',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  return (
    <ChakraProvider>
      <Box bg={colors.neutral} minH='100vh' color={colors.white} p={8}>
        <Box bg={colors.secondary} borderRadius='3xl' color='white' minH='100vh' p={6}>
          <HStack mb={8} justifyContent='space-between' w='100%'>
            <Heading as='h1'>Crear Dieta</Heading>
            <Button
              bgColor={colors.accent} color={colors.white} border={`1px solid ${colors.white}`}
              _hover={{ bg: colors.neutral, color: colors.primary }}
              transition='background-color 0.3s, color 0.3s'
              onClick={saveDiet}
            >Guardar dieta
            </Button>
          </HStack>
          <FormLabel>Nombre de la dieta</FormLabel>
          <Input
            mb={4}
            type='text'
            value={dietName}
            placeholder='Ejemplo: Dieta de volumen para Ruben'
            onChange={(e) => setDietName(e.target.value)}
          />

          <Button
            mb={4}
            bgColor={colors.accent} color={colors.white} border={`1px solid ${colors.white}`}
            _hover={{ bg: colors.neutral, color: colors.primary }}
            transition='background-color 0.3s, color 0.3s'
            onClick={addDay}
          >Añadir Día
          </Button>

          <VStack spacing={4} align='stretch'>
            {days.map((day, dayIndex) => (
              <Box key={dayIndex} border='3px solid' borderRadius='3xl' p={4}>

                <HStack spacing={4} align='stretch'>
                  <FormControl>
                    <FormLabel>Nombre del Día</FormLabel>
                    <Input
                      type='text'
                      placeholder='Ejemplo: Lunes'
                      value={day.name}
                      onChange={(e) => handleDayNameChange(dayIndex, e.target.value)}
                    />
                  </FormControl>
                  <IconButton icon={<DeleteIcon />} colorScheme='red' size='sm' onClick={() => removeDay(dayIndex)} />

                </HStack>

                <Button
                  mt={2}
                  bgColor={colors.accent} color={colors.white} border={`1px solid ${colors.white}`}
                  _hover={{ bg: colors.neutral, color: colors.primary }}
                  transition='background-color 0.3s, color 0.3s'
                  onClick={() => addMeal(dayIndex)}
                >Añadir Comida
                </Button>

                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} mt={4}>
                  {day.meals.map((meal, mealIndex) => (

                    <Box key={mealIndex} p={2} border='1px solid' borderRadius='xl'>
                      <VStack spacing={2} align='stretch'>
                        <HStack>
                          <IconButton icon={<DeleteIcon />} colorScheme='red' size='sm' onClick={() => removeMeal(dayIndex, mealIndex)} />
                          <FormControl>
                            <FormLabel>Comida</FormLabel>
                            <Input
                              type='text'
                              placeholder='Ejemplo: Pollo con arroz'
                              value={meal.name}
                              onChange={(e) => handleMealChange(dayIndex, mealIndex, 'name', e.target.value)}
                            />
                          </FormControl>
                        </HStack>

                        <Button size='sm' colorScheme='green' onClick={() => addFood(dayIndex, mealIndex)}>Añadir Alimento</Button>
                        {meal.foods.map((food, foodIndex) => (
                          <VStack key={foodIndex} spacing={2} align='stretch'>
                            <Input
                              type='text'
                              placeholder='Alimento'
                              value={food.name}
                              onChange={(e) => handleFoodChange(dayIndex, mealIndex, foodIndex, 'name', e.target.value)}
                            />
                            <Input
                              type='text'
                              placeholder='Cantidad'
                              value={food.quantity}
                              onChange={(e) => handleFoodChange(dayIndex, mealIndex, foodIndex, 'quantity', e.target.value)}
                            />
                            <IconButton icon={<DeleteIcon />} colorScheme='red' size='sm' onClick={() => removeFood(dayIndex, mealIndex, foodIndex)} />
                          </VStack>
                        ))}
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            ))}
          </VStack>
        </Box>
      </Box>
    </ChakraProvider>
  )
};
