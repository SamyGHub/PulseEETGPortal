import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptSalesDumpComponent } from './rpt-sales-dump.component';

describe('RptSalesDumpComponent', () => {
  let component: RptSalesDumpComponent;
  let fixture: ComponentFixture<RptSalesDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RptSalesDumpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RptSalesDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
