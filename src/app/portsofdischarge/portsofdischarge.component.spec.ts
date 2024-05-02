import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortsofdischargeComponent } from './portsofdischarge.component';

describe('PortsofdischargeComponent', () => {
  let component: PortsofdischargeComponent;
  let fixture: ComponentFixture<PortsofdischargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortsofdischargeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortsofdischargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
