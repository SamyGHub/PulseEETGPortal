import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenweeksComponent } from './greenweeks.component';

describe('GreenweeksComponent', () => {
  let component: GreenweeksComponent;
  let fixture: ComponentFixture<GreenweeksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GreenweeksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GreenweeksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
