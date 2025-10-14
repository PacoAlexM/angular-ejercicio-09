import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'non-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private _authStatus = signal<AuthStatus>('checking');
    private _user = signal<User|null>(null);
    private _token = signal<string|null>(null);

    private http = inject(HttpClient);

    authStatus = computed<AuthStatus>(() => {
        if (this._authStatus() === 'checking') return 'checking';

        if (this._user()) return 'authenticated';

        return 'non-authenticated';
    });

    user = computed(() => this._user());

    token = computed(this._token);

    login(email: string, password: string): Observable<boolean> {
        return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, { email, password }).pipe(
            tap(res => {
                this._user.set(res.user);
                this._authStatus.set('authenticated');
                this._token.set(res.token);

                localStorage.setItem('token', res.token);
            }),
            map(res => true),
            catchError((error: any) => {
                this._user.set(null);
                this._authStatus.set('non-authenticated');
                this._token.set(null);

                return of(false);
            })
        );
    }
}
