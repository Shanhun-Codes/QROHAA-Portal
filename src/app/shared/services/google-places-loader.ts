let loading: Promise<void> | undefined;
export async function loadPlaces(): Promise<void> {
  if ((window as any).google?.maps?.places) return;
  if (loading) return loading;
  loading = (async () => {
    const response = await fetch('/address-autocomplete-config.json');
    if (!response.ok || !response.headers.get('content-type')?.includes('json'))
      throw new Error('Address suggestions are not configured.');
    const config = await response.json();
    if (typeof config.googleMapsKey !== 'string' || !config.googleMapsKey)
      throw new Error('Address suggestions are not configured.');
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      const timeout = window.setTimeout(() => {
        script.remove();
        delete (window as any).__qrohaaPlacesReady;
        reject(new Error('Address suggestions timed out.'));
      }, 15000);
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(config.googleMapsKey)}&libraries=places&loading=async&callback=__qrohaaPlacesReady`;
      script.async = true;
      (window as any).__qrohaaPlacesReady = () => {
        clearTimeout(timeout);
        delete (window as any).__qrohaaPlacesReady;
        resolve();
      };
      script.onerror = () => {
        clearTimeout(timeout);
        script.remove();
        delete (window as any).__qrohaaPlacesReady;
        reject(new Error('Address suggestions unavailable.'));
      };
      document.head.appendChild(script);
    });
    if (!(window as any).google?.maps?.places)
      throw new Error('Address suggestions unavailable.');
  })();
  try {
    await loading;
  } catch (error) {
    loading = undefined;
    throw error;
  }
}
