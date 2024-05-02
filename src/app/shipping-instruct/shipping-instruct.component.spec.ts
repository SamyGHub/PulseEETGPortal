import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingInstructComponent } from './shipping-instruct.component';

describe('ShippingInstructComponent', () => {
  let component: ShippingInstructComponent;
  let fixture: ComponentFixture<ShippingInstructComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingInstructComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingInstructComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
