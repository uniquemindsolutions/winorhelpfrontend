import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AdminService } from '../../Services/Admin.service';
import { CustomeServiceService } from '../../Services/custome-service.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSort } from '@angular/material/sort';

export interface useList {
  amount:string;
  datetime: string;
  id: string;
  trans_type: string;
  user_id: string;
}


@Component({
  selector: 'app-transhist',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, MatButtonModule, MatDialogModule,MatPaginatorModule,MatInputModule,
    MatFormFieldModule,CommonModule],
  templateUrl: './transhist.component.html',
  styleUrl: './transhist.component.css',
  providers:[AdminService]
})
export class TranshistComponent {
  dataSource:any=[];
  // dataSource = new MatTableDataSource<useList>;
  displayedColumns: string[] = ['sno','user_id', 'trans_type', 'amount', 'date'];
  walletamount:any;
  currentPage:number=1;
  perPage:number=0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(public dialog: MatDialog, private customeservice:CustomeServiceService,private admin: AdminService) {
  }

  ngOnInit(){
     this.getTranslist();
     const data = {"user_id": localStorage.getItem('user_id')}
     this.admin.getUserMasterDetails(data).subscribe({
      next: (res: any) => {

      localStorage.setItem("walletamount",res.data.wallet_amount);
      console.log(res.data, "res test")
      this.walletamount=res.data.wallet_amount;

      }, error: (err: any) => {
        //this.dialog.openSnackBar({ message:'Login failed. Please try again.', title: 'Login failed'}, 'Error');
      }

  }) 
   }

   getTranslist(){
    this.admin.getallTransList().subscribe({
      next:(res:any) => {
        console.log(res.data);
        if (this.paginator) {
          this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
       this.dataSource.filterPredicate = 
      (data: any, filtersJson: string) => {
          const matchFilter: any[] = [];
          const filters = JSON.parse(filtersJson);
      
          filters.forEach((filter: { id: string | number; value: string; }) => {
            // console.log("filtervalue22",data.user_id);
            const val = data.user_id === null ? '' : data.user_id;
           // console.log("filtervalueget",filter.value,val);
            // console.log("filtervalueget",val);
            matchFilter.push(val.includes(filter.value));
            console.log("filtervalueget",matchFilter);
          });
            return matchFilter.every(Boolean);
        };
      }
      },
      error: (err: any) => {

      }
    })

  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   const tableFilters = [];
  //   tableFilters.push({
  //     id: 'user_id',
  //     value: filterValue
  //   });
    
  //   console.log("filterddata",tableFilters, this.dataSource.filter);
  //   if (this.dataSource) {
  //   this.dataSource.filter = JSON.stringify(tableFilters);
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  //   }
  // }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: useList, filter: string): boolean => {
      // Match filter string with any of the fields
      return (
        data.user_id.toLowerCase().includes(filter) ||
        data.trans_type.toLowerCase().includes(filter) 
      );
    };

    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }




}
