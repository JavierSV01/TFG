import React from 'react'
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Image,
  Stack,
  Divider,
  VStack,
  ChakraProvider
} from '@chakra-ui/react'
import Navbar from '../componentes/Navbar'
import colors from '../constantes/colores'
import { useUserData } from '../hooks/useUserData'
import { useParams } from 'react-router-dom'

export function PaginaCliente () {
  // Datos de ejemplo para el cliente (esto normalmente vendría de una API o estado)
  const cliente = {
    nombre: 'Juan Pérez',
    edad: 28,
    email: 'juan.perez@ejemplo.com',
    foto: 'https://img.decrypt.co/insecure/rs:fit:1920:0:0:0/plain/https://cdn.decrypt.co/wp-content/uploads/2024/11/chillguy-gID_7.jpg@webp', // Reemplaza con la URL de la foto del cliente
    entrenamiento: [
      { dia: 'Lunes', ejercicio: 'Sentadillas' },
      { dia: 'Miércoles', ejercicio: 'Pesas' },
      { dia: 'Viernes', ejercicio: 'Cardio' }
    ],
    dieta: [
      { dia: 'Lunes', comida: 'Pollo con arroz y ensalada' },
      { dia: 'Martes', comida: 'Pasta con vegetales' },
      { dia: 'Miércoles', comida: 'Salmón con quinoa' }
    ]
  }

  const { usuario } = useParams()
  const { userData } = useUserData(usuario)

  console.log(userData)

  return (
    <ChakraProvider>
      <Navbar />
      <Box minH='100vh' bg={colors.neutral} p={10}>
        <Grid
          templateColumns={{
            base: '1fr',
            lg: '1fr 2fr'
          }}
          gap={10}
        >
          <GridItem>
            <Box boxShadow='md' borderRadius='lg' overflow='hidden'>
              <Image src={cliente.foto} alt='Foto del cliente' boxSize='100%' objectFit='cover' />
            </Box>
          </GridItem>
          <GridItem margin='0 auto'>
            <Stack spacing={5}>
              <Box>
                <Heading as='h2' size='lg'>Información del Cliente</Heading>
                <Text><strong>Nombre:</strong> {cliente.nombre}</Text>
                <Text><strong>Edad:</strong> {cliente.edad} años</Text>
                <Text><strong>Email:</strong> {cliente.email}</Text>
              </Box>

              <Divider />

              <Box>
                <Heading as='h3' size='md'>Entrenamiento de esta Semana</Heading>
                <VStack align='start' spacing={3}>
                  {cliente.entrenamiento.map((item, index) => (
                    <Text key={index}>
                      <strong>{item.dia}:</strong> {item.ejercicio}
                    </Text>
                  ))}
                </VStack>
              </Box>

              <Divider />

              <Box>
                <Heading as='h3' size='md'>Dieta de esta Semana</Heading>
                <VStack align='start' spacing={3}>
                  {cliente.dieta.map((item, index) => (
                    <Text key={index}>
                      <strong>{item.dia}:</strong> {item.comida}
                    </Text>
                  ))}
                </VStack>
              </Box>
            </Stack>
          </GridItem>

        </Grid>
      </Box>

    </ChakraProvider>
  )
}
