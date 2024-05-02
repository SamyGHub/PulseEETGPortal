import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalletstackingComponent } from './palletstacking.component';

describe('PalletstackingComponent', () => {
  let component: PalletstackingComponent;
  let fixture: ComponentFixture<PalletstackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PalletstackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PalletstackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
