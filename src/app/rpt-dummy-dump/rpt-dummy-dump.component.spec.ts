import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptDummyDumpComponent } from './rpt-dummy-dump.component';

describe('RptDummyDumpComponent', () => {
  let component: RptDummyDumpComponent;
  let fixture: ComponentFixture<RptDummyDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RptDummyDumpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RptDummyDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
