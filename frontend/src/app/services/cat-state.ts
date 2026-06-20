import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CatState {
  private apiUrl = environment.apiUrl;
  
  private catsSignal = signal<any[]>([]);

  public cats = this.catsSignal.asReadonly();

  public catCount = computed(() => this.catsSignal().length);

  constructor(private http: HttpClient){}

  fetchMyCats() {
    const headers = new HttpHeaders().set("sessionid", localStorage.getItem("sessionId") || "");
    this.http.get<any[]>(`${this.apiUrl}/my-cats`, { headers }).subscribe({
      next: (cats) => this.catsSignal.set(cats),
      error: (err) => console.error("Could not load cats ", err)
    })
  }

  addCat(newCat: any){
    this.catsSignal.update((currentCats) => [...currentCats, newCat]);
  }

  clearState() {
    this.catsSignal.set([]);
  }
}
