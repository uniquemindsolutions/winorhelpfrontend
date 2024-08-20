import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../Services/Admin.service';
import MuiDialogService from '../../Services/MuiDialog.service';
import { AuthService } from '../../Services/Auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
  providers:[AdminService,AuthService]
})
export class ForgotPasswordComponent {

  forgotPasswordForm: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient,private admin:AdminService, private router: Router,
    private dialog: MuiDialogService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
     
      this.admin.forgot_password(this.forgotPasswordForm.value).subscribe({
        next: (res: any) => {
          if(res && res.status){

            if(res.status=="error"){
              this.dialog.openSnackBar({ message:'Invalid details', title: 'Forgot Password'}, 'Error');
            }else{

              this.message = res.message;
              this.dialog.openSnackBar({ message:'Successfully Sent Mail Please Reset Your Password', title: 'Forgot Password'}, 'Success');
              setTimeout(() => {
                this.router.navigate(['/auth/login']);
                //window.location.reload();
                 }, 3000);

            }
           

          }else{
            this.dialog.openSnackBar({ message:'Invalid details', title: 'Forgot Password'}, 'Error');
          }
        }, error: (err: any) => {
          this.dialog.openSnackBar({ message:'Invalid details.', title: 'Forgot Password'}, 'Error');
        }
       
      });


    }
  }
}
