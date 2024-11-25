import { PaginaLogin } from './paginas/PaginaLogin'
import { PaginaPrincipal } from './paginas/PaginaPrincipal'
import { PaginaCreacionEntrenamiento } from './paginas/PaginaCreacionEntrenamiento'
import { PaginaMiPerfil } from './paginas/PaginaMiPerfil'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App () {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<PaginaLogin />} />
        <Route path='/principal' element={<PaginaPrincipal />} />
        <Route path='/crearEntrenamiento' element={<PaginaCreacionEntrenamiento />} />
        <Route path='/perfil' element={<PaginaMiPerfil />} />
      </Routes>
    </Router>
  )
}

export default App
