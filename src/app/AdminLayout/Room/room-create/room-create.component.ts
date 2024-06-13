import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthService } from './../../../Services/Auth.service';

@Component({
  selector: 'app-room-create',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule ],
  templateUrl: './room-create.component.html',
  styleUrl: './room-create.component.css'
})
export class RoomCreateComponent {
  roomForm: FormGroup;

  constructor(private fb: FormBuilder, private authService:AuthService) {
    this.roomForm = this.fb.group({
      roomId: ['', Validators.required],
      date: ['', Validators.required],
      entryFee: ['', [Validators.required, Validators.min(1)]],
      totalParticipants: ['', [Validators.required, Validators.min(1)]],
      winningAmount: ['', [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit() {
    if (this.roomForm.valid) {
      this.authService.create_room(this.roomForm.value).subscribe({
        next:(any)=>{

        },
        error:(err:any)=>{
          
        }
      })
    } else {
      console.log('Form is not valid');
    }
  }
}
