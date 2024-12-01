import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { bookimg } from 'src/interfaces/bookimg';
import { environment } from 'src/app/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BookImgsService {

  private baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient, private router: Router) {
   }
  BookImg() {
    return this.http.get<any>(`${this.baseUrl}Bookimgs`)
  }
  BookImgId(id: string) {
    return this.http.get<any>(`${this.baseUrl}Bookimgs/${id}`);
  }
  addimage(book: any) {
    return this.http.post<bookimg>(`${this.baseUrl}Bookimgs`, book);
  }
}
