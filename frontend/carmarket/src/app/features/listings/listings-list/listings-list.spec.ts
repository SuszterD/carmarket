import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingsList } from './listings-list';

describe('ListingsList', () => {
  let component: ListingsList;
  let fixture: ComponentFixture<ListingsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingsList],
    }).compileComponents();

    fixture = TestBed.createComponent(ListingsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
