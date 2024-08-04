import { Component, TemplateRef, ViewChild, viewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {RoomCreateComponent} from '../room-create/room-create.component'
import { AdminService } from '../../../Services/Admin.service';
import { RouterModule } from '@angular/router';
import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle';
import MuiDialogService from './../../../Services/MuiDialog.service';
import {MatRippleModule} from '@angular/material/core';
import { SetWinnerComponent } from '../SetWinner/set-winner.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort } from '@angular/material/sort';

export interface RoomList {
  roomId: string;
  startDate: any;
  endDate: any;
  startime: any;
  endTime: any;
  entryFee: number;
  totalParticipants: number;
  winningAmount: number;
  isActive:number;
  id:number;
}

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, MatButtonModule, MatDialogModule,MatPaginatorModule,MatInputModule,
    MatFormFieldModule,CommonModule,MatSlideToggleModule,RouterModule,MatRippleModule,MatDatepickerModule
    
  ],
  providers: [DatePipe],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
})
export class RoomListComponent {
  displayedColumns: string[] = ['sno', 'roomId', 'endDate', 'entryFee', 'totalParticipants', 'winningAmount', 'action', 'viewDetails'];
  //dataSource:RoomList[]=[];
  // dataSource: MatTableDataSource<any> | undefined;
  dataSource = new MatTableDataSource<RoomList>;
  currentPage:number=1;
  perPage:number=0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  @ViewChild(MatSort) sort!: MatSort;
  

  today: Date = new Date();
  constructor(public dialog: MatDialog, private api:AdminService, private muiService:MuiDialogService) {
  }

  

 ngOnInit(){
  this.gerRoomList();
 }

  gerRoomList(){
    this.api.adminroomList(this.currentPage,this.perPage).subscribe({
      next:(res:any) => {
        console.log(res.data, 'res.data;');
        //this.dataSource=res.data;
        

        if (res.data) {
          this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
       this.dataSource.filterPredicate = 
      (data: any, filtersJson: string) => {
          const matchFilter: any[] = [];
          const filters = JSON.parse(filtersJson);
      
          filters.forEach((filter: { id: string | number; value: string; }) => {
            const val = data[filter.id] === null ? '' : data[filter.id];
            matchFilter.push(val.toLowerCase().includes(filter.value.toLowerCase()));
          });
            return matchFilter.every(Boolean);
        };
      }

      },
      error: (err: any) => {

      }
    })
  }


  
  updateStatus(event:MatSlideToggleChange, obj:any, index:number){
    let isActive:number=event.checked? 1:0;
    this.api.updateStatus(obj.id,  isActive).subscribe({
      next:(res:any) => {
        console.log(res.data, 'res.data;');
        if(res.status){
          // this.dataSource[index]['isActive']=isActive;
        }
      },
      error: (err: any) => {

      }
    })
  }

  onDelete(e1:any,e2:any){
    // this.dialog.

    console.log(e1.id,"---",e2,"delete");

    this.api.deleteRoom(e1.id).subscribe({
      next:(res:any) => {
        console.log(res.data, 'res.data;');
        if(res.status){
          // this.dataSource[index]['isActive']=isActive;
        }
      },
      error: (err: any) => {

      }
    })
    this.gerRoomList();
  }

  openDialog() {
    const dialogRef = this.dialog.open(RoomCreateComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result.reload){
        this.gerRoomList();
      }
    });
  }


  openWinnerTemplate(roomId:string){
    this.dialog.open(SetWinnerComponent, {width:'70%', minHeight:'400px', data:{roomId}})
  }

 
  convertToAmPm(time: string): string {
    const hours = Number(time.split(':')[0]);
    const minutes = Number(time.split(':')[1]);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12; // Adjust hours
    const adjustedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Adjust minutes
    return `${adjustedHours}:${adjustedMinutes} ${ampm}`;
  }

  isDateValid(itemDate: string): boolean {
    const today = this.today.setHours(0, 0, 0, 0); // Set today's date to midnight to only compare the date part
    const date = new Date(itemDate).setHours(0, 0, 0, 0);
    return date < today;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const tableFilters = [];
    tableFilters.push({
      id: 'roomId',
      value: filterValue
    });
    
   // console.log("filterddata",tableFilters,this.dataSource);
    if (this.dataSource) {
    this.dataSource.filter = JSON.stringify(tableFilters);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    }
  }
}
