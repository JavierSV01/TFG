import { PaginaInicio } from './componentes/PaginaInicio'
import { PaginaPrincipal } from './componentes/PaginaPrincipal'
import { PaginaCreacionEntrenamiento } from './componentes/PaginaCreacionEntrenamiento'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App () {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<PaginaInicio />} />
        <Route path='/principal' element={<PaginaPrincipal />} />
        <Route path='/crearEntrenamiento' element={<PaginaCreacionEntrenamiento />} />
      </Routes>
    </Router>
  )
}

export default App
