import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private baseUrl=environment.baseUrl;
  constructor(private http: HttpClient, private router: Router) {
   }
  Categories() {
    return this.http.get<any>(`${this.baseUrl}Categories`)
  }
   // GET category by ID
  CategoryId(id: string) {
    return this.http.get<any>(`${this.baseUrl}Categories/${id}`)
  }

  createCategory(categoryData: any) {
    return this.http.post(`${this.baseUrl}Categories`, categoryData)
  }

  updateCategory(id: string, updatedData: any){
    return this.http.put(`${this.baseUrl}Categories/${id}`, updatedData)

  }

  // DELETE category
  deleteCategory(id: string) {
    return this.http.delete(`${this.baseUrl}Categories/${id}`)
  }

  deleteCategoryrById(categoryId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}Categories/${categoryId}`);
  }
}
