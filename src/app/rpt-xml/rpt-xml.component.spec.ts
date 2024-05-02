import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptXMLComponent } from './rpt-xml.component';

describe('RptXMLComponent', () => {
  let component: RptXMLComponent;
  let fixture: ComponentFixture<RptXMLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RptXMLComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RptXMLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
