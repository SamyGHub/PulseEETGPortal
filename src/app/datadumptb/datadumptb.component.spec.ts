import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatadumptbComponent } from './datadumptb.component';

describe('DatadumptbComponent', () => {
  let component: DatadumptbComponent;
  let fixture: ComponentFixture<DatadumptbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatadumptbComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatadumptbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
