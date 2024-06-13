import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationModel } from './../../Models/ConfirmationModel';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatRippleModule} from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
  imports:[CommonModule,MatButtonModule, MatDialogModule, MatIconModule, MatRippleModule]
})
export class ConfirmationComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationModel) {}

  ngOnInit(): void {}
}