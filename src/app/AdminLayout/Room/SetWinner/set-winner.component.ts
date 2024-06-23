import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import MuiDialogService from './../../../Services/MuiDialog.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AdminService } from '../../../Services/Admin.service';
import {
  DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-set-winner',
  standalone: true,
  imports: [DragDropModule, MatDialogModule, MatButtonModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './set-winner.component.html',
  styleUrl: './set-winner.component.css'
})
export class SetWinnerComponent {
  isLoading: boolean = true;
  readonly dialogRef = inject(MatDialogRef<SetWinnerComponent>);
  users: any;
  winners: any = [];
  roomsInfo:any={};

  constructor(private changeDetectorRef: ChangeDetectorRef, private muiDialog: MuiDialogService, private api: AdminService, @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  ngOnInit() {
    this.getRoomUsersList();
  }

  getRoomUsersList() {
    this.isLoading = true;
    let that = this;
    this.api.getRoomUsersList(this.data.roomId).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.status && res.users.length) {
          this.isLoading = false;
          this.users = res.users;
          this.roomsInfo = res.roomsInfo;
          this.winners = [];

          if(this.roomsInfo['manuval_winners']){
            let win:any[]=JSON.parse(this.roomsInfo['manuval_winners']);
            for (let i = 0; i < win.length; i++) {
              this.winners.push({
                user_id:win[i],
                username:''
              })
            }
          }
          
          console.log('wwo');
          
          this.addUsernameAndRemoveMatchingItems();
          this.changeDetectorRef.detectChanges();
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      }
    })
  }


  addUsernameAndRemoveMatchingItems(): void {
    console.log(this.winners, 'this.winners');
    
    this.winners.forEach((itemB: any) => {
      const matchingItem = this.users.find((itemA: any) => Number(itemA.user_id)== itemB.user_id);
      console.log(matchingItem,'matchingItem');
      if (matchingItem) {
       
        
        itemB.username = matchingItem.username;
      }
    });

    this.winners.forEach((itemB: any) => {
      const index = this.users.findIndex((itemA: any) => itemA.user_id === itemB.user_id);
      if (index !== -1) {
        itemB.username = this.users[index].username;
        this.users.splice(index, 1);
      }
    });
    this.changeDetectorRef.detectChanges();
  }

  onSubmit() {
    console.log(this.winners, 'this.winners');

    if (this.winners.length>=0) {
      const obj = {
        room_id: this.data.roomId,
        winners: this.filterUserData(this.winners)
      }
      this.api.saveWinners(obj).subscribe({
        next: (any) => {
          this.muiDialog.openSnackBar({ title: 'Success!', message: 'Room Created Successfully' }, 'Success')
          this.dialogRef.close();
        },
        error: (err: any) => {

        }
      })
    } else {
      console.log('Form is not valid');
    }
  }

  filterUserData(users: any[]): any[] {
    return users.map(user => Number(user.user_id));
  }

}

