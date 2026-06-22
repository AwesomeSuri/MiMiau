import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { catchError, Observable, of, tap } from 'rxjs';

export interface CatType {
  id: number;
  name: string;
  image: string;
  spriteSheet: string;
  facts: string[];
}

@Injectable({
  providedIn: 'root',
})
export class CatsCatalog {
  private http = inject(HttpClient);
  private apiUrl = `${environment.phpApiUrl}/game/cats_catalog.php`;

  private catalogSignal = signal<CatType[]>([]);
  public catalog = this.catalogSignal.asReadonly();

  public fetchCatalog(): Observable<CatType[]> {
    return this.http.get<CatType[]>(this.apiUrl).pipe(
      tap((data) => {
        this.catalogSignal.set(data);
      }),
      catchError((error) => {
        console.error("Failed to stream cat catalog from PHP microservice:", error);
        return of([]);
      })
    )
  }
}
