import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RailcarsComponent } from './railcars.component';

describe('RailcarsComponent', () => {
  let component: RailcarsComponent;
  let fixture: ComponentFixture<RailcarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RailcarsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RailcarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
