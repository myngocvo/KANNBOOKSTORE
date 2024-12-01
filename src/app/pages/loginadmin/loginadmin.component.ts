import { Component } from '@angular/core';
import { UsersService } from 'src/services/Users/users.service';
import { Router } from '@angular/router';
import { OtpService } from 'src/services/otp/otp.service';
@Component({
  selector: 'app-loginadmin',
  templateUrl: './loginadmin.component.html',
  styleUrls: ['./loginadmin.component.css']
})
export class LoginadminComponent {

  constructor(
    private usersService: UsersService,
    private router: Router,
    private otpService: OtpService
  ) { }
  showInputPassword: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  message: string = '';
  login_message='';
  DataLogin: any = {};
  DataForget: any = {};
  otpSent: boolean = false;
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  otpVerified: boolean = false;

  toggleInputPasswordVisibility(): void{
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
        this.usersService.signIn(this.DataLogin.email, this.DataLogin.password).subscribe(
          {
            next: (res) => {
              this.router.navigate(['books']);
          
            },
            error: (err) => {
              console.log("Đăng nhập không thành công", err);
              this.login_message='Đăng nhập thất bại. Kiểm tra lại tài khoản và mật khẩu';
            }
          }
        );
      },
      error: (err) => {
        console.log("Đăng nhập không thành công", err);
        this.login_message='Đăng nhập thất bại. Kiểm tra lại tài khoản và mật khẩu';
      }
    })

  }

  sendOtp(): void {
    this.otpService.validateEmail(this.DataForget.email).subscribe({
      next:() =>{
        this.usersService.sendOtpEmail(this.DataForget.email).subscribe({
          next: (response) => {
            this.message = `Đã gửi mã xác nhận. Vui lòng kiểm tra mail của bạn`;
            this.otpSent = true;
          },
          error: (err) => {
            console.error('Error sending OTP email:', err);
            this.message = 'Đã xảy ra lỗi. Vui lòng kiểm tra lại email vừa nhập';
          }
        });
      },
      error: (err) => {
        this.message = 'Đã xảy ra lỗi. Vui lòng kiểm tra lại email vừa nhập';
      }
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
          this.message = 'Mã xác nhận không hợp lệ';
          this.otp='';
        }
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
      this.usersService.updatePassword(this.DataForget.email, this.newPassword).subscribe({
        next: () => {
          this.message = 'Thay đổi mật khẩu thành công';
          this.otpVerified = false;
          const chkBox = document.getElementById('chk') as HTMLInputElement;
          if (chkBox) {
            chkBox.checked = false;
          }
        },
        error: (err) => {
          console.error('Mã xác nhận xảy ra lỗi', err);
        }
      });
    } else {
      this.message = 'Mật khẩu không khớp';
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
