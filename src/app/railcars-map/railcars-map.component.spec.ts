import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RailcarsMapComponent } from './railcars-map.component';

describe('RailcarsMapComponent', () => {
  let component: RailcarsMapComponent;
  let fixture: ComponentFixture<RailcarsMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RailcarsMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RailcarsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
