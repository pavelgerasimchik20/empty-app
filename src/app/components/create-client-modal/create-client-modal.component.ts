import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CardsService } from '../../services/cards.service';
import { CustomInputComponent } from '../input/input.component';

@Component({
  selector: 'app-create-client-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomInputComponent],
  templateUrl: './create-client-modal.component.html',
  styleUrls: ['./create-client-modal.component.css'],
})
export class CreateClientModalComponent {
  private fb = inject(FormBuilder);
  private cardsService = inject(CardsService);
  private destroy$ = new Subject<void>();

  isOpen = input<boolean>(false);

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.open();
      } else {
        this.close();
      }
    });
  }

  clientCreated = output<void>();
  closed = output<void>();

  showModal = false;
  loading = false;
  error: string | null = null;

  clientForm: FormGroup = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    pat_name: [''],
    phone: ['', [Validators.required, Validators.pattern(/^7\d{10}$/)]],
    email: ['', [Validators.required, Validators.email]],
    birthday: [''],
    gender: [''],
    barcode: [''],
    discount: [''],
    bonus: [0],
    loyalty_level: [''],
  });

  open() {
    this.showModal = true;
    this.error = null;
    this.clientForm.reset({
      bonus: 0,
      template: 'Тестовый',
    });

    Object.keys(this.clientForm.controls).forEach((key) => {
      this.clientForm.get(key)?.markAsPristine();
      this.clientForm.get(key)?.markAsUntouched();
    });
  }

  close() {
    this.showModal = false;
    this.closed.emit();
  }

  onSubmit() {
    if (this.clientForm.invalid) return;

    this.loading = true;
    this.error = null;

    const formData = {
      template: 'Тестовый',
      ...this.clientForm.value,
    };

    this.cardsService
      .createCard(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          this.showModal = false;
          this.clientCreated.emit();
          alert('Client created successfully!');
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Error creating client';
          console.error('Create client error:', err);
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFieldError(fieldName: string): string {
    const control = this.clientForm.get(fieldName);

    // проверяем control.pristine - ошибки покажутся только после того, как поле было изменено, поэтому по пустому полю проверки нет и соответственнно ошибки тоже
    if (!control || !control.errors || control.pristine) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) {
      return this.getRequiredErrorMessage(fieldName);
    }

    if (errors['pattern'] && fieldName === 'phone') {
      return 'Phone must be in format 7XXXXXXXXXX';
    }

    if (errors['email'] && fieldName === 'email') {
      return 'Please enter a valid email';
    }

    return '';
  }

  private getRequiredErrorMessage(fieldName: string): string {
    const messages: { [key: string]: string } = {
      first_name: 'First name is required',
      last_name: 'Last name is required',
      phone: 'Phone is required',
      email: 'Email is required',
    };

    return messages[fieldName] || 'This field is required';
  }
}
