import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private _token = signal<string | null>(this.getStoredToken());

  login(login: string, password: string): Observable<{ auth_token: string }> {
    return this.http
      .post<{ auth_token: string }>('/api/test-auth-only', { login, password })
      .pipe(
        tap((res) => {
          const token = res.auth_token;
          this.setToken(token);
        })
      );
  }

  private setToken(token: string): void {
    this._token.set(token);
    localStorage.setItem('token', token);
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('token');
  }

  token(): string | null {
    return this._token();
  }

  logout(): void {
    this._token.set(null);
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }
}
