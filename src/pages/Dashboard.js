// src/pages/Dashboard.js
import React from 'react'
import { Outlet } from 'react-router-dom'
import Layout from '../components/Layout'

function Dashboard() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default Dashboard
