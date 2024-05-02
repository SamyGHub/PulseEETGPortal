import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewrailcarComponent } from './newrailcar.component';

describe('NewrailcarComponent', () => {
  let component: NewrailcarComponent;
  let fixture: ComponentFixture<NewrailcarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewrailcarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewrailcarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
