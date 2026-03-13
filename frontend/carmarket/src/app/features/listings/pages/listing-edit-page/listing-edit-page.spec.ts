import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingEditPage } from './listing-edit-page';

describe('ListingEditPage', () => {
  let component: ListingEditPage;
  let fixture: ComponentFixture<ListingEditPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingEditPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ListingEditPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
