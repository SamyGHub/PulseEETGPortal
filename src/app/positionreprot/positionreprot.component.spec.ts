import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionreprotComponent } from './positionreprot.component';

describe('PositionreprotComponent', () => {
  let component: PositionreprotComponent;
  let fixture: ComponentFixture<PositionreprotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionreprotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionreprotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
