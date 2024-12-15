import { Component, Renderer2, ElementRef } from '@angular/core';
import { ProductViewService } from 'src/services/ProductView/product-view.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent {
  page = 1;
  sizepage = 7;
  View: any = {};
  datacommentfull: any[] = [];
  datacomment: any[] = [];
  loadpageReviewCount: number = 0;
  isDeleteModalVisible = false;
  selectedComments: any[] = [];
  selectAllChecked = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private Comment: ProductViewService
  ) {
    this.LoadComment(1);
    this.LoadCommentful();
  }

  LoadComment(page: number) {
    this.Comment.getProductReviews(page, this.sizepage).subscribe({
      next: (res: any) => {
        this.loadpageReviewCount = res.totalCount;
        this.datacomment = res.data;
      },
      error: (err) => {
        // Handle error
      },
    });
  }
  LoadCommentful() {
    this.Comment.getAllProductReviews().subscribe({
      next: (res: any) => {
        this.datacommentfull = res.data;
      },
      error: (err) => {
        // Handle error
      },
    });
  }
  searchResults: any[] = [];
  loadpro(title: string) {
    this.LoadCommentful();
    const search = this.el.nativeElement.querySelector('#searchview');
    const begin = this.el.nativeElement.querySelector('#Viewfirst');
    this.renderer.setStyle(begin, 'display', 'none');
    this.renderer.setStyle(search, 'display', 'block');
    if (!title) {
      this.searchResults = this.datacommentfull;
      this.renderer.setStyle(begin, 'display', 'block');
      this.renderer.setStyle(search, 'display', 'none');
      return;
    }
    const searchTerm = title.toLowerCase();
    this.searchResults = this.datacommentfull.filter((View) =>
      View.title.toLowerCase().includes(searchTerm)
    );
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.LoadComment(this.page);
  }

  selectAll(checked: boolean) {
    if (checked) {
      this.selectedComments = [...this.datacomment]; // Chọn tất cả các bình luận
    } else {
      this.selectedComments = []; // Bỏ chọn tất cả
    }
  }

  selectComment(checked: boolean, comment: any) {
    if (checked) {
      this.selectedComments.push(comment);
    } else {
      this.selectedComments = this.selectedComments.filter(
        (cmt) => cmt.id !== comment.id
      );
    }
  }

  isSelected(comment: any): boolean {
    return this.selectedComments.some((cmt) => cmt.id === comment.id);
  }

  isSelectAllChecked(): boolean {
    return (
      this.selectedComments.length === this.datacomment.length &&
      this.datacomment.length > 0
    );
  }
  isIndeterminate(): boolean {
    return (
      this.selectedComments.length > 0 &&
      this.selectedComments.length < this.datacomment.length
    );
  }

  deleteSelectedComments() {
    if (this.selectedComments.length === 0) {
      return;
    }

    this.selectedComments.forEach((comment) => {
      this.Comment.deleteProductReview(comment.id).subscribe({
        next: () => {},
        error: (err) => {
          console.error('Lỗi khi xóa bình luận:', err);
        },
        complete: () => {
          alert('Đã xóa các comment thành công');
        },
      });
    });

    this.selectedComments = [];
    this.LoadComment(this.page);
  }
  // Hiển thị modal xác nhận xóa
  openDeleteModal() {
    this.isDeleteModalVisible = true;
  }

  // Đóng modal xác nhận xóa
  closeDeleteModal() {
    this.isDeleteModalVisible = false;
    this.LoadComment(this.page);
  }
}
