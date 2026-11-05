import { TimePickerComponent, timeLabel } from './time-picker.component';
import { TestBed } from '@angular/core/testing';

describe('TimePickerComponent', () => {
  let picker: TimePickerComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TimePickerComponent] });
    picker = TestBed.runInInjectionContext(() => new TimePickerComponent());
  });
  it('renders a labelled preset selector and accessible exact-minute controls', () => {
    const fixture = TestBed.createComponent(TimePickerComponent);
    fixture.componentRef.setInput('inputId', 'startTime');
    fixture.componentRef.setInput('label', 'Start time');
    fixture.detectChanges();
    const select: HTMLSelectElement =
      fixture.nativeElement.querySelector('#startTime');
    expect(select.options.length).toBe(98);
    select.value = 'custom';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('[aria-label="Start time minute"]'),
    ).toBeTruthy();
  });
  it('offers quarter-hour values with unambiguous noon and midnight labels', () => {
    expect(picker.times.length).toBe(96);
    expect(timeLabel('00:00')).toBe('12:00 AM');
    expect(timeLabel('12:00')).toBe('12:00 PM');
    expect(timeLabel('23:45')).toBe('11:45 PM');
  });
  it('preserves an existing exact-minute value without emitting a user change', () => {
    const change = jasmine.createSpy();
    picker.registerOnChange(change);
    picker.writeValue('13:07');
    expect(picker.custom).toBeTrue();
    expect(picker.hour).toBe(1);
    expect(picker.minute).toBe(7);
    expect(picker.period).toBe('PM');
    expect(change).not.toHaveBeenCalled();
  });
  it('converts custom midnight, noon and exact minutes to the existing 24-hour API format', () => {
    const change = jasmine.createSpy();
    picker.registerOnChange(change);
    picker.hour = 12;
    picker.minute = 7;
    picker.period = 'AM';
    picker.updateCustom();
    expect(change).toHaveBeenCalledWith('00:07');
    picker.period = 'PM';
    picker.updateCustom();
    expect(change).toHaveBeenCalledWith('12:07');
  });
  it('supports selecting a preset, resetting and disabling', () => {
    const change = jasmine.createSpy();
    picker.registerOnChange(change);
    picker.selectTime('14:30');
    expect(change).toHaveBeenCalledWith('14:30');
    expect(picker.custom).toBeFalse();
    picker.writeValue(null);
    expect(picker.value).toBe('');
    picker.setDisabledState(true);
    expect(picker.disabled).toBeTrue();
  });
});
