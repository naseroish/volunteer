import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { MatDialog } from '@angular/material/dialog';
import { EditTeamDialogComponent } from './edit-team-dialog/edit-team-dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { QueryFn } from '@angular/fire/compat/database';


@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  teams!: Observable<any[]>;
  userId!: string;
  displayedColumns: string[] = ['select', 'name', 'memberCount', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]); // Updated type and initialization
  showCreateTeamInput = false;
  newTeamName = '';
  memberCounts: { [teamId: string]: number } = {};

  constructor(
    private db: AngularFireDatabase,
    private authService: AngularFireAuth,
    private dialog: MatDialog
  ) {
    this.authService.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.teams = this.db
          .list('teams', (ref) => ref.orderByChild('creatorId').equalTo(this.userId))
          .snapshotChanges()
          .pipe(
            map((actions) =>
              actions.map((a) => {
                const data = a.payload.val();
                return { $key: a.key, ...data as object };
              })
            )
          );
  
        this.teams.subscribe((data) => {
          this.dataSource.data = data.map((team) => ({ ...team, checked: false }));
  
          // Fetch member count for each team
          data.forEach((team) => {
            this.getMemberCount(team);
          });
        });
      }
    });
  }
  

  toggleCreateTeamInput() {
    this.showCreateTeamInput = !this.showCreateTeamInput;
  }

  createTeam(teamName: string) {
    const newTeam = {
      name: teamName,
      creatorId: this.userId,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    };
    this.db.list('teams').push(newTeam);

    this.cancelCreateTeam();
  }

  cancelCreateTeam() {
    this.showCreateTeamInput = false;
    this.newTeamName = '';
  }

  deleteTeam(team: any) {
    if (confirm('Are you sure you want to delete this team?')) {
      this.db.object(`teams/${team.$key}`).remove().then(() => {
        console.log('Team deleted successfully.');
      }).catch((error) => {
        console.error('Error deleting team:', error);
      });
    } else {
      alert('Canceled');
    }
  }

  deleteSelectedTeams() {
    if (confirm('Are you sure you want to delete the selected teams?')) {
      const selectedTeams = this.dataSource.data.filter((team) => team.checked);
      selectedTeams.forEach((team) => {
        this.db.object(`teams/${team.$key}`).remove().then(() => {
          console.log('Team deleted successfully.');
        }).catch((error) => {
          console.error('Error deleting team:', error);
        });
      });
    } else {
      alert('Canceled');
    }
  }

  selectAll(event: any) {
    const checked = event.checked;
    this.dataSource.data.forEach((team) => {
      team.checked = checked;
    });
  }

  selectedTeamsExist() {
    return this.dataSource.data.some((team) => team.checked);
  }

  editTeam(team: any) {
    const dialogRef = this.dialog.open(EditTeamDialogComponent, {
      width: '400px',
      data: { team: team },
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        // Update the team details in the database or perform any other necessary operations
        console.log('Team details updated:', result);
      }
    });
  }

  async getMemberCount(team: any): Promise<number> {
    if (team && team.$key) {
      const snapshot = await this.db
        .list('members', (ref) => ref.orderByChild('teamId').equalTo(team.$key))
        .query
        .once('value');
      const members = snapshot.val();
      const memberCount = members ? Object.keys(members).length : 0;
      this.memberCounts[team.$key] = memberCount;
      return memberCount;
    }
    return 0;
  }
  

  applyFilter(column: string) {
    switch (column) {
      case 'name':
        this.dataSource.sort = this.sort;
        break;
      // Add more cases for other columns if needed

      default:
        break;
    }
  }
}
