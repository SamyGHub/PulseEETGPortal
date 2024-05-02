import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptPurchaseDumpComponent } from './rpt-purchase-dump.component';

describe('RptPurchaseDumpComponent', () => {
  let component: RptPurchaseDumpComponent;
  let fixture: ComponentFixture<RptPurchaseDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RptPurchaseDumpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RptPurchaseDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
