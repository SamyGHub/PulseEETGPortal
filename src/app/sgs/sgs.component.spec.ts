import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SGSComponent } from './sgs.component';

describe('SGSComponent', () => {
  let component: SGSComponent;
  let fixture: ComponentFixture<SGSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SGSComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SGSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
