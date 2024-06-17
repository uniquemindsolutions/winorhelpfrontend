import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { QuillModule } from 'ngx-quill';
import MuiDialogService from '../../Services/MuiDialog.service';
import { AdminService } from '../../Services/Admin.service';

@Component({
  selector: 'app-privacypolicy',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule,
    ReactiveFormsModule,
    QuillModule,
    CommonModule
  ],
  templateUrl: './privacypolicy.component.html',
  styleUrl: './privacypolicy.component.css'
})
export class PrivacypolicyComponent {

  policy: FormGroup;
  dataSource:any;
  // readonly dialogRef = inject(MatDialogRef<TermscondComponent>);
  constructor(private fb: FormBuilder,  private muiDialog: MuiDialogService,  private api:AdminService) {
    this.policy = this.fb.group({
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
  this.policy.get('content')?.setValue(event.html, { emitEvent: false });
}

 gettermsCondition(){
  this.api.getPrivacy().subscribe({
    next:(res:any) => {
      console.log(res.data[0].content, 'resultTerms');
      
      // this.dataSource=res.data[0].content;
      this.policy.get('content')?.setValue(res.data[0].content);
    },
    error: (err: any) => {

    }
  })
 }

onSubmit() {
  if (this.policy.valid) {
    this.api.updatePrivacy(this.policy.value).subscribe({
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
