import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportpermitmatrixComponent } from './importpermitmatrix.component';

describe('ImportpermitmatrixComponent', () => {
  let component: ImportpermitmatrixComponent;
  let fixture: ComponentFixture<ImportpermitmatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportpermitmatrixComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportpermitmatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
