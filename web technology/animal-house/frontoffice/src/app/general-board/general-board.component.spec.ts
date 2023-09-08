import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralBoardComponent } from './general-board.component';

describe('GeneralBoardComponent', () => {
  let component: GeneralBoardComponent;
  let fixture: ComponentFixture<GeneralBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
