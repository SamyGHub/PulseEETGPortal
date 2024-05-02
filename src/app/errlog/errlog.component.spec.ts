import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ERRLogComponent } from './errlog.component';

describe('ERRLogComponent', () => {
  let component: ERRLogComponent;
  let fixture: ComponentFixture<ERRLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ERRLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ERRLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
