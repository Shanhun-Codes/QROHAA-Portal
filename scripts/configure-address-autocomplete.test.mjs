import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { configureAddressAutocomplete } from './configure-address-autocomplete.mjs';

function setup(t) {
  const dir = mkdtempSync(join(tmpdir(), 'qrohaa-maps-config-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return join(dir, 'config.json');
}
test('generates the runtime JSON from a hosting environment key', t => {
  const outputPath = setup(t);
  assert.equal(configureAddressAutocomplete({ key: ' test-browser-key ', outputPath, required: true }), true);
  assert.deepEqual(JSON.parse(readFileSync(outputPath, 'utf8')), { googleMapsKey: 'test-browser-key' });
});
test('required QA configuration fails when no key is available', t => {
  const outputPath = setup(t);
  assert.throws(() => configureAddressAutocomplete({ outputPath, required: true }), /GOOGLE_MAPS_BROWSER_KEY is required/);
});
test('accepts a valid local ignored configuration without rewriting it', t => {
  const outputPath = setup(t);
  const content = '{"googleMapsKey":"local-test-key"}\n';
  writeFileSync(outputPath, content);
  assert.equal(configureAddressAutocomplete({ outputPath, required: true }), true);
  assert.equal(readFileSync(outputPath, 'utf8'), content);
});
test('rejects malformed or empty configuration in a QA build', t => {
  const outputPath = setup(t);
  for (const content of ['invalid JSON', '{}', '{"googleMapsKey":" "}']) {
    writeFileSync(outputPath, content);
    assert.throws(() => configureAddressAutocomplete({ outputPath, required: true }), /required/);
  }
});
