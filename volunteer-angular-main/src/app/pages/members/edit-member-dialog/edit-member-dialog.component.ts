import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-member-dialog',
  templateUrl: './edit-member-dialog.component.html',
  styleUrls: ['./edit-member-dialog.component.scss'],
})
export class EditMemberDialogComponent {
  updatedName: string;
  updatedEmail: string;

  constructor(
    public dialogRef: MatDialogRef<EditMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updatedName = data.member.name;
    this.updatedEmail = data.member.email;
  }

  onSaveClick() {
    // You can perform any necessary validation or checks here before closing the dialog
    const updatedDetails = {
      name: this.updatedName,
      email: this.updatedEmail,
    };
    this.dialogRef.close(updatedDetails);
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}
