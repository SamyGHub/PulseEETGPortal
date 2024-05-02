import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdinstructComponent } from './prodinstruct.component';

describe('ProdinstructComponent', () => {
  let component: ProdinstructComponent;
  let fixture: ComponentFixture<ProdinstructComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdinstructComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdinstructComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
