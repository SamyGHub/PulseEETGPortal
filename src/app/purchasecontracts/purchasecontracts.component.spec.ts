import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasecontractsComponent } from './purchasecontracts.component';

describe('PurchasecontractsComponent', () => {
  let component: PurchasecontractsComponent;
  let fixture: ComponentFixture<PurchasecontractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasecontractsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasecontractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
