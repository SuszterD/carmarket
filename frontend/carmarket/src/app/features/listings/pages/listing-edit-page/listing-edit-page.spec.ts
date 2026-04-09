import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingEditPage } from './listing-edit-page';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { ListingService } from '../../services/listings.service';

const listingServiceMock = {
  getListing: () =>
    of({
      id: '1',
      brand: 'BMW',
      model: '320d',
      year: 2020,
      price: 10000000,
      mileage: 80000,
      fuel_type: 'diesel',
      description: 'teszt',
    }),
};

describe('ListingEditPage', () => {
  let component: ListingEditPage;
  let fixture: ComponentFixture<ListingEditPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingEditPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: 1 }),
            },
          },
        },
        { provide: ListingService, useValue: listingServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListingEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load listing data into form', () => {
    expect(component.form.value.brand).toBe('BMW');
  });
});
