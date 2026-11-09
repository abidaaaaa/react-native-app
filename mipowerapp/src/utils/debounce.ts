/**
 * Debounce con cancelación.
 * Espera `wait` ms sin nuevas llamadas antes de ejecutar `fn`.
 * Incluye `.cancel()` para limpiar el timer pendiente (por ejemplo al desmontar).
 */
export function debounce<T extends (...args: any[]) => void>(fn: T, wait: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, wait);
  };

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return debounced;
}
