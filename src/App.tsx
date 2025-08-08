/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router';
import { Login } from './pages/auth/Login/Login';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Clients } from './pages/clients/Clients';
import { Invoices } from './pages/invoices/Invoices';
import { Products } from './pages/products/Products';
// import { SidebarProvider } from './components/ui/sidebar';
// import { AppSidebar } from './pages/layout/Sidebar';
import { Inventory } from './pages/inventory/Inventory';
import { Sales } from './pages/sales/Sales';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAxiosInterceptor } from './services/Interceptor';
import { Users } from './pages/users/Users';
import { Layout } from './pages/layout/Layout';
import { Payments } from './pages/payments/Payments';
import { socket, useSocket } from './services/socket.io';
import { Accounts } from './pages/accounts/Accounts';
import { Administration } from './pages/administration/Administration';
import { Collections } from './pages/collections/Collections';


function AxiosInterceptorProvider() {
  useAxiosInterceptor();
  return null;
}

function App() {
  // useAxiosInterceptor();

  useSocket('message', data => {
    console.log(data);
  })

  useEffect(() => {
    socket.emit('message', 'Enviando mensaje desde react')
  }, [])

  return (
    <div className='w-screen h-screen overflow-y-auto bg-[#ebe0d2]'>
      <Toaster />
      <BrowserRouter>
        <AxiosInterceptorProvider />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clientes" element={<Clients />} />
            <Route path="/facturas" element={<Invoices />} />
            <Route path="/productos" element={<Products />} />
            {/* <Route path="/productos/historial" element={<Products />} /> */}
            <Route path="/ventas" element={<Sales />} />
            <Route path="/inventario" element={<Inventory />} />
            <Route path="/usuarios" element={<Users />} />
            <Route path="/administracion" element={<Administration />} />
            <Route path="/cobranza" element={<Collections />} />
            <Route path="/pagos" element={<Payments />} />
            <Route path="/cuentas-pago" element={<Accounts />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App


export const sendMessage = (channel: string, data: any) => {
  socket.emit(channel, data)
}

export const listenMessage = (channel: string) => {
  socket.on(channel, data => {
    console.log(data);
    return data;
  })
}