import React, { useState, useEffect } from 'react'
import { useDisclosure, Heading, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Text, ChakraProvider, Box } from '@chakra-ui/react'
import { ListaDePublicaciones } from '../componentes/ListaDePublicaciones'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'
import colors from '../constantes/colores'
import { useAuthCheck } from '../hooks/useAuthCheck'
export const PaginaPostFavoritos = () => {
  const { authenticated, message } = useAuthCheck()

  const [favoritos, setFavoritos] = useState([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [publicacionAEliminar, setPublicacionAEliminar] = useState(null)

  useEffect(() => {
    fetchFavoritos()
  }, [])

  const fetchFavoritos = async () => {
    try {
      const response = await axios.get(ENDPOINTS.USER.GETFAVORITEPOSTS)
      setFavoritos(response.data.publicaciones)
    } catch (error) {
      console.error('Error al cargar favoritos', error)
    }
  }

  const handleToggleFavorito = async (postId) => {
    try {
      await axios.post(ENDPOINTS.USER.TOGGLEFAVORITEPOST, { postId })
      await fetchFavoritos() // Refrescamos después de eliminar
      onClose()
    } catch (error) {
      console.error('Error al modificar favorito', error)
    }
  }

  const handleClickEstrella = (postId) => {
    setPublicacionAEliminar(postId)
    onOpen()
  }

  const handleConfirmarEliminacion = () => {
    if (publicacionAEliminar) {
      handleToggleFavorito(publicacionAEliminar)
    }
  }

  if (!authenticated) {
    return <div>{message}</div>
  }

  return (

    <ChakraProvider>

      <Box bg={colors.neutral} color={colors.white} p={6}>
        <Box bg={colors.secondary} borderRadius='md' p={6} width='100%' display='flex' flexDirection='column' alignItems='start' justifyContent='center'>
          <Heading as='h1' size='md' mb={2}>Publicaciones marcadas como favoritas
          </Heading>
          <Box p={5} minH='100vh' mx='auto'>
            <ListaDePublicaciones
              publicaciones={favoritos}
              favoritos={favoritos.map(p => p._id)}
              onGuardar={(postId) => handleClickEstrella(postId)}
            />
          </Box>

        </Box>

        {/* Modal de confirmación */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmar Eliminación</ModalHeader>
            <ModalBody>
              <Text>¿Estás seguro de que deseas eliminar esta publicación de tus favoritos?</Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='red' mr={3} onClick={handleConfirmarEliminacion}>
                Sí, eliminar
              </Button>
              <Button variant='ghost' onClick={onClose}>Cancelar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  )
}
