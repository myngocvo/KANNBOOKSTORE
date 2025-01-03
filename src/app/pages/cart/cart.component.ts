import { Renderer2, ElementRef, Component } from '@angular/core';
import { CartsService } from 'src/services/Carts/carts.service';
import { CustomerService } from 'src/services/customer/customer.service';
import { Cart } from 'src/interfaces/Carts';
import { BookDetailsViewModel } from 'src/interfaces/fullbook';
import { BooksService } from 'src/services/Books/books.service';
import { SharedataService } from 'src/services/sharedata/sharedata.service';
import { forkJoin } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  quantity: { [key: string]: number } = {};
  idcustomer: string = '';
  Cartinterface: Cart[] = [];
  checkCart: boolean = false;
  books: BookDetailsViewModel[] = [];
  isChecked: { [key: string]: boolean } = {};
  productsPrice: { [id: string]: number } = {};
  checkedProductIds: string[] = [];
  totalProduct: number = 0;
  totalmoney: number = 0;
  selectAllChecked: boolean = false;
  constructor(
    private router: Router,
    private sharedata: SharedataService,
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    private cartService: CartsService,
    private customer: CustomerService,
    private bookservice: BooksService,
    private renderer: Renderer2,
    private title: Title,
    private snackBar: MatSnackBar
  ) {
    this.title.setTitle('Giỏ hàng');
    this.idcustomer = this.customer.getClaimValue();
    this.refreshCartData();
  }

  checkCartdisplay(check: boolean, idBooks: string[]): void {
    if (check) {
      const bookObservables = idBooks.map((id) =>
        this.bookservice.getBookDetailsWithImagesid(id)
      );
      forkJoin(bookObservables).subscribe({
        next: (results) => {
          this.books = results;
          results.forEach((book) => {
            // Layays giá tiền của sách
            if (!this.productsPrice.hasOwnProperty(book.bookId)) {
              this.productsPrice[book.bookId] =
                (1 - book.pricePercent) * book.unitPrice;
            }
          });
        },
        error: (er) => {
          console.log('Lỗi lấy dữ liệu');
        },
      });
      const Cart = this.el.nativeElement.querySelector('#cart');
      this.renderer.setStyle(Cart, 'display', 'block');
      const CartNone = this.el.nativeElement.querySelector('#cartnone');
      this.renderer.setStyle(CartNone, 'display', 'none');
    }
  }
  //xóa cart
  deletecart(idbook: string) {
    this.idcustomer = this.customer.getClaimValue();
    this.cartService.deleteCartsById(idbook + this.idcustomer).subscribe({
      next: (results) => {
        this.totalProduct = 0;
        this.totalmoney = 0;
        this.isChecked[idbook] = false;
        this.deleteProductPrice(idbook);
        this.deleteCheckedProductIds(idbook);
        this.checkchooseproduct();
        this.Cartinterface = this.Cartinterface.filter(
          (item) => item.bookId !== idbook
        );
        if (this.Cartinterface.length === 0) {
          this.checkCart = false;
        }
        this.refreshCartData();
      },
      error: (er) => {
        console.log('Lỗi xóa dữ liệu');
      },
    });
  }
  //xóa phần tư ra khỏi chuỗi
  deleteProductPrice(id: string): void {
    if (this.productsPrice.hasOwnProperty(id)) {
      delete this.productsPrice[id];
    }
  }
  deleteCheckedProductIds(id: string): void {
    const index = this.checkedProductIds.indexOf(id);

    if (index !== -1) {
      this.checkedProductIds.splice(index, 1);
    }
  }
  refreshCartData(): void {
    this.cartService.CartsIdCustomer(this.idcustomer).subscribe({
      next: (res) => {
        this.Cartinterface = res;
        this.checkCart = res.length > 0;
        const idBooksArray: string[] = res.map(
          (cartItem: Cart) => cartItem.bookId
        );
        this.checkCartdisplay(this.checkCart, idBooksArray);
      },
      error: (er) => {
        this.checkCart = false;
        const Cart = this.el.nativeElement.querySelector('#cart');
        this.renderer.setStyle(Cart, 'display', 'none');
        const CartNone = this.el.nativeElement.querySelector('#cartnone');
        this.renderer.setStyle(CartNone, 'display', 'flex');
      },
    });
  }

  // Other methods...
  updateQuantity(bookId: string, newQuantity: number): void {
    this.quantity[bookId] = this.quantity[bookId] = parseInt(
      newQuantity.toString(),
      10
    );
    this.totalProduct = 0;
    this.totalmoney = 0;
    console.log(this.quantity[bookId]);
    this.checkchooseproduct();
  }

  toggleCheckbox(event: any, bookId: string): void {
    this.isChecked[bookId] = event.checked;
    if (!event.checked) {
      this.selectAllChecked = false;
    } else {
      this.selectAllChecked = this.books.every(
        (book) => this.isChecked[book.bookId]
      );
    }
    this.cdr.detectChanges();
    this.totalProduct = 0;
    this.totalmoney = 0;
    this.checkedProductIds = Object.keys(this.isChecked).filter(
      (id) => this.isChecked[id]
    );
    this.checkchooseproduct();
    console.log(this.checkedProductIds);
  }
  checkchooseproduct() {
    if (this.checkedProductIds.length > 0) {
      for (let i of this.checkedProductIds) {
        if (this.quantity[i] == null) {
          this.quantity[i] = 1;
        }
        this.totalProduct += this.quantity[i];
        this.totalmoney += this.productsPrice[i] * this.quantity[i];
        console.log(this.totalmoney);
      }
    } else {
      this.totalProduct = 0;
      this.totalmoney = 0;
    }
  }
  percent1(price: number, per: number): number {
    return price * (1 - per);
  }

  BuyProduct() {
    if (this.checkedProductIds && this.checkedProductIds.length > 0) {
      // Tạo một khóa duy nhất (ví dụ sử dụng thời gian hiện tại)
      const uniqueKey = `payment_${new Date().getTime()}`;

      // Lưu trữ dữ liệu vào sessionStorage
      sessionStorage.setItem(
        `${uniqueKey}_checkedProductIds`,
        JSON.stringify(this.checkedProductIds)
      );
      sessionStorage.setItem(
        `${uniqueKey}_productsPrice`,
        JSON.stringify(this.productsPrice)
      );
      sessionStorage.setItem(
        `${uniqueKey}_quantity`,
        JSON.stringify(this.quantity)
      );
      this.router.navigate(['payment'], {
        queryParams: { sessionKey: uniqueKey },
      });
    } else {
      this.snackBar.open('Chọn sản phẩm để tiếp tục mua hàng!', 'Đóng', {
        duration: 1000,
      });
    }
  }
  updateSelectedProducts(): void {
    this.checkedProductIds = Object.keys(this.isChecked).filter(
      (id) => this.isChecked[id]
    );
    this.checkchooseproduct();
  }

  selectAll(event: any): void {
    this.selectAllChecked = event.checked;
    this.totalProduct = 0;
    this.totalmoney = 0;
    this.books.forEach((book) => {
      this.isChecked[book.bookId] = this.selectAllChecked;
      this.checkedProductIds = Object.keys(this.isChecked).filter(
        (id) => this.isChecked[id]
      );
    });
    this.checkchooseproduct();
    console.log(this.checkedProductIds);
  }
}
