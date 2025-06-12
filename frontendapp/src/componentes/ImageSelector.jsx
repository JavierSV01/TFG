import React, { useRef } from 'react'
import {
  Box,
  Button,
  Image,
  Text,
  FormControl, // Para agrupar etiqueta, input, mensaje de error
  FormLabel,
  FormErrorMessage,
  Input // Usaremos Input solo para la referencia, seguirá oculto
} from '@chakra-ui/react'
// Opcional: Si quieres añadir un icono al botón
// import { Upload } from 'react-feather'; // o importa desde @chakra-ui/icons

function ImageSelector ({
  previewUrl,
  selectionError,
  getInputProps,
  triggerText = 'Seleccionar Imagen',
  label // Opcional: Una etiqueta para el FormControl
}) {
  const fileInputRef = useRef(null)

  // Función para simular el click en el input file
  const handleTriggerClick = () => {
    fileInputRef.current?.click()
  }

  // Obtenemos las props para el input del hook
  const inputProps = getInputProps()

  return (
    // FormControl ayuda con la accesibilidad y manejo de errores
    <FormControl isInvalid={!!selectionError} mb={4}>
      {label && <FormLabel>{label}</FormLabel>}

      {/* Input real oculto - Usamos Chakra Input pero lo ocultamos */}
      <Input
        {...inputProps} // Aplica type, accept, onChange
        ref={fileInputRef}
        type='file' // Aseguramos que el tipo sea file
        p={0} // Padding 0 para que no ocupe espacio visual
        height='0' // Altura 0
        width='0' // Anchura 0
        opacity={0} // Opacidad 0
        position='absolute' // Fuera del flujo normal
        zIndex='-1' // Detrás de otros elementos
        aria-hidden='true'
        tabIndex={-1} // No enfocable con tabulación
      />

      {/* Botón visible que activa el input oculto */}
      <Button
        onClick={handleTriggerClick}
        textColor='white'
        variant='outline'
      >
        {triggerText}
      </Button>

      {/* Mensaje de error */}
      <FormErrorMessage>{selectionError}</FormErrorMessage>

      {/* Previsualización */}
      {previewUrl && (
        <Box mt={4} borderWidth='1px' borderRadius='md' p={2} maxW='400px'>
          <Text fontSize='sm' mb={2} color='gray.500'>Previsualización:</Text>
          <Image
            src={previewUrl}
            alt='Previsualización'
            boxSize='100%' // Ocupa el tamaño del Box
            objectFit='cover' // O 'contain' según necesites
            borderRadius='sm'
          />
        </Box>
      )}
    </FormControl>
  )
}

export default ImageSelector
