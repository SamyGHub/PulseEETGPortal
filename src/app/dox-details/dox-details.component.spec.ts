import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoxDetailsComponent } from './dox-details.component';

describe('DoxDetailsComponent', () => {
  let component: DoxDetailsComponent;
  let fixture: ComponentFixture<DoxDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoxDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoxDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
