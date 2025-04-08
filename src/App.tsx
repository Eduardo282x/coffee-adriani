/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router';
import { Login } from './pages/auth/Login/Login';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Clients } from './pages/clients/Clients';
import { Invoices } from './pages/invoices/Invoices';
import { Products } from './pages/products/Products';
import { SidebarProvider } from './components/ui/sidebar';
import { AppSidebar } from './pages/layout/Sidebar';
import { Inventory } from './pages/inventory/Inventory';
import { Sales } from './pages/sales/Sales';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import io from 'socket.io-client';
import { useAxiosInterceptor } from './services/Interceptor';

const socket = io('/');

function App() {
  useAxiosInterceptor();

  useEffect(() => {
    socket.emit('message', 'Enviando mensaje desde react')
  }, [])

  useEffect(() => {
    socket.on('message', data => {
      console.log(data);
    })
  }, [])

  return (
    <div className='w-screen h-screen overflow-y-auto'>
      <Toaster />
      <SidebarProvider>
        <BrowserRouter>
          <div className="flex h-full w-full">
            <AppSidebar />
            <div className="w-full h-full ">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/clientes" element={<Clients />} />
                <Route path="/facturas" element={<Invoices />} />
                <Route path="/productos" element={<Products />} />
                <Route path="/ventas" element={<Sales />} />
                <Route path="/inventario" element={<Inventory />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </SidebarProvider>
{/* 
      {interceptor} */}
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