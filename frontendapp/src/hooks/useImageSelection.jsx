import { useState, useCallback } from 'react'

export function useImageSelection () {
  // Estado para el archivo de imagen seleccionado (objeto File)
  const [selectedFile, setSelectedFile] = useState(null)
  // Estado para la URL de datos de la previsualización
  const [previewUrl, setPreviewUrl] = useState(null)
  // Estado para posibles errores durante la selección
  const [selectionError, setSelectionError] = useState('')

  // Función para manejar el cambio en el input de tipo file
  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0] // Usar optional chaining por si no hay files

    if (file) {
      // Validar que sea una imagen
      if (file.type.startsWith('image/')) {
        setSelectedFile(file)
        setSelectionError('') // Limpiar error si es válido

        // Generar previsualización
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewUrl(reader.result) // reader.result contiene la data URL (Base64)
        }
        reader.onerror = () => {
          console.error('Error al leer el archivo')
          setSelectionError('Error al intentar previsualizar la imagen.')
          setSelectedFile(null)
          setPreviewUrl(null)
        }
        reader.readAsDataURL(file)
      } else {
        // No es una imagen
        setSelectedFile(null)
        setPreviewUrl(null)
        setSelectionError('Por favor, selecciona un archivo de imagen válido (ej: JPG, PNG, GIF).')
      }
    } else {
      // No se seleccionó archivo (ej: el usuario canceló)
      // Opcional: podrías querer limpiar la selección previa o no hacer nada
      setSelectedFile(null)
      setPreviewUrl(null)
      setSelectionError('') // Limpiar error si cancela
    }
  }, []) // No tiene dependencias externas, se crea una vez

  // Función para limpiar la selección manualmente
  const clearSelection = useCallback(() => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setSelectionError('')
    // Si estás controlando el input externamente, necesitarías resetear su valor también
    // document.getElementById('mi-input-id').value = ''; // Ejemplo si usas ID
  }, [])

  // Retornamos el estado y las funciones para que los componentes los usen
  return {
    selectedFile,
    previewUrl,
    selectionError,
    handleFileChange,
    clearSelection,
    // Prop helper para el input file
    getInputProps: () => ({
      type: 'file',
      accept: 'image/*',
      onChange: handleFileChange
    })
  }
}
