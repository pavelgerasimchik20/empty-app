import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.formBuilder.group({
    login: ['', Validators.required],
    password: ['', Validators.required, Validators.minLength(8)]
  });

  onSubmit() {
    if (this.form.invalid) return;
    
    const { login, password } = this.form.value;

    this.auth.login(login!, password!).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => console.error('Auth error', err)
    });
  }
}
