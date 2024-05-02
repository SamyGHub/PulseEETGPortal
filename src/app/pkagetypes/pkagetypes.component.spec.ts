import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PkagetypesComponent } from './pkagetypes.component';

describe('PkagetypesComponent', () => {
  let component: PkagetypesComponent;
  let fixture: ComponentFixture<PkagetypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PkagetypesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PkagetypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
