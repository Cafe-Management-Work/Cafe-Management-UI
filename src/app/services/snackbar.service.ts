import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  opensnackbar(message: string, action: string ) {
    if(action === 'success') {
      this.snackBar.open(message, '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['green-snackbar']
      });
    } else if(action === 'error') {
      this.snackBar.open(message, '', {
        duration: 3000,
        panelClass: ['black-snackbar']
      });
    }
  }
}
