import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippinglinesComponent } from './shippinglines.component';

describe('ShippinglinesComponent', () => {
  let component: ShippinglinesComponent;
  let fixture: ComponentFixture<ShippinglinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippinglinesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippinglinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
