import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtrasrvComponent } from './extrasrv.component';

describe('ExtrasrvComponent', () => {
  let component: ExtrasrvComponent;
  let fixture: ComponentFixture<ExtrasrvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtrasrvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtrasrvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
