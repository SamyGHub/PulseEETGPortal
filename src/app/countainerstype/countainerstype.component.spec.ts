import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountainerstypeComponent } from './countainerstype.component';

describe('CountainerstypeComponent', () => {
  let component: CountainerstypeComponent;
  let fixture: ComponentFixture<CountainerstypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountainerstypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountainerstypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
