import { Text, Box, Button, Heading, Stack, Modal, ModalHeader, ModalFooter, ModalBody, ModalOverlay, ModalContent, useDisclosure, IconButton, useToast, HStack, Flex } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useDietsPlans } from '../hooks/useDietsPlans'
import { useState } from 'react'
import colors from '../constantes/colores'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'

export function MisDietasCreadas () {
  const { dietas, reload } = useDietsPlans()
  const navigate = useNavigate()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [dietaAEliminar, setDietaAEliminar] = useState(null)

  const toast = useToast()

  const handleDeleteDieta = async () => {
    if (!dietaAEliminar) return

    try {
      axios.defaults.withCredentials = true
      await axios.delete(`${ENDPOINTS.USER.DELETEDIET}?titulo=${dietaAEliminar}`)
      reload()
      toast({
        title: 'Dieta borrada',
        description: 'La dieta fue borrada correctamente.',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un error al borrar la dieta. ' + error,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setDietaAEliminar(null)
      onClose() // Cierra el modal después de la acción
    }
  }

  const confirmarEliminacion = (dietTitle) => {
    setDietaAEliminar(dietTitle)
    onOpen() // Abre el modal
  }
  return (
    <Box>
      <Heading as='h1' mb={6}>
        Mis Dietas
      </Heading>
      <Stack spacing={4}> {/* Espaciado vertical entre elementos */}
        {dietas.map((dieta, index) => (
          <Flex
            key={index}
            justifyContent='space-between' // Título a la izq., botones a la der.
            alignItems='center' // Alineación vertical centrada
            p={3} // Padding interno
            borderWidth='1px' // Opcional: Borde
            borderRadius='md' // Opcional: Bordes redondeados
            w='100%'
          >
            {/* Título a la izquierda */}
            <Heading as='h3' size='md' mr={4}> {/* Heading con margen derecho */}
              {dieta.title}
            </Heading>

            {/* Grupo de botones a la derecha */}
            <HStack spacing={2}> {/* Agrupación horizontal con espaciado */}
              <Button
                leftIcon={<EditIcon />} // Icono de edición
                bgColor={colors.primary}
                textColor={colors.white}
                _hover={{ bgColor: colors.secondary }}
                onClick={() => navigate(`/modificarDieta/${dieta.title}`)} // Acción de modificar
                size='sm'
              >
                Modificar
              </Button>
              <IconButton
                icon={<DeleteIcon />}
                aria-label={`Borrar dieta ${dieta.title}`} // Etiqueta accesible
                bgColor={colors.primary}
                textColor={colors.white}
                _hover={{ bgColor: colors.secondary }}
                onClick={() => confirmarEliminacion(dieta.title)} // Acción de eliminar
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
            <Button colorScheme='red' mr={3} onClick={handleDeleteDieta}>
              Sí, borrar
            </Button>
            <Button variant='ghost' onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
