import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mat-confirm-dialog',
  templateUrl: './mat-confirm-dialog.component.html',
  styleUrls: ['./mat-confirm-dialog.component.scss']
})
export class MatConfirmDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MatConfirmDialogComponent>) { }

  public confirmMessage:string;

  ngOnInit(): void {
  }

}
