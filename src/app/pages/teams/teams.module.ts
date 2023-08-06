import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamsComponent } from './teams.component';
import { FilterPipe } from './filter.pipe';
import { RouterModule, Routes } from '@angular/router';
import * as firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import {MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditTeamDialogComponent } from './edit-team-dialog/edit-team-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';






const routes: Routes = [
  {
    path: '',
    component: TeamsComponent
  }
]

@NgModule({
  declarations: [TeamsComponent, FilterPipe, EditTeamDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    

    MatTableModule,
    MatCheckboxModule,
    MatSortModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
})
export class TeamsModule { }