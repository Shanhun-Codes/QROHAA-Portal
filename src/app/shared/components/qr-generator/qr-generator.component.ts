import { Component, input } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'aa-qr-generator',
  imports: [QRCodeComponent],
  templateUrl: './qr-generator.component.html',
  styleUrl: './qr-generator.component.scss',
})
export class QrGeneratorComponent {
  readonly qrdata = input.required<string>();

  readonly fileName = input('open-house-qr-code.png');

  readonly width = input(200);

  readonly showDownload = input(true);

  qrCodeDownloadLink: SafeUrl = '';

  onChangeURL(url: SafeUrl): void {
    this.qrCodeDownloadLink = url;
  }
}
