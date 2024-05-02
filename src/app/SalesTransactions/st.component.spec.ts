import { ComponentFixture, TestBed } from '@angular/core/testing';

import { STComponent } from './st.component';

describe('STComponent', () => {
  let component: STComponent;
  let fixture: ComponentFixture<STComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ STComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(STComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
