import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RailscardetailsComponent } from './railscardetails.component';

describe('RailscardetailsComponent', () => {
  let component: RailscardetailsComponent;
  let fixture: ComponentFixture<RailscardetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RailscardetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RailscardetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
