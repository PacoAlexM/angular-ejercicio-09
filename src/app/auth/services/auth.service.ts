import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
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
    private _token = signal<string|null>(localStorage.getItem('token'));

    private http = inject(HttpClient);

    authStatus = computed<AuthStatus>(() => {
        if (this._authStatus() === 'checking') return 'checking';

        if (this._user()) return 'authenticated';

        return 'non-authenticated';
    });

    checkStatusResource = rxResource({
        stream: () => this.checkAuthStatus()
    });

    user = computed(() => this._user());

    token = computed(this._token);

    isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false);

    private handleAuthSuccess ({ token, user }: AuthResponse) {
        this._user.set(user);
        this._authStatus.set('authenticated');
        this._token.set(token);

        localStorage.setItem('token', token);

        return true;
    }

    private handleAuthError(error: any) {
        this.logout();
        return of(false);
    }

    login(email: string, password: string): Observable<boolean> {
        return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, { email, password }).pipe(
            map(res => this.handleAuthSuccess(res)),
            catchError((error: any) => this.handleAuthError(error))
        );
    }

    checkAuthStatus(): Observable<boolean> {
        const token = localStorage.getItem('token');

        if (!token) {
            this.logout();
            return of(false);
        }

        return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`, {
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // }
        }).pipe(
            map(res => this.handleAuthSuccess(res)),
            catchError((error: any) => this.handleAuthError(error))
        );
    }

    logout() {
        this._user.set(null);
        this._token.set(null);
        this._authStatus.set('non-authenticated');

        localStorage.removeItem('token');
    }

    register(fullName: string, email: string, password: string): Observable<boolean> {
        return this.http.post<AuthResponse>(`${baseUrl}/auth/register`, { fullName, email, password }).pipe(
            map(res => this.handleAuthSuccess(res)),
            catchError((error: any) => this.handleAuthError(error))
        );
    }
}
