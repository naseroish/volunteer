import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTeamDialogComponent } from './edit-team-dialog.component';

describe('EditTeamDialogComponent', () => {
  let component: EditTeamDialogComponent;
  let fixture: ComponentFixture<EditTeamDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditTeamDialogComponent]
    });
    fixture = TestBed.createComponent(EditTeamDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
