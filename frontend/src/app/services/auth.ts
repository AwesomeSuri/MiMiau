import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient){}

  register(userData: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if(response.userId && response.sessionId){
          localStorage.setItem("userId", response.userId.toString());
          localStorage.setItem("sessionId", response.sessionId);
        }
      })
    )
  }

  getUserId(): string | null {
    return localStorage.getItem("userId");
  }

  getSessionId(): string | null {
    return localStorage.getItem("sessionId");
  }

  logout(): Observable<any> {
    const headers = {
      "userid": this.getUserId() || "",
      "sessionid": this.getSessionId() || ""
    };

    return this.http.post(`${this.apiUrl}/logout`, {}, {headers}).pipe(
      tap(()=> {
        localStorage.clear();
      })
    )
  }
}
