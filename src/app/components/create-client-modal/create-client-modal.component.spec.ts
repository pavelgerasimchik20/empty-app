import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MockCustomInputComponent } from '../../mocks/custom-input.component.mock';
import { CardsService } from '../../services/cards.service';
import { CreateClientModalComponent } from './create-client-modal.component';

// Mock services
const mockCardsService = {
  createCard: jasmine.createSpy('createCard').and.returnValue(of({})),
};

describe('CreateClientModalComponent', () => {
  let component: CreateClientModalComponent;
  let fixture: ComponentFixture<CreateClientModalComponent>;
  let cardsService: CardsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateClientModalComponent,
        ReactiveFormsModule,
        MockCustomInputComponent,
      ],
      providers: [{ provide: CardsService, useValue: mockCardsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateClientModalComponent);
    component = fixture.componentInstance;
    cardsService = TestBed.inject(CardsService);
    fixture.detectChanges();
  });

  afterEach(() => {
    mockCardsService.createCard.calls.reset();
    spyOn(window, 'alert').and.stub();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.clientForm).toBeDefined();
    expect(component.clientForm.get('first_name')).toBeTruthy();
    expect(component.clientForm.get('last_name')).toBeTruthy();
    expect(component.clientForm.get('phone')).toBeTruthy();
    expect(component.clientForm.get('email')).toBeTruthy();
    expect(component.clientForm.get('bonus')?.value).toBe(0);
  });

  it('should open modal and reset form when isOpen is set to true', () => {
    component.isOpen = true;
    expect(component.showModal).toBeTrue();
    expect(component.error).toBeNull();
    expect(component.clientForm.get('bonus')?.value).toBe(0);
  });

  it('should close modal and emit closed event when close() is called', () => {
    const closedEmitSpy = spyOn(component.closed, 'emit');

    component.showModal = true;
    component.close();

    expect(component.showModal).toBeFalse();
    expect(closedEmitSpy).toHaveBeenCalled();
  });

  it('should not submit if form is invalid', () => {
    component.clientForm.get('first_name')?.setValue('');
    component.clientForm.get('last_name')?.setValue('');
    component.clientForm.get('phone')?.setValue('');
    component.clientForm.get('email')?.setValue('');

    component.onSubmit();

    expect(cardsService.createCard).not.toHaveBeenCalled();
  });

  it('should submit form when valid', fakeAsync(() => {
    component.clientForm.patchValue({
      first_name: 'John',
      last_name: 'Doe',
      phone: '79876543211',
      email: 'john.doe@example.com',
      bonus: 100,
    });

    component.onSubmit();
    tick();

    expect(cardsService.createCard).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  }));

  it('should return phone error message for invalid pattern', () => {
    component.clientForm.get('phone')?.setValue('invalid');
    component.clientForm.get('phone')?.markAsTouched();

    const error = component.phoneError;
    expect(error).toBe('Phone must be in format 7XXXXXXXXXX');
  });

  it('should return empty phone error message for valid phone', () => {
    component.clientForm.get('phone')?.setValue('79876543211');
    component.clientForm.get('phone')?.markAsTouched();

    const error = component.phoneError;
    expect(error).toBe('');
  });

  it('should return email error message for invalid email', () => {
    component.clientForm.get('email')?.setValue('invalid-email');
    component.clientForm.get('email')?.markAsTouched();

    const error = component.emailError;
    expect(error).toBe('Please enter a valid email');
  });

  it('should return empty email error message for valid email', () => {
    component.clientForm.get('email')?.setValue('test@example.com');
    component.clientForm.get('email')?.markAsTouched();

    const error = component.emailError;
    expect(error).toBe('');
  });

  it('should include template in form data when submitting', fakeAsync(() => {
    component.clientForm.patchValue({
      first_name: 'John',
      last_name: 'Doe',
      phone: '79876543211',
      email: 'john.doe@example.com',
    });

    component.onSubmit();
    tick();

    expect(cardsService.createCard).toHaveBeenCalledWith(
      jasmine.objectContaining({
        template: 'Тестовый',
        first_name: 'John',
        last_name: 'Doe',
        phone: '79876543211',
        email: 'john.doe@example.com',
      })
    );
  }));

  it('should render modal when showModal is true', () => {
    component.showModal = true;
    fixture.detectChanges();

    const modal = fixture.nativeElement.querySelector('.modal-overlay');
    expect(modal).toBeTruthy();
  });

  it('should not render modal when showModal is false', () => {
    component.showModal = false;
    fixture.detectChanges();

    const modal = fixture.nativeElement.querySelector('.modal-overlay');
    expect(modal).toBeFalsy();
  });
});
