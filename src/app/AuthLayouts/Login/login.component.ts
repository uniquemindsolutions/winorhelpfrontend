import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommanService } from '../../Services/comman.service';
import { AuthService } from '../../Services/Auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import MuiDialogService from './../../Services/MuiDialog.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  login!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private dialog: MuiDialogService
  ) { }

  ngOnInit() {
    localStorage.setItem("user_id","");
    localStorage.setItem("loginsession", "false");
    this.login = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],

    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.login.controls;
  }


  onSubmit(): void {
    this.submitted = true;
    if (this.login.valid) {
      this.submitted = false;
      console.log(this.login.value)
      this.authService.login(this.login.value).subscribe({
        next: (res: any) => {
          if(res && res.status){
            console.log(res,"userID");
            localStorage.setItem("user_id",res.data.id);
            this.dialog.openSnackBar({ message:'Login successfully completed.', title: 'Login Done'}, 'Success');
            localStorage.setItem("loginsession","true");
            if(this.login.value.email=='admin@gmail.com'){
              this.router.navigate(['/admin']);
            }else{
              this.router.navigate(['/home']);
            }
           
            this.authService.markUnTouchedAndReset(this.login);
          }else{
            this.dialog.openSnackBar({ message:'Login failed. Please try again.', title: 'Login failed'}, 'Error');
          }
        }, error: (err: any) => {
          this.dialog.openSnackBar({ message:'Login failed. Please try again.', title: 'Login failed'}, 'Error');
        }
      });
    } else {
     this.authService.markFormGroupTouched(this.login);
    }
  }

}
