import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from '../../Services/Admin.service';
import MuiDialogService from '../../Services/MuiDialog.service';
import { AuthService } from '../../Services/Auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
  providers:[AdminService,AuthService]
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  message: string = '';
  token: any;

  constructor(private fb: FormBuilder, private http: HttpClient,private admin:AdminService, private router: Router, private route: ActivatedRoute,
    private dialog: MuiDialogService
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // this.token = decodeURIComponent(this.route.snapshot.queryParams['token']);
    // console.log("payload",this.token);

    // const decodedUrl = decodeURIComponent(window.location.href);
    
    // // Step 2: Manually extract the token
    // const tokenMatch = decodedUrl.match(/token\s*=\s*(.+)$/);
    // if (tokenMatch && tokenMatch[1]) {
    //   this.token = tokenMatch[1].trim();  // Extracts the token value
    // } else {
    //   this.token = 'Token not found';
    // }

    const decodedUrl = decodeURIComponent(window.location.href);
    console.log("payload22",decodedUrl);

const params = decodedUrl.replace(/\s+/g, '');
   
const url = new URL(params);

// Get the query parameters from the URL
const paramsnew = new URLSearchParams(url.search);

// Extract the 'token' parameter
this.token = paramsnew.get('token');

    
    
  }

  onSubmit() {
    //alert(this.resetPasswordForm.valid);
    if (this.resetPasswordForm.valid) {
     
      const payload={
        "token":this.token,
        "password":this.resetPasswordForm.value.password
      }
      console.log("payload",payload);
      this.admin.resetPassword(payload).subscribe({
        next: (res: any) => {
          if(res && res.status){
            if(res.status=="error"){
              this.dialog.openSnackBar({ message:'Invalid Token or expired token', title: 'Reset Password'}, 'Error');
            }else{
              this.message = res.message;
              this.dialog.openSnackBar({ message:'Password Reset Successfully Please login ', title: 'Forgot Password'}, 'Success');
              
              setTimeout(() => {
                this.router.navigate(['/auth/login']);
                  }, 3000);

            }
         
          }else{
            this.dialog.openSnackBar({ message:'Invalid Token or expired token', title: 'Reset Password'}, 'Error');
          }
        }, error: (err: any) => {
          this.dialog.openSnackBar({ message:'Invalid Token or expired token', title: 'Reset Password'}, 'Error');
        }
       
      });
    }
  }
}
