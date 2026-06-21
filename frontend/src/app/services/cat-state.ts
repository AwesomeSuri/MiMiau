import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CatState {
  private apiUrl = environment.apiUrl;
  
  private catsSignal = signal<any[]>([]);
  private gachaCatSignal = signal<any | null>(null);

  public cats = this.catsSignal.asReadonly();
  public gachaCat = this.gachaCatSignal.asReadonly();

  public catCount = computed(() => this.catsSignal().length);

  constructor(private http: HttpClient){}

  private getUrl(path: string): string {
    return this.apiUrl + path
  }

  fetchMyCats() {
    this.http.get<any[]>(this.getUrl("/my-cats")).subscribe({
      next: (cats) => this.catsSignal.set(cats),
      error: (err) => console.error("Could not load cats ", err)
    })
  }

  claimCat() {
    this.http.post<any>(this.getUrl("/claim-cat"), {}).subscribe({
      next: (res) => {
        this.gachaCatSignal.set(res.cat);
        this.catsSignal.update((currentCats) => [...currentCats, res.cat]);
      },
      error: (err) => {
        console.error('Error claiming cat:', err);
      }
    });
  }

  clearState() {
    this.catsSignal.set([]);
  }
}
