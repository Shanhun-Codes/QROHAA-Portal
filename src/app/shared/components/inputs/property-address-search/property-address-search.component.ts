import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { loadPlaces } from '../../../services/google-places-loader';
import { propertyAddress } from '../../../services/property-address.util';

@Component({
  selector: 'aa-property-address-search',
  templateUrl: './property-address-search.component.html',
  styleUrl: './property-address-search.component.scss',
})
export class PropertyAddressSearchComponent
  implements AfterViewInit, OnDestroy
{
  readonly propertyForm = input.required<FormGroup>();
  readonly container =
    viewChild.required<ElementRef<HTMLElement>>('searchContainer');
  readonly message = signal('Loading address suggestions…');
  private readonly events = new AbortController();
  private widget?: HTMLElement;
  private selection = 0;

  async ngAfterViewInit(): Promise<void> {
    try {
      await loadPlaces();
      const { PlaceAutocompleteElement } = await (
        window as any
      ).google.maps.importLibrary('places');
      if (this.events.signal.aborted) return;
      const widget = new PlaceAutocompleteElement({
        includedRegionCodes: ['us'],
      });
      widget.setAttribute('aria-label', 'Search for a property address');
      widget.placeholder = 'Search for a property address';
      this.widget = widget;
      widget.addEventListener(
        'gmp-select',
        async (event: any) => {
          const selection = ++this.selection;
          try {
            const place = event.placePrediction.toPlace();
            // Address components stay in the Essentials tier; no map, photos or business details.
            await place.fetchFields({ fields: ['addressComponents'] });
            if (this.events.signal.aborted || selection !== this.selection)
              return;
            const address = propertyAddress(
              (place.addressComponents ?? []).map((c: any) => ({
                long_name: c.longText,
                short_name: c.shortText,
                types: c.types,
              })),
            );
            if (!address) {
              this.message.set(
                'This suggestion has an incomplete address. Enter or correct the fields below.',
              );
              return;
            }
            const form = this.propertyForm();
            form.patchValue(address);
            for (const key of Object.keys(address)) {
              form.get(key)?.markAsDirty();
              form.get(key)?.markAsTouched();
            }
            this.message.set(
              'Address filled. Review the details below, including any apartment or unit.',
            );
          } catch {
            this.message.set(
              'Could not retrieve this address. You can enter the details below.',
            );
          }
        },
        { signal: this.events.signal },
      );
      widget.addEventListener(
        'gmp-error',
        () => {
          this.message.set(
            'Address suggestions are unavailable. Enter the address below.',
          );
        },
        { signal: this.events.signal },
      );
      this.container().nativeElement.appendChild(widget);
      this.message.set(
        'Select a suggestion to fill the address, or enter it manually below.',
      );
    } catch {
      this.message.set(
        'Address suggestions are unavailable. Enter the address below.',
      );
    }
  }
  ngOnDestroy(): void {
    this.events.abort();
    this.widget?.remove();
  }
}
