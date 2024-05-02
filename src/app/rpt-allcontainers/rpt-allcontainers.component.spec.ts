import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptAllcontainersComponent } from './rpt-allcontainers.component';

describe('RptAllcontainersComponent', () => {
  let component: RptAllcontainersComponent;
  let fixture: ComponentFixture<RptAllcontainersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RptAllcontainersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RptAllcontainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
