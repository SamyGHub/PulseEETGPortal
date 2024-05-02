import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipTransloadersComponent } from './ship-transloaders.component';

describe('ShipTransloadersComponent', () => {
  let component: ShipTransloadersComponent;
  let fixture: ComponentFixture<ShipTransloadersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipTransloadersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipTransloadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
