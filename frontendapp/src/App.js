import { Login } from './componentes/login'
import { ChakraProvider } from '@chakra-ui/react'

function App () {
  return (
    <ChakraProvider>
      <main>
        <Login />
      </main>
    </ChakraProvider>

  )
}

export default App
