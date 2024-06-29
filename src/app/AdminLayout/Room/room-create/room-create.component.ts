import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthService } from './../../../Services/Auth.service';
import MuiDialogService from './../../../Services/MuiDialog.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AdminService } from '../../../Services/Admin.service';

@Component({
  selector: 'app-room-create',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './room-create.component.html',
  styleUrl: './room-create.component.css'
})
export class RoomCreateComponent {
  roomForm: FormGroup;
  readonly dialogRef = inject(MatDialogRef<RoomCreateComponent>);
  constructor(private fb: FormBuilder, private authService: AuthService, private muiDialog: MuiDialogService,  private api:AdminService) {
    this.roomForm = this.fb.group({
      entryFee: ['', [Validators.required, Validators.min(1)]],
      // totalParticipants: ['', [Validators.required, Validators.min(1)]],
      // winningAmount: ['', [Validators.required, Validators.min(1)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      lotteryDate: ['', [Validators.required]],
      lotteryTime: ['', [Validators.required]],
      winingPercentageInfo: this.fb.array([]),
      bgcolor: ['', [Validators.required]],
      
    });
    this.addItem(null);
  }


  get winingPercentageInfo(): FormArray {
    return this.roomForm.get('winingPercentageInfo') as FormArray;
  }

  addItem(val:any): void {
    this.winingPercentageInfo.push(this.fb.group({
      winAmountPer:[(val ? val.winAmountPer :''), [Validators.required]],
      deductAmountPer:[(val ? val.deductAmountPer :''), [Validators.required]]
    }));
  }

  removeItem(index: number): void {
    this.winingPercentageInfo.removeAt(index);
  }

  onSubmit() {
    if (this.roomForm.valid) {
      this.api.createRoom(this.roomForm.value).subscribe({
        next: (any) => {
          this.muiDialog.openSnackBar({ title: 'Success!', message: 'Room Created Successfully' }, 'Success')
          this.dialogRef.close({reload:true});
        },
        error: (err: any) => {

        }
      })
    } else {
      this.api.markFormGroupTouched(this.roomForm);
      console.log('Form is not valid', this.roomForm);
    }
  }
}
