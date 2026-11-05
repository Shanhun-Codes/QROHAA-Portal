import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogHostComponent } from './dialog-host.component';
import { DialogService } from '../../dialog.service';

describe('Dialog backdrop dismissal', () => {
  let fixture: ComponentFixture<DialogHostComponent>;
  let dialogs: DialogService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogHostComponent],
    }).compileComponents();
    dialogs = TestBed.inject(DialogService);
    fixture = TestBed.createComponent(DialogHostComponent);
  });
  afterEach(() => {
    dialogs.closeAll();
    fixture.detectChanges();
    fixture.destroy();
  });
  function open(config = {}) {
    dialogs.open({
      title: 'Test dialog',
      message: 'Select this text',
      ...config,
    });
    fixture.detectChanges();
    return fixture.nativeElement.querySelector(
      '.dialog-backdrop',
    ) as HTMLElement;
  }
  it('closes immediately on a primary mousedown directly on the backdrop', () => {
    const backdrop = open();
    backdrop.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, button: 0 }),
    );
    expect(dialogs.dialogs().length).toBe(0);
  });
  it('keeps the dialog open when a text-selection drag starts inside and releases outside', () => {
    const backdrop = open();
    const text = backdrop.querySelector('p')!;
    text.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, button: 0 }),
    );
    backdrop.dispatchEvent(
      new MouseEvent('mouseup', { bubbles: true, button: 0 }),
    );
    // Browsers can synthesize the click on the common ancestor after a drag.
    backdrop.dispatchEvent(
      new MouseEvent('click', { bubbles: true, button: 0 }),
    );
    expect(dialogs.dialogs().length).toBe(1);
  });
  it('ignores mousedown events from dialog descendants', () => {
    const backdrop = open();
    backdrop
      .querySelector('section')!
      .dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    expect(dialogs.dialogs().length).toBe(1);
  });
  it('respects disableBackdropClose and ignores right mouse buttons', () => {
    const backdrop = open({ disableBackdropClose: true });
    backdrop.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, button: 0 }),
    );
    expect(dialogs.dialogs().length).toBe(1);
    dialogs.closeAll();
    fixture.detectChanges();
    const next = open();
    next.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, button: 2 }),
    );
    expect(dialogs.dialogs().length).toBe(1);
  });
  it('only dismisses the topmost dialog', () => {
    const lower = open();
    open();
    lower.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, button: 0 }),
    );
    expect(dialogs.dialogs().length).toBe(2);
    const backdrops =
      fixture.nativeElement.querySelectorAll('.dialog-backdrop');
    backdrops[1].dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, button: 0 }),
    );
    expect(dialogs.dialogs().length).toBe(1);
  });
  it('preserves the explicit close button', () => {
    const backdrop = open();
    (
      backdrop.querySelector('.dialog-close-button') as HTMLButtonElement
    ).click();
    expect(dialogs.dialogs().length).toBe(0);
  });
});
