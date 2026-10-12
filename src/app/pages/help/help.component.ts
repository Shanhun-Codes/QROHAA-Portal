import { Component, inject, OnInit } from '@angular/core';
import { AppLoaderService } from '../../shared/components/app-loader/app-loader.service';
import { RouterLink } from '@angular/router';
import { PageTemplateComponent } from '../../page-wrapper/page-template/page-template.component';
import { StatusPillComponent } from '../../shared/components/status-pill/status-pill.component';

@Component({
  selector: 'aa-help',
  imports: [PageTemplateComponent, StatusPillComponent, RouterLink],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss',
})
export class HelpComponent implements OnInit {
  private readonly appLoader = inject(AppLoaderService);

  ngOnInit(): void {
    void this.appLoader.runInitialLoad(() => Promise.resolve());
  }
}
