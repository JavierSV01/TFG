import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import Navbar from './Navbar'

export function LayoutConNavbar () {
  return (
    <div>
      <Navbar />
      <Box minH='100vh'>
        <Outlet />
      </Box>
    </div>
  )
}
