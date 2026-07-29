import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingEditPage } from './listing-edit-page';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ListingService } from '../../services/listings.service';

const listingData = {
  id: '1',
  brand: 'BMW',
  model: '320d',
  year: 2020,
  price: 10000000,
  mileage: 80000,
  fuel_type: 'Gázolaj',
  description: 'teszt',
};

describe('ListingEditPage', () => {
  let component: ListingEditPage;
  let fixture: ComponentFixture<ListingEditPage>;
  let listingServiceMock: { getListing: ReturnType<typeof vi.fn> };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    listingServiceMock = { getListing: vi.fn() };
    routerMock = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      imports: [ListingEditPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: 1 }) } },
        },
        { provide: ListingService, useValue: listingServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    fixture = TestBed.createComponent(ListingEditPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    listingServiceMock.getListing.mockReturnValue(of(listingData));

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should load listing data into form', () => {
    listingServiceMock.getListing.mockReturnValue(of(listingData));

    fixture.detectChanges();

    expect(component.form.value.brand).toBe('BMW');
  });

  it('should redirect to listings when the listing is not found', () => {
    listingServiceMock.getListing.mockReturnValue(throwError(() => new Error('Not found')));

    fixture.detectChanges();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/listings']);
  });
});
