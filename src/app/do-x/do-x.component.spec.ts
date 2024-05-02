import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoXComponent } from './do-x.component';

describe('DoXComponent', () => {
  let component: DoXComponent;
  let fixture: ComponentFixture<DoXComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoXComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
