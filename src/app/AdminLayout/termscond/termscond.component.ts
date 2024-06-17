import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import MuiDialogService from '../../Services/MuiDialog.service';
import { AdminService } from '../../Services/Admin.service';
import { QuillModule } from 'ngx-quill';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-termscond',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule,
    ReactiveFormsModule,
    QuillModule,
    CommonModule
  ],
  templateUrl: './termscond.component.html',
  styleUrl: './termscond.component.css'
})
export class TermscondComponent {
  termForm: FormGroup;
  dataSource:any;
  // readonly dialogRef = inject(MatDialogRef<TermscondComponent>);
  constructor(private fb: FormBuilder,  private muiDialog: MuiDialogService,  private api:AdminService) {
    this.termForm = this.fb.group({
      content: ['']
    });
}

// onSubmit() {
//   console.log(this.termForm.value);
// }

ngOnInit(){
  this.gettermsCondition();
 }

 onEditorContentChange(event: any) {
  this.termForm.get('content')?.setValue(event.html, { emitEvent: false });
}

 gettermsCondition(){
  this.api.getTerms().subscribe({
    next:(res:any) => {
      console.log(res.data[0].content, 'resultTerms');
      
      // this.dataSource=res.data[0].content;
      this.termForm.get('content')?.setValue(res.data[0].content);
    },
    error: (err: any) => {

    }
  })
 }

onSubmit() {
  if (this.termForm.valid) {
    this.api.updateTerms(this.termForm.value).subscribe({
      next: (any) => {
        alert("successfully updated");
        // this.muiDialog.openSnackBar({ title: 'Success!', message: 'Room Created Successfully' }, 'Success')
        // this.dialogRef.close();
      },
      error: (err: any) => {

      }
    })
  } else {
    console.log('Form is not valid');
  }
}

}
