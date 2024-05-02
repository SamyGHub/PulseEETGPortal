import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyContractComponent } from './dummy-contract.component';

describe('DummyContractComponent', () => {
  let component: DummyContractComponent;
  let fixture: ComponentFixture<DummyContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DummyContractComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DummyContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
