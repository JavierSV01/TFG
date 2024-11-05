import React, { useState } from 'react'
import axios from 'axios'
import { DeleteIcon } from '@chakra-ui/icons'
import { Box, Button, Input, FormControl, FormLabel, Textarea, VStack, Heading, ChakraProvider, SimpleGrid, IconButton, HStack } from '@chakra-ui/react'

export function CreacionEntrenamiento () {
  const [weeks, setWeeks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // Función para añadir una nueva semana
  const addWeek = () => {
    setWeeks([...weeks, { days: [] }])
  }

  // Función para añadir un día dentro de una semana
  const addDay = (weekIndex) => {
    const newWeeks = [...weeks]
    newWeeks[weekIndex].days.push({ exercises: [] })
    setWeeks(newWeeks)
  }

  // Función para añadir un ejercicio dentro de un día
  const addExercise = (weekIndex, dayIndex) => {
    const newWeeks = [...weeks]
    newWeeks[weekIndex].days[dayIndex].exercises.push({ name: '', sets: '', reps: '', rir: '' })
    setWeeks(newWeeks)
  }

  // Función para eliminar una semana
  const removeWeek = (weekIndex) => {
    const newWeeks = weeks.filter((_, index) => index !== weekIndex)
    setWeeks(newWeeks)
  }

  // Función para eliminar un día dentro de una semana
  const removeDay = (weekIndex, dayIndex) => {
    const newWeeks = [...weeks]
    newWeeks[weekIndex].days = newWeeks[weekIndex].days.filter((_, index) => index !== dayIndex)
    setWeeks(newWeeks)
  }

  // Función para eliminar un ejercicio dentro de un día
  const removeExercise = (weekIndex, dayIndex, exerciseIndex) => {
    const newWeeks = [...weeks]
    newWeeks[weekIndex].days[dayIndex].exercises = newWeeks[weekIndex].days[dayIndex].exercises.filter((_, index) => index !== exerciseIndex)
    setWeeks(newWeeks)
  }

  // Función para manejar cambios en los ejercicios
  const handleExerciseChange = (weekIndex, dayIndex, exerciseIndex, field, value) => {
    const newWeeks = [...weeks]
    newWeeks[weekIndex].days[dayIndex].exercises[exerciseIndex][field] = value
    setWeeks(newWeeks)
  }

  const saveTraining = async () => {
    const trainingData = {
      title,
      description,
      weeks // Usa el array de semanas que tienes en el estado
    }

    try {
      const response = await axios.post('http://localhost:3001/entrenamiento', trainingData)
      console.log(response.data.message) // Mensaje de éxito
    } catch (error) {
      console.error('Error al guardar el entrenamiento:', error)
    }
  }

  return (
    <ChakraProvider>

      <Box bg='blue.400' minH='100vh' color='white' p={8}>
        <Heading as='h1' mb={8}>Crear Entrenamiento</Heading>

        {/* Formulario para título y descripción */}
        <VStack spacing={4} align='flex-start'>
          <FormControl id='title'>
            <FormLabel>Título</FormLabel>
            <Input type='text' placeholder='Título del entrenamiento' _placeholder={{ color: '#cccccc' }} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>

          <FormControl id='description'>
            <FormLabel>Descripción</FormLabel>
            <Textarea placeholder='Descripción del entrenamiento' _placeholder={{ color: '#cccccc' }} onChange={(e) => setDescription(e.target.value)} />
          </FormControl>
        </VStack>

        {/* Botón para añadir una semana */}
        <Button
          mt={4} bgColor='blue.700' color='white' border='1px solid' _hover={{
            bg: 'white', // Fondo blanco al hacer hover
            color: 'black', // Texto negro al hacer hover
            border: '1px solid', // Añade un borde para mantener la definición del botón
            borderColor: 'blue.700' // Color del borde
          }}
          transition='background-color 0.3s, color 0.3s' // Transición suave para los cambios de color
          onClick={addWeek}
        >Añadir Semana
        </Button>

        {/* Renderización de semanas */}
        {weeks.map((week, weekIndex) => (
          <Box key={weekIndex} mt={6} border='1px solid' borderRadius='md' p={4}>
            <HStack spacing={4}>
              <Heading size='md'>Semana {weekIndex + 1}</Heading>
              {/* Botón para eliminar una semana */}
              <IconButton icon={<DeleteIcon />} colorScheme='red' size='sm' onClick={() => removeWeek(weekIndex)} />
            </HStack>

            {/* Botón para añadir un día */}
            <Button mt={4} colorScheme='green' onClick={() => addDay(weekIndex)}>Añadir Día</Button>

            {/* Renderización de días */}
            {week.days.map((day, dayIndex) => (
              <Box key={dayIndex} mt={4} pl={4} borderLeft='2px solid green'>

                <HStack spacing={4}>
                  <Heading size='sm'>Día {dayIndex + 1}</Heading>
                  {/* Botón para eliminar una semana */}
                  <IconButton icon={<DeleteIcon />} colorScheme='red' size='sm' onClick={() => removeDay(weekIndex, dayIndex)} />
                </HStack>

                {/* Botón para añadir un ejercicio */}
                <Button mt={2} colorScheme='purple' onClick={() => addExercise(weekIndex, dayIndex)}>Añadir Ejercicio</Button>

                {/* Renderización de ejercicios */}
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4} p={4}>

                  {day.exercises.map((exercise, exerciseIndex) => (
                    <VStack key={exerciseIndex} mt={4} spacing={2} align='flex-start' pl={4} borderLeft='2px solid purple'>
                      <FormControl>

                        <HStack spacing={4}>
                          <FormLabel>Nombre del ejercicio</FormLabel>
                          {/* Botón para eliminar una semana */}
                          <IconButton margin='2' icon={<DeleteIcon />} colorScheme='red' size='sm' onClick={() => removeExercise(weekIndex, dayIndex, exerciseIndex)} />
                        </HStack>

                        <Input
                          type='text'
                          placeholder='Ejercicio'
                          _placeholder={{ color: '#cccccc' }}
                          value={exercise.name}
                          onChange={(e) => handleExerciseChange(weekIndex, dayIndex, exerciseIndex, 'name', e.target.value)}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Series</FormLabel>
                        <Input
                          type='number'
                          placeholder='Series'
                          _placeholder={{ color: '#cccccc' }}
                          value={exercise.sets}
                          onChange={(e) => handleExerciseChange(weekIndex, dayIndex, exerciseIndex, 'sets', e.target.value)}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Repeticiones</FormLabel>
                        <Input
                          type='number'
                          placeholder='Repeticiones'
                          _placeholder={{ color: '#cccccc' }}
                          value={exercise.reps}
                          onChange={(e) => handleExerciseChange(weekIndex, dayIndex, exerciseIndex, 'reps', e.target.value)}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>RIR</FormLabel>
                        <Input
                          type='number'
                          placeholder='RIR'
                          _placeholder={{ color: '#cccccc' }}
                          value={exercise.rir}
                          onChange={(e) => handleExerciseChange(weekIndex, dayIndex, exerciseIndex, 'rir', e.target.value)}
                        />
                      </FormControl>
                    </VStack>
                  ))}
                </SimpleGrid>
              </Box>
            ))}
          </Box>
        ))}

        {/* Botón para enviar el formulario (entrenamiento completo) */}
        <Button
          margin={2} mt={6} bgColor='blue.700' color='white' border='1px solid' _hover={{
            bg: 'white', // Fondo blanco al hacer hover
            color: 'black', // Texto negro al hacer hover
            border: '1px solid', // Añade un borde para mantener la definición del botón
            borderColor: 'blue.700' // Color del borde
          }}
          transition='background-color 0.3s, color 0.3s' // Transición suave para los cambios de color
          onClick={() => saveTraining()}
        >Guardar Entrenamiento
        </Button>

      </Box>
    </ChakraProvider>

  )
}
