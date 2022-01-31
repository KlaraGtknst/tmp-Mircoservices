import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPickTaskComponent } from './edit-pick-task.component';

describe('EditPickTaskComponent', () => {
  let component: EditPickTaskComponent;
  let fixture: ComponentFixture<EditPickTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPickTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPickTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
