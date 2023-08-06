import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MembersService } from './members.service';
import { of } from 'rxjs';


@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit {
  showImportMembers: boolean = false;
  selectedTeamId = '';
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  members!: Observable<any[]>;
  teams!: Observable<any[]>;
  membersWithTeamName: Observable<any[]> = of([]);
  showCreateMemberInput = false;
  fileToUpload: File | null = null;


  newMember: any = {
    id: '',
    name: '',
    phone: '',
    role: '',
    hours: 0,
    teamId: ''
    
    
  };

  displayedColumns: string[] = ['select', 'id', 'phone', 'name', 'role', 'hours', 'teamName', 'actions'];

  constructor(
    private db: AngularFireDatabase,
    private authService: AngularFireAuth,
    private membersService: MembersService
  ) { }

  ngOnInit() {
    this.authService.authState
      .pipe(
        switchMap((user) => {
          if (user) {
            this.teams = this.db
              .list('teams', (ref) => ref.orderByChild('creatorId').equalTo(user.uid))
              .snapshotChanges()
              .pipe(
                map((actions) =>
                  actions.map((a) => {
                    const data = a.payload.val();
                    return Object.assign({}, data, { $key: a.key });
                  })

                )
              );

            return this.teams.pipe(take(1));
          } else {
            return [];
          }
        }),
        switchMap((teams) => {
          if (teams.length > 0) {
            this.selectedTeamId = teams[0].$key;
            this.members = this.db
              .list('members', (ref) => ref.orderByChild('teamId').equalTo(this.selectedTeamId))
              .snapshotChanges()
              .pipe(
                map((actions) =>
                  actions.map((a) => {
                    const data = a.payload.val();
                    return Object.assign({}, data, { $key: a.key });
                  })
                )
              );

            return combineLatest([this.members, this.teams]).pipe(
              map(([members, teams]) => {
                return members.map((member) => {
                  const team = teams.find((t) => t.$key === member.teamId);
                  return { ...member, teamName: team ? team.name : '' };
                });
              })
            );
          } else {
            return [];
          }
        })
      )
      .subscribe((members) => {
        this.membersWithTeamName = of(members);
      });
  }



  toggleImportMembers() {
    this.showImportMembers = !this.showImportMembers;
  }

  handleFileInput(event: any) {
    const files: FileList = event.target.files;
    this.fileToUpload = files.item(0);
  }

  submitImportMembers() {
    if (this.selectedTeamId && this.fileToUpload) {
      this.membersService.importMembers(this.selectedTeamId, this.fileToUpload);
    }
  }



  toggleCreateMemberInput() {
    this.showCreateMemberInput = !this.showCreateMemberInput;
  }

  createMember() {
    const newMember = {
      ...this.newMember,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      teamId: this.selectedTeamId // Set the teamId to the selected team's ID
    };
    this.db.list('members').push(newMember);
  
    // Reset newMember object after creating a member
    this.newMember = {
      name: '',
      role: '',
      hours: 0,
      teamId: '',
      phone: '',
      id: ''
    };
  }

  cancelAddMember() {
    this.showCreateMemberInput = false;
    this.newMember = {
      name: '',
      role: '',
      hours: 0,
      teamId: '',
    };
  }

  deleteMember(member: any) {
    if (confirm('Are you sure you want to delete this member?')) {
      this.db.object(`members/${member.$key}`)
        .remove()
        .then(() => {
          console.log('Member deleted successfully.');
        })
        .catch((error) => {
          console.error('Error deleting member:', error);
        });
    } else {
      alert('Canceled');
    }
  }

  deleteSelectedMembers() {
    if (confirm('Are you sure you want to delete the selected members?')) {
      this.membersWithTeamName.pipe(take(1)).subscribe((members) => {
        const selectedMembers = members.filter((member) => member.checked);
        selectedMembers.forEach((member) => {
          this.db.object(`members/${member.$key}`).remove().then(() => {
            console.log('Member deleted successfully.');
          }).catch((error) => {
            console.error('Error deleting member:', error);
          });
        });
      });
    } else {
      alert('Canceled');
    }
  }

  selectedMembersExist(): Observable<boolean> {
    return this.membersWithTeamName.pipe(
      map((members) => members.some((member) => member.checked))
    );
  }

  hasSelectedMembers(): boolean {
    let selectedMemberExists = false;
    this.membersWithTeamName.pipe(take(1)).subscribe((members) => {
      selectedMemberExists = members.some((member) => member.checked);
    });
    return selectedMemberExists;
  }




  showOptions(member: any) {
    member.showOptions = !member.showOptions;
  }

  addHours(member: any) {
    const hoursToAdd = prompt('How many hours do you want to add?');
    if (hoursToAdd) {
      const newHours = member.hours + Number(hoursToAdd);
      this.db.object(`members/${member.$key}`).update({ hours: newHours });
    }
  }

  editMember(member: any) {
    const updatedName = prompt('Enter the new name', member.name);
    const updatedRole = prompt('Enter the new role', member.role);
    const updatedTeamId = prompt('Enter the new team ID', member.teamId);
    if (updatedName && updatedRole) {
      this.db.object(`members/${member.$key}`).update({ name: updatedName, role: updatedRole, teamId: updatedTeamId });
    }
  }

  selectAll(event: any) {
    const checked = event.checked;
    this.membersWithTeamName.pipe(take(1)).subscribe((members) => {
      members.forEach((member) => {
        member.checked = checked;
        this.db.object(`members/${member.$key}`).update({ checked: checked });
      });
    });
  }


}
