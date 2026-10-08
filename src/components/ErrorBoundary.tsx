import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RefreshCw, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
    children: ReactNode;
    /** Permite sustituir la pantalla de error por una propia. */
    fallback?: (reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
    error: Error | null;
}

/**
 * Sin un límite de errores, cualquier excepción durante el render deja la
 * aplicación en blanco de forma permanente: no hay mensaje, no hay botón y solo
 * un F5 lo recupera. Este componente convierte ese fallo en una pantalla
 * recuperable y, además, registra el error con su stack para poder diagnosticarlo.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { error: null };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        // console.error conserva el stack completo en la consola del navegador,
        // que es donde se consulta cuando un usuario reporta "no me carga".
        console.error('[ErrorBoundary] Error capturado:', error, info.componentStack);
    }

    handleReset = (): void => {
        this.setState({ error: null });
    };

    handleReload = (): void => {
        window.location.reload();
    };

    render(): ReactNode {
        const { error } = this.state;
        const { children, fallback } = this.props;

        if (!error) {
            return children;
        }

        if (fallback) {
            return fallback(this.handleReset);
        }

        return (
            <div className='h-full w-full bg-[#ebe0d2] flex items-center justify-center p-4'>
                <div className='bg-white border rounded-lg p-6 w-full max-w-md flex flex-col gap-4'>
                    <div className='flex items-center gap-3 text-red-600'>
                        <TriangleAlert className='size-8 shrink-0' aria-hidden='true' />
                        <h1 className='text-xl font-semibold'>Algo salió mal</h1>
                    </div>

                    <p className='text-sm text-gray-600'>
                        La aplicación encontró un error inesperado y se detuvo para no mostrarte
                        información incorrecta. Puedes recargar la página o volver a intentarlo.
                    </p>

                    <pre className='max-h-32 overflow-auto rounded-md bg-gray-100 p-3 text-xs text-gray-700 whitespace-pre-wrap'>
                        {error.message}
                    </pre>

                    <div className='flex flex-wrap gap-2'>
                        <Button variant='primary' onClick={this.handleReload}>
                            <RefreshCw aria-hidden='true' />
                            Recargar la página
                        </Button>
                        <Button variant='outline' onClick={this.handleReset}>
                            Reintentar
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}
