/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Login } from './pages/auth/Login/Login';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Clients } from './pages/clients/Clients';
import { InvoicesPage } from './pages/invoices/Invoices';
import { Products } from './pages/products/Products';
import { Inventory } from './pages/inventory/Inventory';
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
import { Profile } from './pages/profile/Profile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Enterprise } from './pages/enterprise/Enterprise';
import { Supplier } from './pages/supplier/Supplier';
import { ItemsPage } from './pages/items/ItemsPage';
import { RoleGuard } from './components/auth/RoleGuard';
import { ADMIN_ROLE } from './pages/layout/sidebar.data';
import { isAxiosError } from 'axios';

function AxiosInterceptorProvider() {
  useAxiosInterceptor();
  return null;
}

// 401/403/429 no se reintentan: el refresh es de un solo uso y el throttling del backend
// debe mostrarse al usuario en lugar de insistir en bucle.
const NON_RETRIABLE_STATUS = [401, 403, 429];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status;
          if (status && NON_RETRIABLE_STATUS.includes(status)) {
            return false;
          }
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
    },
  },
});

function App() {
  useSocket('message', data => {
    console.log(data);
  })

  useEffect(() => {
    socket.emit('message', 'Enviando mensaje desde react')
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <div className='w-screen h-screen overflow-hidden bg-[#ebe0d2]'>
        <Toaster />
        <BrowserRouter>
          <AxiosInterceptorProvider />
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clientes" element={<Clients />} />
              <Route path="/facturas" element={<InvoicesPage />} />
              <Route path="/bultos" element={<ItemsPage />} />
              <Route path="/productos" element={<Products />} />
              <Route path="/inventario" element={<Inventory />} />
              <Route
                path="/usuarios"
                element={
                  <RoleGuard roles={[ADMIN_ROLE]}>
                    <Users />
                  </RoleGuard>
                }
              />
              <Route path="/administracion" element={<Administration />} />
              <Route path="/cobranza" element={<Collections />} />
              <Route path="/pagos" element={<Payments />} />
              <Route path="/empresa" element={<Enterprise />} />
              <Route path="/cuentas-pago" element={<Accounts />} />
              <Route path="/proveedores" element={<Supplier />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="*" element={<Navigate to="/"  replace/>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
