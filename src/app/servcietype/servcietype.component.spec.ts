import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServcietypeComponent } from './servcietype.component';

describe('ServcietypeComponent', () => {
  let component: ServcietypeComponent;
  let fixture: ComponentFixture<ServcietypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServcietypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServcietypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
