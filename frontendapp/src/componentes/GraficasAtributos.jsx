import { Box, VStack } from '@chakra-ui/react'
import { Grafica } from './Grafica'

const GraficasAtributos = ({ atributos }) => {
  return (
    <VStack spacing={8}>
      {atributos.map((atributo, index) => {
        const dataLabels = atributo.historial.map((item) => item.fecha)
        const data = atributo.historial.map((item) => item.valor)
        return (
          <Box key={index} width='100%'>
            <Grafica
              dataLabels={dataLabels}
              data={data}
              chartLabel={atributo.nombre}
            />
          </Box>
        )
      })}
    </VStack>
  )
}

export default GraficasAtributos
