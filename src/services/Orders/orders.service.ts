import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private baseUrl=environment.baseUrl;
  constructor(private http: HttpClient, private router: Router) {
   }

   updateOrderStatus(customerId: string, description: string) {
    const encodedDescription = encodeURIComponent(description);
    const url = `${this.baseUrl}Orders/update-status/${customerId}/${encodedDescription}`;
    return this.http.put<any>(url, null);
  }

  getOrders(status:number) {
    return this.http.get<any[]>(`${this.baseUrl}Orders?status=${status}`)
  }
  postOrder(order:any) {
    return this.http.post(`${this.baseUrl}Orders`, order);
  }
  getHistoryOrders(id :string) {
    return this.http.get<any[]>(`${this.baseUrl}Orders/History/${id}`)
  }
}
