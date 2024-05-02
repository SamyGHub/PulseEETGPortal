import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RailnophytorptComponent } from './railnophytorpt.component';

describe('RailnophytorptComponent', () => {
  let component: RailnophytorptComponent;
  let fixture: ComponentFixture<RailnophytorptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RailnophytorptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RailnophytorptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
