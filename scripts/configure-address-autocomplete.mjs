import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// Browser keys are public at runtime; enforce website/API restrictions in Google Cloud.
export function configureAddressAutocomplete({ key, outputPath, required = false }) {
  const googleMapsKey = key?.trim();
  if (googleMapsKey) {
    writeFileSync(outputPath, JSON.stringify({ googleMapsKey }));
    return true;
  }
  if (existsSync(outputPath)) {
    try {
      const existing = JSON.parse(readFileSync(outputPath, 'utf8'));
      if (typeof existing.googleMapsKey === 'string' && existing.googleMapsKey.trim()) return true;
    } catch { /* Report a missing/invalid configuration below. */ }
  }
  if (required) throw new Error('GOOGLE_MAPS_BROWSER_KEY is required for the QA build. Set it in the hosting build environment.');
  return false;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const configured = configureAddressAutocomplete({
    key: process.env.GOOGLE_MAPS_BROWSER_KEY,
    outputPath: new URL('../public/address-autocomplete-config.json', import.meta.url),
    required: process.argv.includes('--required'),
  });
  console.log(configured ? 'Property address autocomplete configuration is ready.' : 'No Maps browser key supplied; manual property address entry remains available.');
}
