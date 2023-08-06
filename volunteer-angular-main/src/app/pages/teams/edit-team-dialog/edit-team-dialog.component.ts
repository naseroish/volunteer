import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-edit-team-dialog',
  templateUrl: './edit-team-dialog.component.html',
})
export class EditTeamDialogComponent {
  team: any;

  constructor(
    public dialogRef: MatDialogRef<EditTeamDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private db: AngularFireDatabase
  ) {
    this.team = { ...data.team };
  }

  onSubmit() {
    // Update the team details in the Firebase Realtime Database
    // You can use the 'this.team' object to get the updated team details
    // Update the team in the database using the appropriate logic

    // Example logic: Assuming you have the team key available as this.team.$key
    // You can update the team name using the following code:
    this.db.object(`teams/${this.team.$key}/name`).set(this.team.name)
      .then(() => {
        console.log('Team name updated successfully');
        this.dialogRef.close(this.team.name); // Pass the updated team name as the result
      })
      .catch((error) => {
        console.error('Error updating team name:', error);
      });
  }

  onCancel() {
    this.dialogRef.close(); // Close the dialog without any result
  }
}
