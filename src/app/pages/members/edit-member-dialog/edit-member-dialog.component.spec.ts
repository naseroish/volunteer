import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMemberDialogComponent } from './edit-member-dialog.component';

describe('EditMemberDialogComponent', () => {
  let component: EditMemberDialogComponent;
  let fixture: ComponentFixture<EditMemberDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditMemberDialogComponent]
    });
    fixture = TestBed.createComponent(EditMemberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
