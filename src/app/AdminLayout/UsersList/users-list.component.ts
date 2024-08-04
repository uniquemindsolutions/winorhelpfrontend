import { Component, ViewChild, inject } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import { AdminService } from '../../Services/Admin.service';
import { PaymemtComponent } from './Paymemt/paymemt.component';
import { NewUserComponent } from './NewUser/new-user.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


export interface useList {
  sno:number;
  name: string;
  email: string;
  phone: number;
  email_veri: any;
  ref_code: any;
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, MatButtonModule, MatDialogModule,MatPaginatorModule,MatInputModule,
    MatFormFieldModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent {
  displayedColumns: string[] = ['sno', 'name','UserID', 'email', 'phone', 'email_veri','upi', 'status','room_allot','debit_action','credit_action'];
  //dataSource :RoomList[]=[];
  // dataSource: MatTableDataSource<any> | undefined;
  dataSource = new MatTableDataSource<useList>;
  currentPage:number=1;
  perPage:number=0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog, private api:AdminService) {
  }

 ngOnInit(){
  
  this.gerUsersList();

 


 }

 

  gerUsersList(){
    
    this.api.usersList(this.currentPage,this.perPage).subscribe({
      next:(res:any) => {
        //this.dataSource=res.data;
       

        if (this.paginator) {
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

  openDialog(item:any, action:string) {
   // alert("Hii");
    const dialogRef = this.dialog.open(PaymemtComponent, {data:{item, action}});
    dialogRef.afterClosed().subscribe((result:any) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  addUsers() {
    const dialogRef = this.dialog.open(NewUserComponent,);
    dialogRef.afterClosed().subscribe((result:any) => {
      console.log(`Dialog result: ${result}`);
      this.gerUsersList();
    });
  }


  applyFilter(filterValue: string) {
    const tableFilters = [];
    tableFilters.push({
      id: 'username',
      value: filterValue
    });
    
    console.log("filterddata",tableFilters,this.dataSource);
    if (this.dataSource) {
    this.dataSource.filter = JSON.stringify(tableFilters);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    }
  }



}
