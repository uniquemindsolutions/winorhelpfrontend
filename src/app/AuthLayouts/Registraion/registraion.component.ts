import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { CommanService } from './../../Services/comman.service';
import { AuthService } from './../../Services/Auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import MuiDialogService from './../../Services/MuiDialog.service';

@Component({
  selector: 'app-registraion',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,HttpClientModule],
  templateUrl: './registraion.component.html',
  styleUrl: './registraion.component.css'
})
export class RegistraionComponent implements OnInit {

  registrationForm!: FormGroup;
  submitted = false;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authService:AuthService,
      private dialog: MuiDialogService
  ) { }

  ngOnInit() {
      this.registrationForm = this.formBuilder.group({
         username: ['', [Validators.required, Validators.minLength(3)]],
         password: ['', [Validators.required, Validators.minLength(6)]],
         email: ['', [Validators.required, Validators.email]],
         phone: ['', Validators.required],
         ref_code:''
      });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }

  onSubmit(): void {
   
    this.submitted = true;

    if (this.registrationForm.invalid) {
      console.log(this.registrationForm)
      //alert('Registration Failed!');
      return;
    }else{
      this.submitted = false;
      console.log(this.registrationForm.value)
      
      const formValuesJson = JSON.stringify(this.registrationForm.value);
      this.authService.register(this.registrationForm.value).subscribe({
        next:(res:any) => {
          if(res.status==true){
            this.dialog.openSnackBar({ message:'Registration successfully completed.', title: 'Registration Done'}, 'Success');
            this.router.navigate(['/auth/login']);
          }else{
            this.dialog.openSnackBar({ message:'Sorry, Email id Already Exist', title: 'Registration Failed!'}, 'Error');
          }
        },
        error:(err:any) => {
          this.dialog.openSnackBar('Sorry, Email id Already Exist', 'Error');
        }
      });
    }


  }
}
