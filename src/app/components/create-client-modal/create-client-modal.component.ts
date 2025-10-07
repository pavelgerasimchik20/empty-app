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
import { Card, CreateCardRequest } from '../../models/user.model';

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
  editClient = input<Card | null>(null);

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.open();
      } else {
        this.close();
      }
    });

    effect(() => {
      const client = this.editClient();
      if (client) {
        this.populateForm(client);
      }
    });
  }

  clientCreated = output<void>();
  clientUpdated = output<void>();
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

    const client = this.editClient();
    if (!client) {
      this.clientForm.reset({
        bonus: 0,
        template: 'Тестовый',
      });
    }

    Object.keys(this.clientForm.controls).forEach((key) => {
      this.clientForm.get(key)?.markAsPristine();
      this.clientForm.get(key)?.markAsUntouched();
    });
  }

  // тут будет костыль небольшой, но чтобы не менять Card сейчас , некоторые поля при обновлении зачистим, просто чтобы реализовать update
  // запрос работает корректно, но есть путаница с полями, нужно привести к одному типу если так переиспользовать модалку
  populateForm(client: Card) {
    const fioParts = client.fio?.split(' ') || ['', '', ''];

    this.clientForm.patchValue({
      first_name: fioParts[0] || '',
      last_name: fioParts[1] || '',
      pat_name: fioParts[2] || '',
      phone: client.phone || '',
      email: client.email || '',
      birthday: '',
      gender: client.gender || '',
      barcode: '',
      discount: '',
      bonus: client.bonus ? parseInt(client.bonus) : 0,
      loyalty_level: '',
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

    const client = this.editClient();
    const formData = this.prepareFormData();

    if (client) {
      this.updateClient(client.user_id, formData);
    } else {
      this.createClient(formData);
    }
  }

  private prepareFormData() {
    const formValue = this.clientForm.value;
    const data: any = {};

    Object.keys(formValue).forEach((key) => {
      if (formValue[key] !== null && formValue[key] !== '') {
        data[key] = formValue[key];
      }
    });

    return data;
  }

  private createClient(formData: any) {
    this.cardsService
      .createCard({ template: 'Тестовый', ...formData })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.handleSuccess('Client created successfully!');
          this.clientCreated.emit();
        },
        error: (err) => {
          this.handleError('Error creating client', err);
        },
      });
  }

  private updateClient(userId: number, updateData: any) {
    this.cardsService
      .updateCard(userId.toString(), updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.handleSuccess('Client updated successfully!');
          this.clientUpdated.emit();
        },
        error: (err) => {
          this.handleError('Error updating client', err);
        },
      });
  }

  private handleSuccess(message: string) {
    this.loading = false;
    this.showModal = false;
    alert(message);
  }

  private handleError(errorMessage: string, err: any) {
    this.loading = false;
    this.error = errorMessage;
    console.error('Operation error:', err);
  }

  get isEditMode(): boolean {
    return !!this.editClient();
  }

  get modalTitle(): string {
    return this.isEditMode ? 'Edit Client' : 'Create New Client';
  }

  get submitButtonText(): string {
    if (this.loading) {
      return this.isEditMode ? 'Updating...' : 'Creating...';
    }
    return this.isEditMode ? 'Update Client' : 'Create Client';
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
