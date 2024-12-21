import { Component } from '@angular/core';
import { BillWithCustomer } from 'src/interfaces/Orders';
import { OrdersService } from 'src/services/Orders/orders.service';
import { SharedataService } from 'src/services/sharedata/sharedata.service';
import { Router } from '@angular/router';
import { BillsService } from 'src/services/Bills/bills.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-order-admin',
  templateUrl: './order-admin.component.html',
  styleUrls: ['./order-admin.component.css'],
  providers: [DatePipe],
})
export class OrderAdminComponent {
  orderData: BillWithCustomer[] = [];
  id: string = '';
  searchTerm: string = '';
  filteredOrderData: BillWithCustomer[] = [];
  constructor(
    private Order: OrdersService,
    private router: Router,
    private bill: BillsService
  ) {
    this.getbill();
  }

  getbill() {
    this.bill.getbill().subscribe({
      next: (res) => {
        this.orderData = res;
        this.filteredOrderData = [...this.orderData]; // Cập nhật danh sách ban đầu
      },
      error: (err) => {
        console.log('Lỗi lấy dữ liệu: ', err);
      },
    });
  }

  isModalApceptVisible = false;
  status?: string;
  statusPayment?: string;

  handlestatusChange(event: any, id: string) {
    const selectedValue = event.target.value;
    this.id = id;
    this.status = selectedValue;
    if (selectedValue) {
      this.openModalApcept();
    } else {
      this.isModalApceptVisible = false;
    }
  }
  handlepaymentstatusChange(id: string, event: any) {
    const selectElement = event.target as HTMLSelectElement;
    const statusPayment = selectElement.value;
    this.id = id;
    this.statusPayment = statusPayment;
    console.log(statusPayment);
    if (statusPayment != null) {
      this.openModalApcept();
    } else {
      this.isModalApceptVisible = false;
    }
  }
  searchOrders() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      // Nếu không có từ khóa, hiển thị toàn bộ danh sách
      this.filteredOrderData = [...this.orderData];
      return;
    }

    // Lọc dữ liệu với các điều kiện tìm kiếm
    this.filteredOrderData = this.orderData.filter((order) => {
      const id = order.id?.toLowerCase() || ''; // Xử lý trường hợp undefined/null
      const nameCustomer = order.nameCustomer?.toLowerCase() || '';
      const status = order.status?.toLowerCase() || '';

      return (
        id.includes(term) ||
        nameCustomer.includes(term) ||
        status.includes(term)
      );
    });
  }

  // Hiển thị modal
  openModalApcept() {
    this.isModalApceptVisible = true;
  }
  // Đóng modal
  closeModalApcept() {
    this.isModalApceptVisible = false;
  }
  sendId(id: string): void {
    this.router.navigate(['OrderDetail-admin', id]);
  }
  onUpdateSuccess() {
    this.status = undefined;
    this.statusPayment = undefined;
    console.log(this.status, this.statusPayment);
    this.getbill();
  }
}
