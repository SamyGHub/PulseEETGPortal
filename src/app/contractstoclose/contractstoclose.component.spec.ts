import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractstocloseComponent } from './contractstoclose.component';

describe('ContractstocloseComponent', () => {
  let component: ContractstocloseComponent;
  let fixture: ComponentFixture<ContractstocloseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractstocloseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractstocloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
