import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  Authors(): Observable<any> {


    return this.http.get<any>(`${this.baseUrl}Authors`);
  }

  AddAuthor(authorData: FormData): Observable<any> {


    return this.http.post<any>(`${this.baseUrl}Authors`, authorData);
  }

  deleteAuthorById(authorId: string): Observable<any> {

    return this.http.delete<any>(`${this.baseUrl}Authors/${authorId}`);
  }
}
