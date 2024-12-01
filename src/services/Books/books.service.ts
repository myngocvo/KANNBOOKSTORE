import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from "@angular/common/http";
import { Router } from '@angular/router';
import {BookDetailsViewModel} from 'src/interfaces/fullbook';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient, private router: Router) {
  }
//get 3 bảng book theo thể loại
  getBookdetailsByCategory(categoryId: string, page: number | null = null, pageSize: number | null = null) {
    const url = `${this.baseUrl}Books/details/books?categoryId=${categoryId}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<any>(url);
  }
  //get theo id 3 bảng book
  getBookDetailsWithImagesid(bookId: string) {

    const url = `${this.baseUrl}Books/details/images/${bookId}`;
    return this.http.get<BookDetailsViewModel>(url);
  }
  //get gop 3 bảng book lại với nhau
  getBookDetailImages() {
    const url = `${this.baseUrl}Books/details/images`;
    return this.http.get<BookDetailsViewModel[]>(url);
  }
  // get những sách có số sao là 5
  getBookoutstanding(page: number | null = null, pageSize: number | null = null):Observable<any>  {
    const url = `${this.baseUrl}ProductReviews/outstanding?page=${page}&pageSize=${pageSize}`;
    return this.http.get<any>(url);
  }
  //get tất cả sách và lượng sao được preview
  getBookHavePreView(page: number | null = null, pageSize: number | null = null):Observable<any>  {
    const url = `${this.baseUrl}ProductReviews/GetBookReview?page=${page}&pageSize=${pageSize}`;
    return this.http.get<any>(url);
  }
  // // gọi bảng book
  // Books() {
  //   return this.http.get<any>(`${this.baseUrl}Books`)
  // }
  // gọi theo id bảng book
  // BooksId(id: string) {
  //   return this.http.get<any>(`${this.baseUrl}Books/${id}`);
  // }
  // Thêm mới sách

  postBook(bookData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}Books`, bookData);
  }
// sửa sách
updateBook(formData: FormData): Observable<any> {
  return this.http.put<any>(`${this.baseUrl}Books`, formData);
}
  // Xóa sách theo id
  deleteBookById(id: string){
    return this.http.delete<any>(`${this.baseUrl}Books/${id}`);
  }

  countBook() {
    return this.http.get<any>(`${this.baseUrl}Books/count`);
  }
}
