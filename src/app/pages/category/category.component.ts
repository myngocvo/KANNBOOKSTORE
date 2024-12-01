import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { bookhome } from 'src/interfaces/bookhome';
import { bookimg } from 'src/interfaces/bookimg';
import { Author } from 'src/interfaces/Author';
import { Category } from 'src/interfaces/Category';
import { Router } from '@angular/router';
import { BookDetail } from 'src/interfaces/bookdetail';
import { BooksService } from 'src/services/Books/books.service';
import { BookDetailsViewModel } from 'src/interfaces/fullbook';
import { AuthorsService } from 'src/services/Authors/authors.service';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  constructor(private http: HttpClient,
  private route: ActivatedRoute,
  private router: Router,
  private book: BooksService,
  private authorService:AuthorsService) { }
  pageSize = 8;
  page = 1;
  booksPagination: BookDetailsViewModel[] = [];
  dt: bookhome[] = [];
  img: bookimg[] = [];
  booksall: BookDetailsViewModel[] = [];
  bookCatergory: BookDetailsViewModel[] = [];
  author: Author[] = [];
  bookdetail: BookDetail[] = [];
  categoryname: string | null = null;
  backupData: BookDetailsViewModel[] = [];
  uniqueAuthorIds: string[] = [];
  Category: Category[] = [];
  caId: string | null = null;
  loadedBooksCount: number = 0;
  sortOptionprice: string = "0";
  Optionprice: string = "";
  OptionAuthor: string = "";
  arrayAuthor: Map<string, string> = new Map();
  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('id') || '';
    // Make a GET request to fetch book data
    if (categoryId) {
      this.caId = categoryId;
      this.loadBooks(1);
      this.authorService.Authors().subscribe(
        {
          next: response => {
            this.author = response;
          },
          error: error => {
            console.error('Lỗi khi lấy dữ liệu tác giả', error);
          }
        }
      );
    }
  }
  // truyền id sách qua trang chi tiết
  navigateToProduct(productId: string, productName: string) {
    const sanitizedProductName = productName.replace(/\s+/g, '-');
    this.router.navigate(['product', sanitizedProductName], { state: { productId: productId } });
  }

  sortProducts(sortOption: string) {
    this.OptionAuthor = "";
    this.Optionprice = "";
    if (sortOption === '1') {
      this.booksPagination.sort((a, b) => a.unitPrice - b.unitPrice);
    } else
      if (sortOption === '2') {
        this.booksall.sort((a, b) => b.unitPrice - a.unitPrice);
      }
  }
  getPriceRangeValues(priceRange: string): [number, number] {
    switch (priceRange) {
      case '1':
        return [0, 100000]; // Range 0 - 100,000
      case '2':
        return [100000, 200000]; // Range 100,000 - 200,000
      case '3':
        return [200000, 300000]; // Range 200,000 - 300,000
      default:
        return [0, 0]; // Default range, can be modified based on requirement
    }
  }
  filterProductsByPrice(priceRange: string | "") {
    this.OptionAuthor = "";
    if (priceRange === "") {
      this.booksPagination = this.backupData;
      return;
    } else {
      const [minPrice, maxPrice] = this.getPriceRangeValues(priceRange);
      this.booksPagination = this.backupData.filter(product => {
        return product.unitPrice >= minPrice && product.unitPrice <= maxPrice;
      });
    }

  }

  extractUniqueAuthorIds() {
    let authorIds = null;
    authorIds = this.booksPagination.map(product => product.authorId);
    if (authorIds !== null) {
      this.uniqueAuthorIds = Array.from(new Set(authorIds));
    }
  }
  //Lọc theo tác giả
  filterProductsByAuthor(authorId: string | "") {
    this.sortOptionprice = "0";
    this.Optionprice = "";
    if (authorId !== '') {
      this.booksPagination = this.backupData.filter(product => product.authorId === authorId);
      return;
    } else {
      this.booksPagination = this.backupData
    }
  }

  //load sách theo id người chọn có phần trang
  loadBooks(page: number): void {
    if (this.caId) {
      this.book.getBookdetailsByCategory(this.caId, page, this.pageSize)
        .subscribe({
          next: (response) => {
            if (response && response.data && Array.isArray(response.data)) {
              this.booksPagination = response.data;
              this.loadedBooksCount = response.totalCount
              this.backupData = this.booksPagination,
                this.extractUniqueAuthorIds(),
                this.categoryname = response.data[0].categoryName
              this.booksPagination.forEach((book, index) => {
                const authorId = book.authorId;
                const authorName = book.authorName;
                this.arrayAuthor.set(authorId, authorName);
              });


            }
          },
          error: (error: any) => { // Explicitly type 'error'
            console.error('Error loading books:', error);
          }
        });
    }
  }

  // tính tiền của sách với phần trăm giảm
  percent1(price: number, per: number): number {
    return price * (1 - per);
  }
  // Đổi phần trăm cho tỉ lệ giảm
  percent2(per: number) {
    return '-' + per * 100 + '%';
  }
  // thay đổi trang/chuyển trang
  onPageChange(newPage: number): void {
    this.page = newPage;
    this.arrayAuthor = new Map<string, string>();
    this.loadBooks(this.page);
    this.sortOptionprice = "0";
    this.Optionprice = "";
    this.OptionAuthor = "";

  }
}
