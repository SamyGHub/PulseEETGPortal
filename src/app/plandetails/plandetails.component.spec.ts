import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlandetailsComponent } from './plandetails.component';

describe('PlandetailsComponent', () => {
  let component: PlandetailsComponent;
  let fixture: ComponentFixture<PlandetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlandetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlandetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
