import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTreeComponent } from './test-tree.component';

describe('TestTreeComponent', () => {
  let component: TestTreeComponent;
  let fixture: ComponentFixture<TestTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestTreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
