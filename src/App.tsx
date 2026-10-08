/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense, lazy, useEffect } from 'react';
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Login } from './pages/auth/Login/Login';
import { ScreenLoader } from './components/loaders/ScreenLoader';
import { useAxiosInterceptor } from './services/Interceptor';
import { Layout } from './pages/layout/Layout';
import { connectSocket } from './services/socket.io';
import { getAccessToken } from './services/token.store';
import { initSessionChannel } from './services/base.service';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RoleGuard } from './components/auth/RoleGuard';
import { ADMIN_ROLE } from './pages/layout/sidebar.data';
import { isAxiosError } from 'axios';
import { Toaster } from 'react-hot-toast';
import { useNetworkStatus } from './hooks/use-network-status';

// Rutas divididas en chunks. Antes todo el app se empaquetaba en un único archivo de
// 1.5 MB (510 KB gzip): quien abría el login descargaba también el dashboard con sus
// gráficas, el editor de facturas y las 13 familias de iconos.
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard').then((m) => ({ default: m.Dashboard })));
const Clients = lazy(() => import('./pages/clients/Clients').then((m) => ({ default: m.Clients })));
const InvoicesPage = lazy(() => import('./pages/invoices/Invoices').then((m) => ({ default: m.InvoicesPage })));
const ItemsPage = lazy(() => import('./pages/items/ItemsPage').then((m) => ({ default: m.ItemsPage })));
const Products = lazy(() => import('./pages/products/Products').then((m) => ({ default: m.Products })));
const Inventory = lazy(() => import('./pages/inventory/Inventory').then((m) => ({ default: m.Inventory })));
const Users = lazy(() => import('./pages/users/Users').then((m) => ({ default: m.Users })));
const Administration = lazy(() => import('./pages/administration/Administration').then((m) => ({ default: m.Administration })));
const Collections = lazy(() => import('./pages/collections/Collections').then((m) => ({ default: m.Collections })));
const Payments = lazy(() => import('./pages/payments/Payments').then((m) => ({ default: m.Payments })));
const Enterprise = lazy(() => import('./pages/enterprise/Enterprise').then((m) => ({ default: m.Enterprise })));
const Accounts = lazy(() => import('./pages/accounts/Accounts').then((m) => ({ default: m.Accounts })));
const Supplier = lazy(() => import('./pages/supplier/Supplier').then((m) => ({ default: m.Supplier })));
const Profile = lazy(() => import('./pages/profile/Profile').then((m) => ({ default: m.Profile })));

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

const OfflineBanner = () => {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div
      role='status'
      className='fixed bottom-0 left-0 right-0 z-50 bg-red-600 text-white text-center text-sm font-medium py-2 px-4'
    >
      Sin conexión con internet. Los datos pueden no actualizarse hasta que vuelva la red.
    </div>
  );
};

function App() {
  useEffect(() => {
    // Coordina la sesión con otras pestañas: adopta los tokens renovados por otra
    // pestaña y propaga el cierre de sesión (evita reusar un refresh ya rotado).
    initSessionChannel();

    // Si la sesión ya estaba iniciada (recarga o reapertura de la app), se reconecta el
    // WebSocket con el token almacenado. Tras el login lo hace auth.service.login(),
    // y nunca se conecta antes del login porque autoConnect está en false.
    if (getAccessToken()) connectSocket();
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <div className='w-screen h-screen overflow-hidden bg-[#ebe0d2]'>
        <Toaster />
        <BrowserRouter>
          <AxiosInterceptorProvider />
          <OfflineBanner />
          <Suspense fallback={<ScreenLoader />}>
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
          </Suspense>
        </BrowserRouter>
      </div>
      {/* Los devtools se enviaban dentro del bundle de producción: se condicionan al
          entorno de desarrollo para no pagar ~13 KB gzip en cada carga. */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}

export default App
