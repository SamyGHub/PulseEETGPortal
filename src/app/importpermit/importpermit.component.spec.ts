import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportpermitComponent } from './importpermit.component';

describe('ImportpermitComponent', () => {
  let component: ImportpermitComponent;
  let fixture: ComponentFixture<ImportpermitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportpermitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportpermitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
