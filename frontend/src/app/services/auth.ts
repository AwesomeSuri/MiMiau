import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthResponse {
  message: string;
}

export interface LoginResponse extends AuthResponse {
  token: string;
  userId: number;
}

export interface SendVerificationCodeResponse extends AuthResponse {
  verificationToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private apiUrl = environment.phpApiUrl;

  currentUserToken = signal<string | null>(localStorage.getItem("mimiau_jwt"));
  currentUserId = signal<number | null>(Number(localStorage.getItem("mimiau_user_id")) || null);

  private getAuthUrl(path: string): string {
    return this.apiUrl + "/auth" + path;
  }

  register(username: string, email: string, password: string, verificationCode: string, verificationToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.getAuthUrl("/register.php"),
      { username, email, password, verificationCode, verificationToken });
  }

  sendVerificationCode(email: string): Observable<SendVerificationCodeResponse> {
    return this.http.post<SendVerificationCodeResponse>(this.getAuthUrl("/send_verification_code.php"), { email });
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.getAuthUrl("/login.php"), { email, password }).pipe(
      tap((response: LoginResponse) => {
        localStorage.setItem("mimiau_jwt", response.token);
        localStorage.setItem("mimiau_user_id", String(response.userId));

        this.currentUserToken.set(response.token);
        this.currentUserId.set(response.userId);
      })
    )
  }

  requestPasswordReset(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.getAuthUrl("/request_reset.php"), { email });
  }

  resetPassword(token: string, newPassword: string): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(this.getAuthUrl("/execute_reset.php"), { token, newPassword });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(this.getAuthUrl("/change_password.php"), { currentPassword, newPassword });
  }

  logout(): Observable<AuthResponse> {
    localStorage.removeItem('mimiau_jwt');
    localStorage.removeItem('mimiau_user_id');

    this.currentUserToken.set(null);
    this.currentUserId.set(null);

    return this.http.post<AuthResponse>(this.getAuthUrl("/logout.php"), {});
  }

  deleteAccount(password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.getAuthUrl("/delete_account.php"), { body: { password } });
  }

  getUsername(): string {
    const token = localStorage.getItem('mimiau_jwt');
    if (!token) return 'Guest';

    try {
      const payloadPart = token.split('.')[1];

      const decodedPayload = atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/'));

      const userObject = JSON.parse(decodedPayload);

      return userObject.username || 'Cat Parent';
    } catch (error) {
      console.error("Failed parsing identity token structures", error);
      return 'Cat Parent';
    }
  }
}
