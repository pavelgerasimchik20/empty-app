// src/app/mocks/custom-input.component.mock.ts
import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  template: `
    <div class="form-group">
      <label>{{ label }}</label>
      <input
        [type]="type || 'text'"
        [placeholder]="placeholder"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onBlur()"
      />
      <div class="error" *ngIf="error">{{ error }}</div>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockCustomInputComponent),
      multi: true
    }
  ],
  standalone: true
})
export class MockCustomInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() error = '';

  value: any = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  onInput(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
  }

  onBlur() {
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}
}