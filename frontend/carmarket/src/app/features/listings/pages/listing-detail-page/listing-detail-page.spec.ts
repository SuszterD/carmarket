import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingDetailPage } from './listing-detail-page';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ListingService } from '../../services/listings.service';
import { of, throwError } from 'rxjs';

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

describe('ListingDetailPage', () => {
  let component: ListingDetailPage;
  let fixture: ComponentFixture<ListingDetailPage>;
  let listingServiceMock: { getListing: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    listingServiceMock = { getListing: vi.fn() };

    TestBed.configureTestingModule({
      imports: [ListingDetailPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: 1 }) } },
        },
        { provide: ListingService, useValue: listingServiceMock },
      ],
    });

    fixture = TestBed.createComponent(ListingDetailPage);
    component = fixture.componentInstance;
  });

  it('should show the listing when it loads', () => {
    listingServiceMock.getListing.mockReturnValue(of(listingData));

    fixture.detectChanges();

    expect(component.listing()).toEqual(listingData);
    expect(component.loading()).toBe(false);
    expect(component.notFound()).toBe(false);
  });

  it('should show 404 page on error', () => {
    listingServiceMock.getListing.mockReturnValue(throwError(() => new Error('Not found')));

    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.notFound()).toBe(true);
    expect(component.listing()).toBeUndefined();
    expect(fixture.nativeElement.querySelector('app-not-found')).toBeTruthy();
  });
});
