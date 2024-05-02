import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalletdimensionsComponent } from './palletdimensions.component';

describe('PalletdimensionsComponent', () => {
  let component: PalletdimensionsComponent;
  let fixture: ComponentFixture<PalletdimensionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PalletdimensionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PalletdimensionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
