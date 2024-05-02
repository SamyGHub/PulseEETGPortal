import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuroperationsComponent } from './puroperations.component';

describe('PuroperationsComponent', () => {
  let component: PuroperationsComponent;
  let fixture: ComponentFixture<PuroperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuroperationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuroperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
