import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CFIAComponent } from './cfia.component';

describe('CFIAComponent', () => {
  let component: CFIAComponent;
  let fixture: ComponentFixture<CFIAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CFIAComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CFIAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
