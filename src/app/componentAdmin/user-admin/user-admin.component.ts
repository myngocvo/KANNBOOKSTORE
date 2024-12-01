import { Component } from '@angular/core';
import { Customer } from 'src/interfaces/Customer';
import { CustomermainService } from 'src/services/customermain/customermain.service';
import { MailchimpService } from 'src/services/otp/otp.service'
@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.css']
})
export class UserAdminComponent {
  constructor(
    private customers: CustomermainService,
    private mailchimpService: MailchimpService
  ) {}
  Customers: Customer[]=[]
  filterdCustomers: Customer[]=[]
  customer: any = {}
  selectAllChecked = false; // Biến để theo dõi trạng thái chọn tất cả
  selectedCustomers: any[] = []; // Mảng để lưu trữ trạng thái chọn của từng sách
  idCustomerDelete: any;
  ngOnInit()
  {
    this.customers.Customers().subscribe({
      next: res => {
        this.Customers = res
        this.loadpro(null)
      },
      error: err => {
        console.log("Lỗi lấy dữ liệu: ", err)
      }
    });
  }

  loadpro(searchTerm: string | null) {
    if (searchTerm && searchTerm.trim() !== '') {
      // Filter the books based on the search term
      this.filterdCustomers = this.Customers.filter(cus =>
        cus.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      this.filterdCustomers = this.Customers.slice(0, 25); // Or simply assign this.filteredBooks = this.Books; for all books
    }
  }
  isDeleteModalVisible = false;

  selectAll(event: any) {
    this.selectAllChecked = event.target.checked; // Cập nhật trạng thái chọn tất cả
    if (this.selectAllChecked) {
      this.selectedCustomers = this.Customers.slice(0, 25);
    } else {
      this.selectedCustomers = [];
    }
  }

  selectCustomer(event: any, customer: any) {
    if (event.target.checked) {
      this.selectedCustomers.push(customer);
    } else {
      const index = this.selectedCustomers.findIndex((selectedCustomer) => selectedCustomer.id === customer.id);
      if (index !== -1) {
        this.selectedCustomers.splice(index, 1);
      }
    }
  }
  accountExports: any;
  getAccountExports() {
    this.mailchimpService.listAccountExports().subscribe({
      next: (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'account-exports.json';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: err => {
        console.error('Error:', err);
      }
    });
  }
  // Hàm xóa sách
  deleteUser(user: any) {
    console.log('Deleting user:', user);
  }

  // Hiển thị modal xác nhận xóa
  openDeleteModal(id: any) {
    this.idCustomerDelete = id;
    this.isDeleteModalVisible = true;
  }
  // Đóng modal xác nhận xóa
  closeDeleteModal() {
    this.isDeleteModalVisible = false;

  }
}
