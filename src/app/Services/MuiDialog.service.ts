import { Injectable } from '@angular/core';
import { ToastMsgComponent } from '../Components/ToastMsg/toast-msg.component';
import {MatSnackBar, MatSnackBarRef} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmationComponent } from '../Components/Confirmation/confirmation.component';
import { ConfirmationModel } from '../Models/ConfirmationModel';

interface NotificationProps {
  config: ConfigProps;
  type: 'Success' | 'Warn' | 'Error';
}

interface ConfigProps {
  title:String,
  message:string
}

@Injectable({
  providedIn: 'root',
})
class MuiDialogService {

  constructor(private _snackBar: MatSnackBar, private dialog: MatDialog) { }

  openSnackBar(data:any, type:('Success' | 'Warn' | 'Error')) {
    let config:NotificationProps={
      config:data,
      type:type,
    }

    this._snackBar.openFromComponent(ToastMsgComponent, {
      // duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      data:config,
      panelClass:'template-snackbar',
    });
  }


  confirm(data: ConfirmationModel): Observable<boolean> {
    return this.dialog.open(ConfirmationComponent, { data,width: '350px', height:'170px', disableClose: true,}).afterClosed();
  }
}

export default MuiDialogService;
