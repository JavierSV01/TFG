import { Box, Heading } from '@chakra-ui/react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js'
import colors from './constantes/colores'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend)

export const GraficaPeso = () => {
  const data = {
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5'],
    datasets: [
      {
        label: 'Peso (kg)',
        data: [70, 69, 68, 67, 66],
        borderColor: colors.primary,
        backgroundColor: colors.secondary,
        fill: true,
        tension: 0.2
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Evolución de Peso'
      }
    }
  }

  return (
    <Box bg={colors.accent} borderRadius='md' p={6} width='100%' textAlign='center'>
      <Heading size='lg' mb={4}>Evolución de Peso</Heading>
      <Line data={data} options={options} />
    </Box>
  )
}
