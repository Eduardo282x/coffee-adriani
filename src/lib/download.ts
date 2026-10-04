/**
 * Descarga un archivo desde una respuesta Blob.
 *
 * Antes, las vistas hacían `URL.createObjectURL(response)` sin validar nada. Cuando
 * la petición fallaba, el helper devolvía el cuerpo del error (o `undefined`) en
 * lugar de un Blob, `createObjectURL` lanzaba un TypeError sin capturar y el
 * `setLoading(false)` nunca se ejecutaba: el spinner quedaba girando para siempre
 * y el usuario no recibía ningún mensaje.
 *
 * Ahora la validación ocurre aquí y el error se propaga como una excepción normal,
 * que el `catch` del call site muestra y cuyo `finally` restaura el estado.
 */
export const saveBlob = (value: unknown, filename: string): void => {
    if (typeof Blob === 'undefined' || !(value instanceof Blob) || value.size === 0) {
        throw new Error('El archivo no pudo generarse. Inténtalo de nuevo.');
    }

    const url = URL.createObjectURL(value);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // El revoke immediately después del click es correcto en la práctica: el click
    // ya encoló la navegación con la URL resuelta.
    URL.revokeObjectURL(url);
};
