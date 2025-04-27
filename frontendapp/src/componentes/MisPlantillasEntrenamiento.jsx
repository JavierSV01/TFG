import { Box, Button, Heading, Stack, IconButton, useDisclosure, useToast, Modal, ModalContent, ModalOverlay, ModalHeader, ModalBody, ModalFooter, Text, Flex, HStack } from '@chakra-ui/react'
import { usePlantillasEntrenamiento } from '../hooks/usePlantillasEntrenamiento'
import { useNavigate } from 'react-router-dom'
import colors from '../constantes/colores'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'
function MisPlantillasEntrenamiento () {
  const { plantillas, reload } = usePlantillasEntrenamiento()
  const navigate = useNavigate()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [entrenamientoAEliminar, setEntrenamientoAEliminar] = useState(null)

  const confirmarEliminacion = (workoutTitle) => {
    setEntrenamientoAEliminar(workoutTitle)
    onOpen() // Abre el modal
  }

  const toast = useToast()

  const handleDeleteEntrenamiento = async () => {
    if (!entrenamientoAEliminar) return

    try {
      axios.defaults.withCredentials = true
      await axios.delete(`${ENDPOINTS.USER.DELETEWORKOUT}?titulo=${entrenamientoAEliminar}`)
      reload()
      toast({
        title: 'Entrenamiento borrado',
        description: 'El entrenamiento fue borrado correctamente.',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un error al borrar el entrenamiento. ' + error,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setEntrenamientoAEliminar(null)
      onClose() // Cierra el modal después de la acción
    }
  }

  return (
    <Box>
      <Heading as='h1' mb={6}>
        Mis Plantillas de Entrenamiento
      </Heading>
      <Stack spacing={4}> {/* Ajusta el espaciado vertical entre elementos si es necesario */}
        {plantillas.map((plantilla, index) => (
          <Flex
            key={index}
            justifyContent='space-between' // Empuja el título a la izquierda y los botones a la derecha
            alignItems='center' // Alinea verticalmente los elementos en el centro
            p={3} // Añade algo de padding interno
            borderWidth='1px' // Opcional: añade un borde para separar visualmente
            borderRadius='md' // Opcional: bordes redondeados
            w='100%'
          >
            {/* Título a la izquierda */}
            <Heading as='h3' size='md' mr={4}> {/* Usa Heading y añade margen derecho */}
              {plantilla.title}
            </Heading>

            {/* Grupo de botones a la derecha */}
            <HStack spacing={2}> {/* HStack agrupa los botones horizontalmente con espaciado */}
              <Button
                leftIcon={<EditIcon />} // Añade el icono de edición
                bgColor={colors.primary}
                textColor={colors.white}
                _hover={{ bgColor: colors.secondary }}
                onClick={() => navigate(`/modificarEntrenamiento/${plantilla.title}`)}
                size='sm'
              >
                Modificar
              </Button>
              <IconButton
                icon={<DeleteIcon />}
                aria-label={`Borrar plantilla ${plantilla.title}`} // Mejora la accesibilidad
                bgColor={colors.primary}
                textColor={colors.white}
                _hover={{ bgColor: colors.secondary }}
                onClick={() => confirmarEliminacion(plantilla.title)}
                size='sm'
              />
            </HStack>
          </Flex>
        ))}
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Eliminación</ModalHeader>
          <ModalBody>
            <Text>¿Estás seguro de que deseas eliminar este entrenamiento?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={handleDeleteEntrenamiento}>
              Sí, borrar
            </Button>
            <Button variant='ghost' onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default MisPlantillasEntrenamiento
