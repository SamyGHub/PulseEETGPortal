import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurtransactionsComponent } from './purtransactions.component';

describe('PurtransactionsComponent', () => {
  let component: PurtransactionsComponent;
  let fixture: ComponentFixture<PurtransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurtransactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurtransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
