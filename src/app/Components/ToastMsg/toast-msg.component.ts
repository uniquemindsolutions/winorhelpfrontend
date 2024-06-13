import { Component, Inject , inject} from '@angular/core';
import {MatSnackBar, MatSnackBarRef, MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  standalone:true,
  selector: 'app-toast-msg',
  templateUrl: './toast-msg.component.html',
  styleUrls: ['./toast-msg.component.scss'],
  imports:[CommonModule, MatIconModule, MatSnackBarModule]
})
export class ToastMsgComponent {
  snackBarRef = inject(MatSnackBarRef);
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any={type:'Success'}) {
  }
}
