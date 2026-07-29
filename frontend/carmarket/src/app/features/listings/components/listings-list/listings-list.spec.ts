import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingsList } from './listings-list';
import { ListingService } from '../../services/listings.service';
import { of, throwError } from 'rxjs';

describe('ListingsList', () => {
  let component: ListingsList;
  let fixture: ComponentFixture<ListingsList>;
  let listingServiceMock: { getListings: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    listingServiceMock = { getListings: vi.fn() };

    TestBed.configureTestingModule({
      imports: [ListingsList],
      providers: [{ provide: ListingService, useValue: listingServiceMock }],
    });

    fixture = TestBed.createComponent(ListingsList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    listingServiceMock.getListings.mockReturnValue(
      of({ items: [], total: 0, page: 1, page_size: 25 }),
    );

    expect(component).toBeTruthy();
  });

  it('should emit loading then success states', () => {
    listingServiceMock.getListings.mockReturnValue(
      of({ items: [{ id: '1', brand: 'BMW' }], total: 1, page: 1, page_size: 25 }),
    );

    const emissions: any[] = [];
    component.listingsState$.subscribe((state) => emissions.push(state));

    expect(emissions[0].loading).toBe(true);
    expect(emissions[1].loading).toBe(false);
    expect(emissions[1].listings.length).toBe(1);
  });

  it('should emit loading then error states', () => {
    listingServiceMock.getListings.mockReturnValue(
      throwError(() => new Error('failed to load listings')),
    );

    const emissions: any[] = [];
    component.listingsState$.subscribe((state) => emissions.push(state));

    expect(emissions[0].loading).toBe(true);
    expect(emissions[1].loading).toBe(false);
    expect(emissions[1].error).toBe(true);
    expect(emissions[1].listings.length).toBe(0);
  });

  it('should emit loading then empty states', () => {
    listingServiceMock.getListings.mockReturnValue(
      of({ items: [], total: 0, page: 1, page_size: 25 }),
    );

    const emissions: any[] = [];
    component.listingsState$.subscribe((state) => emissions.push(state));

    expect(emissions[0].loading).toBe(true);
    expect(emissions[1].loading).toBe(false);
    expect(emissions[1].error).toBe(false);
    expect(emissions[1].listings.length).toBe(0);
  });
});
