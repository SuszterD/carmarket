import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingCreatePage } from './listing-create-page';

describe('ListingCreatePage', () => {
  let component: ListingCreatePage;
  let fixture: ComponentFixture<ListingCreatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingCreatePage],
    }).compileComponents();

    fixture = TestBed.createComponent(ListingCreatePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
