import React from 'react'
import { ChakraProvider, Box, SimpleGrid, Text, Heading, Button, Divider, AbsoluteCenter } from '@chakra-ui/react'
import { useParams, useNavigate } from 'react-router-dom'
import useMisAsociaciones from '../hooks/useMisAsociaciones'
import { useAuthCheck } from '../hooks/useAuthCheck'
import colors from '../constantes/colores'
export function PaginaMiEntrenamiento () {
  const { authenticated, message } = useAuthCheck()
  const { entrenador, idEntrenamiento } = useParams()
  const asociaciones = useMisAsociaciones()
  const navigate = useNavigate()
  const asociacion = asociaciones.find(asociacion => asociacion.usuarioEntrenador === entrenador)
  let entrenamientoEncontrado = null
  if (asociacion) {
    entrenamientoEncontrado = asociacion.entrenamientos.find(
      ent => ent._id.$oid === idEntrenamiento
    )
  } else {
    console.log('No se encontró ninguna asociación con ese usuarioEntrenador')
  }

  if (!authenticated) {
    return <div>{message}</div>
  } else if (!asociacion) {
    return <div>Usted no esta siendo asesorado por {entrenador}</div>
  } else if (!entrenamientoEncontrado) {
    return <div>Entrenamiento no encontrado</div>
  } else {
    return (
      <ChakraProvider>
        <Box bgColor={colors.neutral} color={colors.primary} minH='100vh' p={2}>
          <Heading textAlign='center' size='lg' m={4} textColor={colors.primary}>
            Entrenamiento {entrenamientoEncontrado.entrenamiento[0].title}
          </Heading>

          <Text m={8} fontSize='xl' fontWeight='semibold'>
            Descripcion: {entrenamientoEncontrado.entrenamiento[0].description}
          </Text>

          {entrenamientoEncontrado.entrenamiento[0]?.weeks?.length > 0
            ? (
                entrenamientoEncontrado.entrenamiento[0].weeks.map((semana, semIndex) => (
                  <Box key={semIndex} ml={10} mr={10} mb={4}>
                    <Box position='relative' pl={4} pr={4}>
                      <Divider borderColor={colors.primary} />
                      <AbsoluteCenter textColor={colors.primary} bg={colors.neutral} px='4' fontSize={18}>Semana {semIndex + 1}</AbsoluteCenter>
                    </Box>
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 4, xl: 7 }} spacing={4} justifyItems='center' p={8}>
                      {semana.days?.length > 0
                        ? (
                            semana.days.map((dia, diaIndex) => (
                              <Box key={diaIndex} p={2} borderWidth='1px' borderRadius='md' display='flex' flexDirection='row' alignItems='center' justifyContent='center' width='100%'>
                                <Text fontWeight='semibold' mr={2}>Día {diaIndex + 1}</Text>
                                <Button
                                  bgColor={colors.secondary} textColor={colors.white}
                                  _hover={{ bgColor: colors.primary, color: colors.neutral }}
                                  onClick={() => navigate(`/entrenador/${entrenador}/${idEntrenamiento}/${semIndex}/${diaIndex}`)}
                                >
                                  Ver
                                </Button>
                              </Box>
                            ))
                          )
                        : (
                          <Text>No hay días disponibles</Text>
                          )}
                    </SimpleGrid>
                  </Box>
                ))
              )
            : (
              <Text>No hay semanas disponibles</Text>
              )}
        </Box>
      </ChakraProvider>
    )
  }
}
