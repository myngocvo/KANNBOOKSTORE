import { Component } from '@angular/core';
import { User } from 'src/interfaces/User';
import { UsersService } from 'src/services/Users/users.service';

@Component({
  selector: 'app-staff-admin',
  templateUrl: './staff-admin.component.html',
  styleUrls: ['./staff-admin.component.css'],
})
export class StaffAdminComponent {
  constructor(private users: UsersService) {}

  Users: User[] = [];
  filteredUsers: User[] = [];
  user: any = {};

  selectAllChecked = false; // Biến để theo dõi trạng thái chọn tất cả
  selectedStaff: any[] = []; // Mảng để lưu trữ trạng thái chọn của từng sách

  ngOnInit() {
    this.users.Users().subscribe({
      next: (res) => {
        this.Users = res;
        this.loadpro(null);
      },
      error: (err) => {
        console.log('Lỗi lấy dữ liệu: ', err);
      },
    });
  }
  assets: any;

  isDeleteModalVisible = false;

  loadpro(searchTerm: string | null) {
    if (searchTerm && searchTerm.trim() !== '') {
      this.filteredUsers = this.Users.filter((user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      this.filteredUsers = this.Users.slice(0, 25);
    }
    console.log(this.filteredUsers);
  }

  selectAll(event: any) {
    this.selectAllChecked = event.checked;

    if (this.selectAllChecked) {
      this.selectedStaff = [...this.filteredUsers];
    } else {
      this.selectedStaff = [];
    }
  }

  selectStaff(event: any, staff: any) {
    if (event.checked) {
      this.selectedStaff.push(staff);
    } else {
      this.selectedStaff = this.selectedStaff.filter(
        (selected) => selected.id !== staff.id
      );
    }
    this.updateSelectAllState();
  }

  updateSelectAllState() {
    const selectedCount = this.selectedStaff.length;
    const totalCount = this.filteredUsers.length;

    this.selectAllChecked = selectedCount === totalCount && totalCount > 0;
  }

  // Hàm xóa sách
  deleteStaff(cmt: any) {
    console.log('Deleting staff:');
  }
  // Hiển thị modal xác nhận xóa
  openDeleteModal() {
    this.isDeleteModalVisible = true;
  }

  // Đóng modal xác nhận xóa
  closeDeleteModal() {
    this.isDeleteModalVisible = false;
  }

  isAddStaffModalVisible = false;

  // Hiển thị modal add
  openAddStaffModal() {
    this.isAddStaffModalVisible = true;
  }

  // Đóng modal add
  closeAddtStaffModal() {
    this.isAddStaffModalVisible = false;
  }
}
