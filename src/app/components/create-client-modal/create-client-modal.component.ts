import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardsService } from '../../services/cards.service';
import { CustomInputComponent } from '../input/input.component';

@Component({
  selector: 'app-create-client-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomInputComponent],
  templateUrl: './create-client-modal.component.html',
  styleUrls: ['./create-client-modal.component.css']
})
export class CreateClientModalComponent {
  private fb = inject(FormBuilder);
  private cardsService = inject(CardsService);

  @Input() set isOpen(value: boolean) {
    if (value) {
      this.open();
    } else {
      this.close();
    }
  }

  @Output() clientCreated = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

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
    loyalty_level: ['']
  });

  open() {
    this.showModal = true;
    this.error = null;
    this.clientForm.reset({
      bonus: 0,
      template: 'Тестовый'
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
      ...this.clientForm.value
    };

    this.cardsService.createCard(formData).subscribe({
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
      }
    });
  }

  get phoneError(): string {
    const phoneControl = this.clientForm.get('phone');
    if (phoneControl?.errors?.['pattern']) {
      return 'Phone must be in format 7XXXXXXXXXX';
    }
    return '';
  }

  get emailError(): string {
    const emailControl = this.clientForm.get('email');
    if (emailControl?.errors?.['email']) {
      return 'Please enter a valid email';
    }
    return '';
  }
}