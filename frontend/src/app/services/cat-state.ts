import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CatState {
  private apiUrl = environment.nodeApiUrl;
  
  public cats = signal<any[]>([]);
  public gachaCat = signal<any | null>(null);
  public selectedCat = signal<any | null>(null)

  public catCount = computed(() => this.cats().length);

  constructor(private http: HttpClient){}

  private getUrl(path: string): string {
    return this.apiUrl + path
  }

  fetchMyCats() {
    // this.http.get<any[]>(this.getUrl("/my-cats")).subscribe({
    //   next: (cats) => this.cats.set(cats),
    //   error: (err) => console.error("Could not load cats ", err)
    // })
  }

  claimCat() {
    this.http.get<any>(this.getUrl("/claim-cat")).subscribe({
      next: (res) => {
        this.gachaCat.set(res.cat);
        this.cats.update((currentCats) => [...currentCats, res.cat]);
      },
      error: (err) => {
        console.error('Error claiming cat:', err);
      }
    });
  }
}
