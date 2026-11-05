import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { AppLoaderService } from './shared/components/app-loader/app-loader.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AppComponent], providers: [provideRouter([])] }).compileComponents();
  });
  it('renders the application shell and loading indicator', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('aa-app-loader')).toBeTruthy();
  });
  it('marks the shell ready after initial loading completes', () => {
    const fixture = TestBed.createComponent(AppComponent);
    TestBed.inject(AppLoaderService).stopLoading();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('aa-app-loader')).toBeNull();
    expect(fixture.nativeElement.querySelector('.app-shell--ready')).toBeTruthy();
  });
});
