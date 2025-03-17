import { React, useState, useEffect } from 'react'
import Navbar from '../componentes/Navbar'
import { Box, Heading, List, ListItem, Flex, ChakraProvider, Input, Stack, FormLabel, Button, useToast, FormControl, Select, FormErrorMessage } from '@chakra-ui/react'
import GraficasAtributos from './GraficasAtributos'
import colors from '../constantes/colores'
import { useUserNameId } from '../hooks/useUserNameId'
import { useUserData } from '../hooks/useUserData'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'
import MisEntrenadores from './MisEntrenadores'

export function MiPerfilCliente () {
  const { username } = useUserNameId()
  const { userData } = useUserData(username)
  const { register, handleSubmit } = useForm()
  const {
    register: registerAttr,
    handleSubmit: handleSubmitAttr,
    formState: { errors },
    setValue,
    watch
  } = useForm()

  const [valorTipo, setValorTipo] = useState('string')
  const [atributosOptions, setAtributosOptions] = useState([])
  const atributoNombreWatch = watch('atributoNombre')

  const toast = useToast()

  const onSubmitAttr = async (data) => {
    console.log(data)
    try {
      const response = await axios.post(ENDPOINTS.USER.UPDATE_ATTR, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 200) {
        toast({
          title: 'Datos actualizados',
          description: 'Tus datos personales han sido actualizados correctamente.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })
      }

      console.log('Respuesta del servidor:', response.data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })

      console.error('Error al enviar datos:', error)
    }
  }

  const handleValorTipoChange = (e) => {
    setValorTipo(e.target.value)
  }

  const handleAtributoChange = (e) => {
    if (e.target.value === 'nuevo') {
      setValue('nombre_atributo', '')
      setValorTipo('string')
      setValue('valorTipo', 'string')
    } else {
      const selectedAtributo = atributosOptions.find(
        (option) => option.value === e.target.value
      )
      if (selectedAtributo) {
        setValue('nombre_atributo', selectedAtributo.value)
        setValue('valorTipo', selectedAtributo.valorTipo) // Actualizar el tipo de valor
        setValorTipo(selectedAtributo.valorTipo) // Actualizar el estado local
      }
    }
  }

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setValue('fecha', today)
    if (userData && userData.atributosDinamicos) {
      const options = userData.atributosDinamicos.map((atributo) => ({
        value: atributo.nombre, // Usamos atributo.nombre como valor
        label: atributo.nombre, // Usamos atributo.nombre como etiqueta
        valorTipo: atributo.valorTipo // Guardamos valorTipo para usarlo después
      }))
      setAtributosOptions(options)
    }
  }, [setValue, userData])

  const onSubmit = async (e) => {
    try {
      const response = await axios.post(ENDPOINTS.USER.UPDATE_DATA, e, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 201) {
        toast({
          title: 'Datos actualizados',
          description: 'Tus datos personales han sido actualizados correctamente.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })
      }

      console.log('Respuesta del servidor:', response.data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })

      console.error('Error al enviar datos:', error)
    }
  }

  const margen = 10

  // Si los datos no están disponibles
  if (!userData) {
    return <div>Cargando...</div>
  }

  return (
    <ChakraProvider>
      <Navbar />
      <Box bg={colors.neutral} color={colors.white} minH='100vh' p={margen}>
        <Flex direction='column' gap={margen}>
          <Box bg={colors.secondary} borderRadius='3xl' p={margen} width='100%' display='flex' flexDirection='column' alignItems='start' justifyContent='center'>
            <Flex direction={{ base: 'column', md: 'row' }} gap={10}>

              <Box flex={{ base: 1, md: 1 }} width={{ base: '100%', md: '25%' }}>
                <Stack>
                  <Heading color={colors.white} size='lg' mb={4}>Mis Datos Personales</Heading>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={3}>
                      <FormLabel>Nombre:</FormLabel>
                      <Input {...register('nombre')} type='text' defaultValue={userData?.datos?.nombre ? userData.datos.nombre : ''} placeholder='Introduce tu nombre completo' />

                      <FormLabel>Edad:</FormLabel>
                      <Input {...register('edad')} type='text' defaultValue={userData?.datos?.edad ? userData.datos.edad : ''} placeholder='Introduce tu edad' />

                      <FormLabel>Altura:</FormLabel>
                      <Input {...register('altura')} type='text' defaultValue={userData?.datos?.altura ? userData.datos.altura : ''} placeholder='Introduce tu altura' />

                      <FormLabel>Objetivo:</FormLabel>
                      <Input {...register('objetivo')} type='text' defaultValue={userData?.datos?.objetivo ? userData.datos.objetivo : ''} placeholder='Introduce tu objetivo' />

                      <Button colorScheme='blue' type='submit' w='100%'>
                        Guardar
                      </Button>
                    </Stack>
                  </form>
                </Stack>

              </Box>
              <Box flex={{ base: 1, md: 1 }} width={{ base: '100%', md: '25%' }}>
                <Stack>
                  <Heading color={colors.white} size='lg' mb={4}>Atributos varios a controlar</Heading>
                  <form onSubmit={handleSubmitAttr(onSubmitAttr)}>
                    <Stack spacing={3}>
                      <FormControl isInvalid={errors.atributoNombre}>
                        <FormLabel>Nombre del Atributo:</FormLabel>
                        <Select onChange={handleAtributoChange} value={atributoNombreWatch} defaultValue=''>
                          <option key='nuevo' value='nuevo'>Nuevo Atributo</option>
                          {atributosOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                        <Input
                          {...registerAttr('nombre_atributo', { required: 'Este campo es requerido' })}
                          type='text'
                          placeholder='Nombre del atributo'
                        />
                        <FormErrorMessage>{errors.atributoNombre && errors.atributoNombre.message}</FormErrorMessage>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Tipo de Valor:</FormLabel>
                        <Select
                          {...registerAttr('valorTipo', { required: 'Este campo es requerido' })}
                          onChange={handleValorTipoChange}
                          value={valorTipo}
                        >
                          <option value='string'>Texto</option>
                          <option value='number'>Número</option>
                        </Select>
                      </FormControl>

                      <FormControl isInvalid={errors.valor}>
                        <FormLabel>Valor:</FormLabel>
                        <Input
                          {...registerAttr('valor', {
                            required: 'Este campo es requerido',
                            pattern: valorTipo === 'number' ? { value: /^\d+(\.\d+)?$/, message: 'Debe ser un número válido' } : undefined
                          })}
                          placeholder='Valor'
                          type={valorTipo === 'number' ? 'text' : 'text'}
                        />
                        <FormErrorMessage>{errors.valor && errors.valor.message}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={errors.fecha}>
                        <FormLabel>Fecha:</FormLabel>
                        <Input
                          {...registerAttr('fecha', { required: 'Este campo es requerido' })}
                          type='date'
                        />
                        <FormErrorMessage>{errors.fecha && errors.fecha.message}</FormErrorMessage>
                      </FormControl>

                      <Button colorScheme='blue' type='submit' w='100%'>
                        Guardar atributo
                      </Button>
                    </Stack>
                  </form>
                </Stack>

              </Box>
            </Flex>

          </Box>

          <Flex direction={{ base: 'column', md: 'row' }} gap={margen}>

            <Box
              bg={colors.secondary}
              borderRadius='3xl'
              p={margen}
              flex={1}
              display='flex'
              flexDirection='column'
              alignItems='start'
              justifyContent='start'
            >
              <Heading color={colors.white} size='lg' mb={4}>
                Graficas
              </Heading>

              {/* Asegurar que el contenedor de las gráficas ocupe todo el espacio disponible */}
              <Box flex='1' width='100%' overflow='hidden'>
                <GraficasAtributos atributos={userData.atributosDinamicos} />
              </Box>
            </Box>

            <Box bg={colors.secondary} borderRadius='3xl' p={margen} flex={1} display='flex' flexDirection='column' alignItems='start' justifyContent='center'>
              <Heading color={colors.white} size='lg' mb={4}>Mis entrenadores</Heading>
              <MisEntrenadores />
            </Box>
          </Flex>

          <Box bg={colors.secondary} borderRadius='3xl' p={margen} width='100%' display='flex' flexDirection='column' alignItems='start' justifyContent='center'>
            <Heading color={colors.white} size='lg' mb={4}>Mis Notificaciones</Heading>
            <List spacing={3}>
              <ListItem>Nueva recomendación de ejercicio</ListItem>
              <ListItem>Actualización de dieta sugerida</ListItem>
              <ListItem>Recordatorio: Próxima sesión programada</ListItem>
            </List>
          </Box>
        </Flex>
      </Box>
    </ChakraProvider>
  )
}
