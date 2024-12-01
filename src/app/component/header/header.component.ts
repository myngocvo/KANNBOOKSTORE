import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { bookimg } from 'src/interfaces/bookimg';
import { Router } from '@angular/router';
import { Author } from 'src/interfaces/Author';
import { Category } from 'src/interfaces/Category';
import { CustomerService } from 'src/services/customer/customer.service';
import { BookDetailsViewModel } from 'src/interfaces/fullbook'
import { CategoriesService } from 'src/services/Categories/categories.service';
import { BooksService } from 'src/services/Books/books.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  idcustomer: string | null = null;
  product: any = {}
  constructor(private http: HttpClient,
    private router: Router,
    private customer: CustomerService,
    private categoryService: CategoriesService,
    private serviceBook: BooksService) { }
  data: BookDetailsViewModel[] = [];
  bookImage: bookimg[] = [];
  author: Author | null = null;
  filteredProducts: BookDetailsViewModel[] = [];
  categories: Category[] = [];


  ngOnInit() {
    // Make a GET request to fetch book data
    this.categoryService.Categories().subscribe(
      {
        next: response => {
          if (response) {
            this.categories = response;
          }
        },
        error: error => {
          console.error('Lỗi xảy ra khi lấy dữ liệu thể loại', error);
        }
      });

  }

  statusLogin() {
    this.idcustomer = this.customer.getClaimValue();
    // Lấy token từ Local Storage
    const token = localStorage.getItem('access_token');
    // Kiểm tra xem token có tồn tại không
    if (token) {
      // Bạn có thể sử dụng giá trị token ở đây
      console.log('Token:', token);
      this.router.navigate(['user']);
    } else {
      this.isModalVisible = true;
      console.log(this.idcustomer);
    }
  }
  Cart() {
    this.idcustomer = this.customer.getClaimValue();
    // Lấy token từ Local Storage
    const token = localStorage.getItem('access_token');
    if (token) {
      this.router.navigate(['cart']);
    } else {
      alert('Vui lòng đăng nhập để xem giỏ hàng')
    }
  }
  loadpro(name: string): void {
    this.serviceBook.getBookDetailImages().subscribe({
      next: response => {
        if (response) {
          this.data = response;
        }
      },
      error: error => {
        console.error('Lỗi xảy ra khi lấy dữ liệu sách', error);
      }
    });
    if (name) {
      (document.querySelector(".dropdown") as HTMLElement).style.display = 'flex';
      this.filteredProducts = this.data.filter((product) =>
        product.title.toLowerCase().includes(name.toLowerCase())
      ).slice(0, 6);
    }
    else
      (document.querySelector(".dropdown") as HTMLElement).style.display = 'none';
  }
  isModalVisible = false;

  showLogin: boolean = false;

  isMapModalVisible = false;

  openMapModal() {
    this.isMapModalVisible = true;
  }

  closeMapModal() {
    this.isMapModalVisible = false;
  }

  navigateToProduct(productId: string, productName: string, quality: number) {
      const sanitizedProductName = productName.replace(/\s+/g, '-');
      const combined = `${sanitizedProductName}-${productId}`;
      this.router.navigate(['product', combined]);
  }
  navigateToCategory(categoryId: string) {

    this.router.navigate(['category', categoryId]).then(() => {
      location.reload();
    });
  }
  percent1(price: number, per: number): number {
    return price * (1 - per);
  }

}
