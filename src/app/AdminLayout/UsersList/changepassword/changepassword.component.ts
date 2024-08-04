import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminService } from '../../../Services/Admin.service';
import MuiDialogService from '../../../Services/MuiDialog.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-changepassword',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './changepassword.component.html',
  styleUrl: './changepassword.component.css'
})
export class ChangepasswordComponent {
  userForm!: FormGroup;
  submitted:boolean = false;
  readonly dialogRef = inject(MatDialogRef<ChangepasswordComponent>);
  constructor(private fb: FormBuilder, private admin: AdminService, private dialog: MuiDialogService,
    @Inject(MAT_DIALOG_DATA) public data: {user_id: string}
  ) {

  }
  ngOnInit() {
    this.userForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.userForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.userForm.invalid) {
      //this.authService.markFormGroupTouched(this.userForm);
      //alert('Registration Failed!');
      return;
    } else {
      this.submitted = false;
      const formValuesJson = JSON.stringify(this.userForm.value);
      const payload={
        "user_id":this.data.user_id,
        "password":this.userForm.value.password
      }
      console.log("payload",payload);
      this.admin.changepassword(payload).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            this.dialog.openSnackBar({ message: 'Password changed Successfully.', title: 'Password Done' }, 'Success');
            this.dialogRef.close();
          } else {
            this.dialog.openSnackBar({ message: 'Password changed Fail', title: 'Password changed Fail' }, 'Error');
          }
        },
        error: (err: any) => {
          this.dialog.openSnackBar({ message: 'Password changed Fail', title: 'Password changed Fail' }, 'Error');
        }
      });
    }


  }
  

}
