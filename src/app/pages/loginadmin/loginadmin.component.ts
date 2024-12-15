import { Component } from '@angular/core';
import { UsersService } from 'src/services/Users/users.service';
import { Router } from '@angular/router';
import { OtpService } from 'src/services/otp/otp.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-loginadmin',
  templateUrl: './loginadmin.component.html',
  styleUrls: ['./loginadmin.component.css'],
})
export class LoginadminComponent {
  constructor(
    private usersService: UsersService,
    private router: Router,
    private otpService: OtpService,
    private snackBar: MatSnackBar
  ) {}
  showInputPassword: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  DataLogin: any = {};
  DataForget: any = {};
  otpSent: boolean = false;
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  otpVerified: boolean = false;

  toggleInputPasswordVisibility(): void {
    this.showInputPassword = !this.showInputPassword;
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  login() {
    this.otpService.validateEmail(this.DataForget.email).subscribe({
      next: (res) => {
        this.usersService
          .signIn(this.DataLogin.email, this.DataLogin.password)
          .subscribe({
            next: (res) => {
              this.snackBar.open('Đăng nhập thành công', 'Đóng', {
                duration: 3000,
              });
              this.router.navigate(['books']);
            },
            error: (err) => {
              console.log('Đăng nhập thất bại', err);
              this.snackBar.open(
                'Đăng nhập thất bại. Kiểm tra lại tài khoản và mật khẩu',
                'Đóng',
                {
                  duration: 3000,
                }
              );
            },
          });
      },
      error: (err) => {
        console.log('Đăng nhập không thành công', err);
        this.snackBar.open(
          'Đăng nhập thất bại. Kiểm tra lại tài khoản và mật khẩu',
          'Đóng',
          {
            duration: 3000,
          }
        );
      },
    });
  }

  sendOtp(): void {
    this.otpService.validateEmail(this.DataForget.email).subscribe({
      next: () => {
        this.usersService.sendOtpEmail(this.DataForget.email).subscribe({
          next: (response) => {
            this.snackBar.open(
              'Đã gửi mã xác nhận. Vui lòng kiểm tra mail của bạn',
              'Đóng',
              {
                duration: 3000,
              }
            );
            this.otpSent = true;
          },
          error: (err) => {
            console.error('Error sending OTP email:', err);
            this.snackBar.open(
              'Đã xảy ra lỗi. Vui lòng kiểm tra lại email vừa nhập',
              'Đóng',
              {
                duration: 3000,
              }
            );
          },
        });
      },
      error: (err) => {
        this.snackBar.open(
          'Đã xảy ra lỗi. Vui lòng kiểm tra lại email vừa nhập',
          'Đóng',
          {
            duration: 3000,
          }
        );
      },
    });
  }

  verifyOtp(): void {
    if (this.otp.length === 6) {
      this.usersService.verifyOtp(this.DataForget.email, this.otp).subscribe({
        next: () => {
          this.otpSent = false;
          this.otpVerified = true;
        },
        error: (err) => {
          console.error('Error verifying OTP:', err);
          this.snackBar.open('Mã xác nhận không hợp lệ', 'Đóng', {
            duration: 3000,
          });
          this.otp = '';
        },
      });
    }
  }

  onOtpChange(otp: string) {
    this.otp = otp;
    if (otp.length === 6) {
      this.verifyOtp();
    }
  }

  resetPassword(): void {
    if (this.newPassword === this.confirmPassword) {
      this.usersService
        .updatePassword(this.DataForget.email, this.newPassword)
        .subscribe({
          next: () => {
            this.snackBar.open('Thay đổi mật khẩu thành công', 'Đóng', {
              duration: 3000,
            });
            this.otpVerified = false;
            const chkBox = document.getElementById('chk') as HTMLInputElement;
            if (chkBox) {
              chkBox.checked = false;
            }
          },
          error: (err) => {
            console.error('Mã xác nhận xảy ra lỗi', err);
          },
        });
    } else {
      this.snackBar.open('Mật khẩu không khớp', 'Đóng', {
        duration: 3000,
      });
    }
  }

  resetForm(): void {
    this.otpSent = false;
    this.otpVerified = false;
    this.DataForget = {};
    this.newPassword = '';
    this.confirmPassword = '';
  }
}
