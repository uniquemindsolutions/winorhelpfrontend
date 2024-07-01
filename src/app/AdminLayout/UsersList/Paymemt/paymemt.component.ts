import { Component, Inject, inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AdminService } from '../../../Services/Admin.service';
import {MatInputModule} from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import MuiDialogService from './../../../Services/MuiDialog.service';

@Component({
  selector: 'app-paymemt',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule,FormsModule,ReactiveFormsModule, MatInputModule,MatFormFieldModule, MatSelectModule],
  templateUrl: './paymemt.component.html',
  styleUrl: './paymemt.component.css'
})
export class PaymemtComponent {
  readonly dialogRef = inject(MatDialogRef<PaymemtComponent>);
  roomId = new FormControl('');
  transationAmount = new FormControl('');
  roomList: any[] = [];


  constructor(private api:AdminService, @Inject(MAT_DIALOG_DATA) public data: {action: string, item:any, }, private muiDialog: MuiDialogService,){

  }

  ngOnInit(){
    console.log(this.data);
    
    this.api.roomList(1, 100).subscribe({
      next:(res:any)=>{
        if(res.status){
          this.roomList=res.data;
        }
      }, error:(err:any)=>{

      }
    })
  }


  roomAllocation=()=>{
    console.log(this.data.item,'this.data', this.data.item);

    const objData={
      userId:this.data.item?.id,
      roomId:this.roomId.value,
      startDate:'',
      endDate:"",
      startTime:"",
      endTime:"",
      amount:0,
    }
    let roomInfo:any=this.roomList.filter((res:any)=>res.roomId==this.roomId.value);
    if(roomInfo && roomInfo.length){
      objData['amount']=Number(roomInfo[0].entryFee);
      objData['startDate']=roomInfo[0].startDate;
      objData['endDate']=roomInfo[0].endDate;
      objData['startTime']=roomInfo[0].startTime;
      objData['endTime']=roomInfo[0].endTime;
    }

    
    console.log(objData, 'objData');
    
    this.api.roomAllocation(objData).subscribe({
      next:(res:any)=>{
        if(res.status==true){
          this.muiDialog.openSnackBar({ title: 'Success!', message: 'Room allocated sucsess' }, 'Success');
          this.dialogRef.close();
        }else{
          this.muiDialog.openSnackBar({ title: 'Error!', message: res.message}, 'Error')
        }

      },error:(err:any)=>{
        this.muiDialog.openSnackBar({ title: 'Error!', message: err.message}, 'Error')
      }
    })
  }

  makeDebitCreditRequest=()=>{
    console.log(this.data.item,'this.data', this.data.item);
    if(this.transationAmount.valid){
      const objData={
        userId:this.data.item?.id,
        amount:this.transationAmount.value
      }

      let apiInstance:any=this.api.creditRequest(objData);
      let msgType='Credited';
      if(this.data.action=='debit'){
        msgType='Debited';
        apiInstance=this.api.debitRequest(objData);
      }
    
      apiInstance.subscribe({
        next:(res:any)=>{
          if(res.status==true){
            this.muiDialog.openSnackBar({ title: 'Success!', message: `Amount ${msgType} successfully`} , 'Success');
            this.dialogRef.close();
          }else{
            this.muiDialog.openSnackBar({ title: 'Error!', message: res.message}, 'Error')
          }
        },error:(err:any)=>{
          this.muiDialog.openSnackBar({ title: 'Error!', message: err.message}, 'Error')
        }
      })
  
    }else{
      this.transationAmount.markAllAsTouched();
    }
    
    
  }

}
