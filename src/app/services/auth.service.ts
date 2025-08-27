import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isAuthenticated = signal(false);
  isAuthenticated = this._isAuthenticated.asReadonly(); // это наружу для чтения, чтобы не хранить например в локалсторе и читать из него 
  // плюс инкапсулирую и делаю неизменяемый Signal
  private _token = signal<string | null>(null);
  token = this._token.asReadonly(); // та же причина, но можно организовать хранение в куках, локалсторе и др.

  constructor(private http: HttpClient) {}

  login(login: string, password: string): Observable<{ auth_token: string }> {
    return this.http.post<{ auth_token: string }>(
      '/api/test-auth-only',
      { login, password }
    ).pipe(
      tap(res => {
        console.log("response: ", res)
        console.log("token: ", res.auth_token)
        this._token.set(res.auth_token);
        this._isAuthenticated.set(true);
      })
    );
  }

  logout() {
    this._token.set(null);
    this._isAuthenticated.set(false);
  }
}
