import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../Services/Auth.service';
import MuiDialogService from '../../../Services/MuiDialog.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.css'
})
export class NewUserComponent {
  userForm!: FormGroup;
  submitted:boolean = false;
  readonly dialogRef = inject(MatDialogRef<NewUserComponent>);
  constructor(private fb: FormBuilder, private authService: AuthService, private dialog: MuiDialogService) {

  }

  ngOnInit() {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      ref_code: ''
    });
  }

  get f() {
    return this.userForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.userForm.invalid) {
      this.authService.markFormGroupTouched(this.userForm);
      //alert('Registration Failed!');
      return;
    } else {
      this.submitted = false;
      const formValuesJson = JSON.stringify(this.userForm.value);
      this.authService.register(this.userForm.value).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            this.dialog.openSnackBar({ message: 'Registration successfully completed.', title: 'Registration Done' }, 'Success');
            this.dialogRef.close();
          } else {
            this.dialog.openSnackBar({ message: 'Sorry, Email id Already Exist', title: 'Registration Failed!' }, 'Error');
          }
        },
        error: (err: any) => {
          this.dialog.openSnackBar({ message: 'Sorry, Email id Already Exist', title: 'Registration Failed!' }, 'Error');
        }
      });
    }


  }
}
