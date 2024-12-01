import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CartsService {

  private baseUrl=environment.baseUrl;

  constructor(private http: HttpClient, private router: Router) {
  }
  Carts() {
    return this.http.get<any>(`${this.baseUrl}Carts`)
  }
  CartsIdCustomer(idcustomer: string) {
    return this.http.get<any>(`${this.baseUrl}Carts/${idcustomer}/Customer`);
  }
  // Thêm mới sách
  addCarts(carts: any) {
    return this.http.post<any>(`${this.baseUrl}Carts`, carts);
  }

  // Xóa sách theo id
  deleteCartsById(id: string){
    return this.http.delete<any>(`${this.baseUrl}Carts/${id}`);
  }
}
