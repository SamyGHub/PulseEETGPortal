import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortofloadingComponent } from './portofloading.component';

describe('PortofloadingComponent', () => {
  let component: PortofloadingComponent;
  let fixture: ComponentFixture<PortofloadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortofloadingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortofloadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
