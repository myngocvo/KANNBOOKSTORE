import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BillsService {

  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }
  getbill() {
    return this.http.get<any>(`${this.apiUrl}Bills/orderNotSuccess`)
  }
  getBillStatus(customerId: string, status: string): Observable<any> {
    const url = `${this.apiUrl}Bills/customer/${customerId}/status/${encodeURIComponent(status)}`;
    return this.http.get<any>(url);
  }
  getbillSuccess() {
    return this.http.get<any>(`${this.apiUrl}Bills/orderSuccess`)
  }
  postBill(bill: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}Bills`, bill);
  }
  updateBillStatus(billId: string, status: string) {
    const url = `${this.apiUrl}Bills/${encodeURIComponent(billId)}/${encodeURIComponent(status)}`;
    const body = { status: status };
    return this.http.put(url, body )
  }
  updateBillStatusPayment(billId: string, statuspayment:string) {
    const url = `${this.apiUrl}Bills/update/${encodeURIComponent(billId)}/${encodeURIComponent(statuspayment)}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(url,{ headers: headers })
  }
  getdetailsbill(billId: string) {
    const url = `${this.apiUrl}Bills/withorderbill/${encodeURIComponent(billId)}`;
    return this.http.get(url)
  }
}