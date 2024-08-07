import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommanService } from '../../Services/comman.service';
import { AuthService } from '../../Services/Auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import MuiDialogService from './../../Services/MuiDialog.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdminService } from '../../Services/Admin.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers:[AdminService,AuthService]
})
export class LoginComponent {

  login!: FormGroup;
  submitted = false;
  private token: string | null = null;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  errorMessage:any="";

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private dialog: MuiDialogService
  ) { 

    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();

  }

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
      // this.authService.login(this.login.value).subscribe({
      //   next: (res: any) => {
      //     if(res && res.status){
      //       console.log(res.token,"userID");
      //       localStorage.setItem("user_id",res.data.uniq_id);
      //       this.dialog.openSnackBar({ message:'Login successfully completed.', title: 'Login Done'}, 'Success');
      //       localStorage.setItem("loginsession","true");

      //       sessionStorage.setItem('currentUser', JSON.stringify(res.data.uniq_id));
      //       this.currentUserSubject.next(res.data.uniq_id);

      //      this.setToken(res.token)


      //       if(this.login.value.email=='admin@gmail.com'){
      //         this.router.navigate(['/admin']);
      //       }else{
      //         this.router.navigate(['/home']);
      //       }
      //       this.authService.markUnTouchedAndReset(this.login);
      //     }else{
      //       this.dialog.openSnackBar({ message:'Login failed. Please try again.', title: 'Login failed'}, 'Error');
      //     }
      //   }, error: (err: any) => {
      //     this.dialog.openSnackBar({ message:'Login failed. Please try again.', title: 'Login failed'}, 'Error');
      //   }
      // });

      this.authService.login(this.login.value).subscribe({
        next: (res: any) => {
          if(res && res.status){
          
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
  


  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

}
