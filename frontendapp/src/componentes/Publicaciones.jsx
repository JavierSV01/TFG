import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios' // Importa axios
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Center,
  HStack
} from '@chakra-ui/react'
import { ENDPOINTS } from '../constantes/endponits'
import ImageLoader from './ImageLoader'
import FotoDePerfil from './FotoDePerfil'

const POSTS_PER_PAGE = 2
// ------------------------------------------

function FormatearFecha ({ fechaString }) {
  const fecha = new Date('Sun, 13 Apr 2025 17:36:58 GMT')

  const fechaFormateada = fecha.toLocaleDateString('es-ES') // "13/4/2025"

  return fechaFormateada
}
export function Publicaciones () {
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(null)

  // Función para cargar las publicaciones usando axios
  const fetchPosts = useCallback(async (pageToFetch) => {
    setLoading(true)
    setError(null)

    try {
      // Usamos axios.get. Pasamos los parámetros de URL en el objeto 'params'
      const response = await axios.get(ENDPOINTS.PUBLICACION.GETPUBLICACIONES, {
        params: {
          page: pageToFetch,
          limit: POSTS_PER_PAGE
        }
      })

      // axios devuelve los datos directamente en la propiedad 'data'
      const data = response.data

      // --- Ajusta según la estructura de tu respuesta API ---
      const newPosts = data.posts || data.data || []
      const apiHasMore = data.hasNextPage ?? (newPosts.length === POSTS_PER_PAGE)
      // -----------------------------------------------------

      setPosts(prevPosts => {
        return [...prevPosts, ...newPosts]
      })

      setHasMore(apiHasMore)

      if (newPosts.length < POSTS_PER_PAGE) {
        setHasMore(false)
      }
    } catch (err) {
      console.error('Error fetching posts with axios:', err)
      // axios pone la información del error HTTP en err.response
      // Intentamos obtener un mensaje de error más específico si está disponible
      const errorMessage =
        err.response?.data?.message || // Mensaje específico del backend (si existe)
        err.response?.statusText || // Texto de estado HTTP (ej: "Not Found")
        err.message || // Mensaje de error general de axios/JS
        'No se pudo conectar al API' // Mensaje genérico
      setError(`Error: ${errorMessage}`)
      setHasMore(false) // Detenemos la carga si hay un error
    } finally {
      setLoading(false)
    }
  }, []) // useCallback sin dependencias externas fijas

  // useEffect para la carga inicial y cuando currentPage cambie (sin cambios aquí)
  useEffect(() => {
    fetchPosts(currentPage)
  }, [currentPage, fetchPosts])

  // Manejador para el botón "Cargar más" (sin cambios aquí)
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setCurrentPage(prevPage => prevPage + 1)
    }
  }

  // El JSX para renderizar el componente permanece igual
  return (
    <Box p={5} mx='auto'>
      {error && (
        <Alert status='error' mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      <VStack spacing={4} align='stretch'>
        {posts.map((post, index) => (
          <React.Fragment key={post._id || index}>
            <Box
              p={4}
              shadow='md'
              borderWidth='1px'
              borderRadius='md'
              w='100%'
            >
              <HStack m={2}>
                <Box width='100px'><FotoDePerfil username={post.usuario} /></Box>
                <Heading as='h3' size='md' mb={2}>
                  {post.usuario || `Publicación ${post._id}`}
                </Heading>
              </HStack>
              <Box m={2} display='flex' justifyContent='center'>
                <ImageLoader imageId={post.imagenId} />
              </Box>
              <Box m={2} display='flex' justifyContent='center'>
                <Text>
                  {post.texto || 'Contenido no disponible.'}
                </Text>
              </Box>

              <Box textAlign='right'>
                <Text>
                  {FormatearFecha(post.fecha) || 'Contenido no disponible.'}
                </Text>
              </Box>
            </Box>
            {/* {index < posts.length - 1 && <Divider />} */}
          </React.Fragment>
        ))}
      </VStack>

      {loading && (
        <Center mt={4}>
          <Spinner size='xl' />
        </Center>
      )}

      {!loading && hasMore && (
        <Center mt={6}>
          <Button onClick={handleLoadMore} isLoading={loading} colorScheme='teal'>
            Cargar más
          </Button>
        </Center>
      )}

      {!loading && !hasMore && posts.length > 0 && (
        <Center mt={6}>
          <Text color='gray.500'>No hay más publicaciones para mostrar.</Text>
        </Center>
      )}

      {!loading && posts.length === 0 && !error && (
        <Center mt={6}>
          <Text color='gray.500'>No se encontraron publicaciones.</Text>
        </Center>
      )}
    </Box>
  )
}
