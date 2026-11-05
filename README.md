# QrohaaPortal

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.20.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
# QROHAA-Portal

## Property address suggestions

Only `PROPERTY_FORM_CONFIG` opts into Google Places address autocomplete. This is
used by property entry and the new-property step inside open-house creation; it
is not enabled for brokerage settings, visitors, lead forms, or existing-property
selection. The search widget uses Places API (New). Selecting a suggestion fetches only `addressComponents` and fills the structured address fields. Manual entry
remains available when no key is configured or a request fails. A matched address
is not proof of property ownership or listing accuracy.

To enable it, deploy `/address-autocomplete-config.json` with the structure shown
in `public/address-autocomplete-config.example.json`. Set `GOOGLE_MAPS_BROWSER_KEY` in the hosting build environment before running
`npm run build:qa` (or supply the JSON file through hosting configuration); the real file is ignored by Git. The automatic QA
build must receive or generate this file separately. It is intentionally not
copied from another application's credentials into source control. Restrict the
key to the appropriate QROHAA portal referrers and Maps/Places APIs, verify the
existing billing/quota setup, and test suggestions on QA. The integration uses Places API (New) and fetches only address components after a selection.

## Open-house times

The shared time picker offers 15-minute presets and an exact-minute custom mode.
It preserves the existing `HH:mm` form value. Event entry and edit use the browser's
local timezone (shown above the form), and API values remain ISO instants. End times
must follow start times, including the existing two-day event option. Event-specific
IANA timezones and consistent timezone labels on PDFs/public pages remain separate
follow-up work; this change does not introduce a property timezone model.

### QA address autocomplete deployment

1. Allow `https://qa-portal.open-house.studio/*` on the QROHAA Maps browser key.
2. Set `GOOGLE_MAPS_BROWSER_KEY` in the QA hosting build environment. Do not use a GIHH key.
3. Run `npm run build:qa`; its prebuild generates the ignored runtime JSON and
   fails if neither an environment key nor valid local configuration is available.
4. Deploy the complete `dist/qrohaa-portal/browser` output, including
   `address-autocomplete-config.json`. Do not cache this JSON as immutable.
5. Verify the QA property dialog displays suggestions and populates street, city,
   state, and ZIP; repeat in the new-property step of open-house creation.

Running `ng build` directly bypasses npm prebuild hooks. If the hosting service
uses a direct Angular command, run the configuration script with `--required` first.
