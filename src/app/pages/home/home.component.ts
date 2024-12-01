import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { bookhome } from '../../../interfaces/bookhome';
import { Router } from '@angular/router';
import { bookimg } from '../../../interfaces/bookimg';
import { Author } from '../../../interfaces/Author';
import { BooksService } from 'src/services/Books/books.service';
import { BookImgsService } from 'src/services/BookImgs/bookimgs.service';
import { AuthorsService } from 'src/services/Authors/authors.service';
import { BookDetailsViewModel } from 'src/interfaces/fullbook';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  images =
    [
      'assets/banner/vuidentruong.jpg',
      'assets/banner/childrenbook.jpg',
      'assets/banner/manga.jpg',
    ]
  constructor(private http: HttpClient,
    private router: Router,private meta: Meta,
    private title: Title,
    private books: BooksService) { }
  Books: bookhome[] = [];
  img: bookimg[] = [];
  author: Author | null = null;
  pageSize = 5;
  page = 1;
  bookfull: BookDetailsViewModel[] = [];
  booksuggest: BookDetailsViewModel[] = [];
  lenghtBook: number = 0;
  loadedBooksCount: number = 0;
  ngOnInit() {
    this.updateIndexHtmlMetaTags()
    this.getProductDetailsoutstanding(this.page, this.pageSize)
    this.getProductsuggest()
  }
  getProductDetailsoutstanding(page: number, pageSize: number): void {
    this.books.getBookoutstanding(page, pageSize).subscribe({
      next: (res) => {
        this.bookfull = res.data
        this.lenghtBook = res.totalCount
      },
      error: (err) => {
      },
    });
  }
  updateIndexHtmlMetaTags(): void {
    // Tạo mảng các thẻ meta
    const metaTags = [
      { name: 'robots', content: 'INDEX,FOLLOW' },
      { name: 'keywords', content: 'sách, mua sách trực tuyến, sách văn học, sách tiểu thuyết, sách mới nhất, giảm giá sách, bookstore, KANN' },
      {
        name: 'description',
        content: 'Mua sách trực tuyến với giá tốt nhất, đa dạng thể loại sách từ văn học, tiểu thuyết, đến sách học thuật và sách thiếu nhi. Cập nhật hàng ngày những đầu sách mới nhất.'
      }
    ];

    // Cập nhật các thẻ meta trong index.html
    metaTags.forEach(tag => {
      this.meta.updateTag(tag);
    });
  }
  getProductsuggest(): void {
    this.books.getBookHavePreView(1, this.pageSize).subscribe({
      next: (res) => {
        this.booksuggest = res.data
      },
      error: (err) => {
      },
    });
  }

  //-------------------------------thay đôi số page khi chuyển trang
  onPageChange(newPage: number): void {
    this.page = newPage;
    this.getProductDetailsoutstanding(this.page, this.pageSize)
  }

}
