import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CustomerService } from 'src/services/customer/customer.service';
import { CustomermainService } from 'src/services/customermain/customermain.service';
import { Customer } from 'src/interfaces/Customer';
import { Router } from '@angular/router';
import { OrdersService } from 'src/services/Orders/orders.service';
import { ShoppingCartItem } from 'src/interfaces/Orders';
import { CloudConfig, Cloudinary, CloudinaryImage, URLConfig } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { UploadService } from 'src/services/Users/upload.service';
import { BillsService } from 'src/services/Bills/bills.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CartsService } from 'src/services/Carts/carts.service';
import { ProductViewService } from 'src/services/ProductView/product-view.service';
import { ProductReviewBookid } from 'src/interfaces/ProductView';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, map } from 'rxjs';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;

  Dataupdatepassword: any = {};
  currentPage: string = 'hoSo';
  getCustomer: Customer | null = null;
  idcustomer: string = '';
  gender: string = '';
  phone: string = '';
  photo!: string;
  address: string = '';
  blameaddress: any = {};
  selectedDate: Date = new Date();
  shopingCart: ShoppingCartItem[] = []
  totalcart: number = 0;
  productId: string | null = null;
  averageRating: number = 0;
  commemtrating: { rating?: number, comment?: string } = {};
  productViewinterface: ProductReviewBookid[] = [];
  isReviewed: string = '';
  active = 1;
  private commentStatusSubject = new BehaviorSubject<{ [bookId: string]: boolean }>({});
  commentStatus$: Observable<{ [bookId: string]: boolean }> = this.commentStatusSubject.asObservable();
  showPage(pageName: string) {
    if (pageName === 'donHang') {
      this.StatusBill('Chờ Xác Nhận')
    }
    this.currentPage = pageName;
  }
  selectedMenuItem: string = 'hoSo';
  selectMenuItem(itemName: string) {
    this.selectedMenuItem = itemName;
    if (itemName == 'dangxuat') {
      this.openConfirmDialog()
    }
  }
  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private customer: CustomerService,
    private customerMain: CustomermainService,
    private router: Router,
    private ordersservice: OrdersService,
    private cartsService: CartsService,
    private upload: UploadService,
    private billService: BillsService,
    private productView: ProductViewService,
    private modalService: NgbModal,
  ) {
    const savedImageSrc = localStorage.getItem('userImageSrc');
    if (savedImageSrc) {
      this.userImageSrc = savedImageSrc;
    }
    this.getCustomerID()
    this.CartShoping()
  }
  idUser!: string;
  img!: CloudinaryImage;
  publicIdPost!: string;
  imgFromUser!: CloudinaryImage;
  cloudName = "dpk9xllkq";
  uploadPreset = "angular_app";
  userImageSrc!: string;
  file!: File | null;
  getCustomerID() {
    this.blameaddress = {
      t:  '',
      h: '',
      x:  '',
      ap:  ''
    };
    this.idcustomer = this.customer.getClaimValue();
    this.customerMain.CustomersId(this.idcustomer).subscribe
      ({
        next: (res) => {
          this.getCustomer = res
          this.idUser = res.id
          this.gender = res.gender;
          this.phone = res.phone;
          this.photo = res.photo;
          if(this.getCustomer)
            {
              this.getCustomer.birthday?.setDate(res.birthday+1)
            }
          if (res.address === null||res.address==='string') {
            this.blameaddress.t = "Nhập tỉnh";
            this.blameaddress.h = 'Nhập huyện';
            this.blameaddress.x = 'Nhập xã'
            this.blameaddress.ap = 'Nhập Ấp';
          } else {
            this.blameaddress = extractAddressInfo(res.address)
          }
         
          const cloudConfig = new CloudConfig({ cloudName: 'dpk9xllkq' });
          const urlConfig = new URLConfig({ secure: true });
          console.log(this.photo)
          this.img = new CloudinaryImage(this.photo, cloudConfig, urlConfig);
          this.img.resize(fill().height(70).width(70))
        },
        error: (err) => {
          console.error('Lỗi lấy dữ liệu ', err);
        },
      })
  }

  ngOnInit() {

  }
  atedBookIds: Set<number> = new Set<number>();  // Mảng để lưu trữ các bookId đã được đánh giá
  ratedBookIds: Set<number> = new Set<number>(); // Sử dụng Set thay vì Array

  loadCommentsStatus() {
    this.productView.getProductReviewsByCustomerId(this.idcustomer).subscribe({
      next: (res) => {
        for (let i of res) {
          this.ratedBookIds.add(i.bookId); // Thêm bookId vào Set ratedBookIds
        }
      },
      error: (err) => {
        console.error('Lỗi khi lấy đánh giá:', err);
      }
    });
  }

  checkIdbook(ArraybookId: any[]): boolean {
    for (let i of ArraybookId) {
      if (this.ratedBookIds.has(i.bookId)) {
        return true; // Trả về true nếu tìm thấy bookId trong ratedBookIds
      }
    }
    return false; // Trả về false nếu không tìm thấy bất kỳ bookId nào trong ratedBookIds
  }


  getOrdersByStatus(status: number): ShoppingCartItem[] {
    return this.shopingCart.filter(item => item.status === status);
  }
  Updatepass() {
    const dataupdate = {
      id: this.getCustomer?.id,
      fullName: this.getCustomer?.fullName,
      photo: this.getCustomer?.photo,
      activated: true,
      password: this.Dataupdatepassword.password,
      email: this.getCustomer?.email,
      gender: this.gender,
      address: this.getCustomer?.address,
      birthday: this.getCustomer?.birthday,
    }
    const password = this.Dataupdatepassword.passwordODL;
    if (this.Dataupdatepassword.password == this.Dataupdatepassword.passwordconfirm) {
      this.customer.updatepass(this.phone, password).subscribe
        ({
          next: (res) => {
            this.idcustomer = this.customer.getClaimValue();
            console.log(dataupdate);
            this.customer.update(this.idcustomer, dataupdate).subscribe({
              next: (res) => {
                this.snackBar.open('Thay đổi mật khẩu thành công', 'Đóng', {
                  duration: 3000,
                });
              },
              error: (err) => {
                console.error('Lỗi thay đổi dữ liệu ', err);
              },
            });
          },
          error: (err) => {
            console.error('Mật khẩu không đúng ', err);
          },
        })
    }
    else {
      this.snackBar.open(' Mật khẩu không khớp ', 'Đóng', {
        duration: 3000,
      });
    }
  }
  Address() {
    this.idcustomer = this.customer.getClaimValue();
    this.updateAddress()
    const dataupdate = {
      id: this.idcustomer,
      fullName: this.getCustomer?.fullName,
      photo: this.getCustomer?.photo,
      activated: true,
      password: this.getCustomer?.password,
      email: this.getCustomer?.email,
      gender: this.gender,
      address: this.fulladdress,
      birthday: this.getCustomer?.birthday,
      phone: this.getCustomer?.phone
    }
    this.customerMain.updateCustomer(this.idcustomer, dataupdate).subscribe(
      {
        next: (res) => {
          this.getCustomerID()
          this.snackBar.open(' Lưu địa chỉ thành công ', 'Đóng', {
            duration: 3000,
          });
        },
        error: (err) => {
          this.snackBar.open(' Lỗi thay đổi dữ liệu  ', 'Đóng', {
            duration: 4000,
          });
        },
      }
    )
  }
  updateprofile() {
    //công thêm 1 ngày
    if (this.getCustomer?.birthday) {
      const originalDate = new Date(this.getCustomer.birthday);
      originalDate.setDate(originalDate.getDate()+1);
      this.getCustomer.birthday = originalDate;
    }
    this.idcustomer = this.customer.getClaimValue();
    const dataupdate = {
      id: this.idcustomer,
      fullName: this.getCustomer?.fullName,
      photo: this.getCustomer?.photo,
      activated: true,
      password: this.getCustomer?.password,
      email: this.getCustomer?.email,
      gender: this.gender,
      address: this.getCustomer?.address,
      birthday: this.getCustomer?.birthday,
      phone: this.getCustomer?.phone
    }
    this.customerMain.updateCustomer(this.idcustomer, dataupdate).subscribe(
      {
        next: (res) => {
          this.snackBar.open(' Lưu hồ sơ thành công ', 'Đóng', {
            duration: 3000,
          });
          window.location.reload()
        },
        error: (err) => {
          this.snackBar.open(' Lỗi thay lưu dữ liệu ', 'Đóng', {
            duration: 4000,
          });
        },
      }
    )
  }

  CartShoping() {
    this.ordersservice.getHistoryOrders(this.idcustomer).subscribe(
      {
        next: (res) => {
          this.shopingCart = res;

          this.shopingCart.forEach(element => {
            for (let i = 0; i < element.image0.length; i++) {
              this.totalcart += element.price[i] * element.quantity[i];
            }
          });
        },
        error: (err) => {
          console.log(err);
        },
      }
    );
    this.totalcart += 20000
  }
  onDateChange(event: any) {
    this.selectedDate = event.value +1;
    console.log('Selected Date:', this.selectedDate);
  }
  //------------Đăng xuẩt------------------------
  checkconfirm = false;
  checkkind = '';
  isNameConfirm = 'Thông báo xác nhận';
  isMessage = '';
  openConfirmDialog() {
    const dialogRef = this.dialog.open(this.confirmDialog, {
      width: '300px',
    });
    console.log(this.checkkind)
    if (this.checkkind == '') {
      this.isMessage = 'Bạn có chắc chắn muốn đăng xuất không?'
    }
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onConfirm();
      } else {
        this.checkconfirm = false;
      }
    });
  }

  onConfirm() {
    this.dialog.closeAll();
    if (this.checkkind != '') {
      this.billService.updateBillStatus(this.checkkind, 'Đã hủy').subscribe({
        next: (res: any) => {
          this.StatusBill('Chờ Xác Nhận');
          this.snackBar.open('Đơn hàng đã được hủy thành công!', 'Đóng', {
            duration: 3000,
          });
        },
        error: (err: any) => {
          console.error('Lỗi khi hủy đơn hàng:', err);
          this.snackBar.open('Có lỗi xảy ra khi hủy đơn hàng!', 'Đóng', {
            duration: 4000,
          })
        }
      });
    }
    else {
      this.logout();
    }

  }
  cancelOrder(billId: string) {
    this.checkkind = billId
    this.isMessage = 'Bạn có chắc chắn muốn hủy đơn không?'
    this.openConfirmDialog()

  }
  onCancel(): void {
    this.dialog.closeAll();
    this.checkkind = '';
  }
  logout() {
    localStorage.removeItem('access_token');
    this.isMessage = 'Bạn có chắc chắn muốn đăng xuất không?'
    this.snackBar.open(' Đăng xuất thành công ', 'Đóng', {
      duration: 3000,
    });
    this.router.navigate(['home'])
  }
  // ---------------Đánh giá-------------------
  open(content: any) {
    this.idcustomer = this.customer.getClaimValue();
    this.modalService.open(content);
  }
  bookComment: any;

  portratingcomment(bill: any) { 
    bill.orderDetails.forEach((detail: any) => {
      const dataProductView =
      {
        id: detail.bookId + this.idcustomer,
        customerId: this.idcustomer,
        bookId: detail.bookId,
        rating: this.commemtrating.rating || 5,
        comment: this.commemtrating.comment || '',
        ngayCommemt: new Date().toISOString(),
      }
      console.log(dataProductView)
      this.productView.addProductReview(dataProductView).subscribe({
        next: (res) => {
          this.snackBar.open(' Cảm ơn bạn đã đánh giá ', 'Đóng', {
            duration: 3000,
          });
        },
        error: (err) => {
          this.snackBar.open(' Bạn đã đánh giá sản phẩm này ', 'Đóng', {
            duration: 3000,
          });

        },
      });

    });
  }
  onRatingChange(selectedRating: number) {
    this.commemtrating.rating = selectedRating;
  }

  // ---------------Hủy đơn--------------------
  reorder(bill: any) {
    // Đếm số lượng các sản phẩm cần xử lý
    let productsProcessed = 0;
    const totalProducts = bill.orderDetails.length;

    bill.orderDetails.forEach((detail: any) => {
      const cart = {
        id: detail.bookId + this.idcustomer,
        bookId: detail.bookId,
        customerId: this.idcustomer,
      };
      this.cartsService.addCarts(cart).subscribe({
        next: (res: any) => {
          productsProcessed++;
          if (productsProcessed === totalProducts) {
            this.router.navigate(['/cart']);
          }
        },
        error: (err: any) => {
          console.error('Error adding product to cart', err);
        }
      });
    });
  }
  // ------------------------------------------

  selectImage(): void {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  async onSelect(event: any): Promise<void> {
    const inputFile = event.target as HTMLInputElement;
    if (inputFile && inputFile.files && inputFile.files.length > 0) {
      this.file = inputFile.files[0];
      console.log('Tên của tệp đã chọn:', this.file);
      const data = new FormData();
      data.append('file', this.file);
      data.append('upload_preset', 'angular_app');
      data.append('cloud_name', 'dpk9xllkq');

      this.upload.uploadImage(data).subscribe({
        next: (res: any) => {
          this.publicIdPost = res.public_id;

          if (this.publicIdPost) {
            const customerUpdateData = {
              id: this.getCustomer?.id,
              fullName: this.getCustomer?.fullName,
              photo: this.publicIdPost,
              activated: true,
              password: this.getCustomer?.password,
              email: this.getCustomer?.email,
              gender: this.getCustomer?.gender,
              address: this.getCustomer?.address,
              birthday: this.getCustomer?.birthday,
              phone: this.getCustomer?.phone
            };

            console.log(customerUpdateData);
            this.customerMain.updateCustomer(this.idUser, customerUpdateData).subscribe({
              next: () => {
                window.location.reload();
                this.snackBar.open('Upload ảnh thành công!', 'Đóng', {
                  duration: 3000,
                });
              },
              error: (err: any) => {
                console.error("Lỗi khi cập nhật dữ liệu:", err);
              }
            });
          }
        },
        error: (err: any) => {
          console.error("Lỗi khi upload ảnh:", err);
        }
      });
    }
  }

  //Địa chỉ
  city: string = '';
  district: string = '';
  ward: string = '';
  apt: string = '';
  detailedAddress: string = '';
  disableAddressFields: boolean = false;
  fulladdress: string = '';
  updateAddress() {
    this.detailedAddress = `${', ' + '' + this.blameaddress.x ? this.blameaddress.x + ', ' : ''}${this.blameaddress.h ? this.blameaddress.h + ', ' : ''}${this.blameaddress.t}`;
    this.fulladdress = `${this.apt ? this.apt + ', ' : ''}${this.blameaddress.x ? this.blameaddress.x + ', ' : ''}${this.blameaddress.h ? this.blameaddress.h + ', ' : ''}${this.blameaddress.t || ''}`;
    this.disableAddressFields = this.detailedAddress.trim() !== ''; // Kiểm tra xem có địa chỉ chi tiết không để vô hiệu hóa trường
    console.log(this.fulladdress)
  }

  bills: any = [];

  StatusBill(status: string) {
    this.checkkind = ''
    this.bills = []
    this.billService.getBillStatus(this.idcustomer, status).subscribe({
      next: (res: any[]) => {
        this.bills = res;
        this.sortBills();
        this.loadCommentsStatus()
      },
      error: (err: any) => {
        console.error("Lỗi khi cập nhật dữ liệu:", err);
      }
    });
  }
  sortBills() {
    this.bills.sort((a: any, b: any) => {
      if (a.billDate && b.billDate) {
        return new Date(b.billDate).getTime() - new Date(a.billDate).getTime();
      }
      return 0;
    });
  }
 
  
}
function extractAddressInfo(fullAddress: string): { x: string; h: string; t: string } | null {
  const addressParts = fullAddress.split(',').map(part => part.trim());

  if (addressParts.length < 3) {
    return null;
  }

  const [x, h, t] = addressParts;

  return {
    x: x || '',
    h: h || '',
    t: t || ''
  };
}



