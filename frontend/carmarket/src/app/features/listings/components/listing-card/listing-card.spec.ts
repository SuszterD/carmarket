import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingCard } from './listing-card';
import { of } from 'rxjs';
import { ListingService } from '../../services/listings.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListingCard', () => {
  let component: ListingCard;
  let fixture: ComponentFixture<ListingCard>;

  const listingServiceMock = {
    deleteListing: vi.fn(() => of(void 0)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingCard, RouterTestingModule],
      providers: [{ provide: ListingService, useValue: listingServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ListingCard);
    component = fixture.componentInstance;

    component.listing = {
      id: '1',
      brand: 'BMW',
      model: '320d',
      year: 2020,
      price: 10000000,
      mileage: 80000,
      fuel_type: 'diesel',
      description: 'teszt',
    } as any;

    fixture.detectChanges();

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call deleteListing when delete is triggered', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.deleteListing();
    expect(listingServiceMock.deleteListing).toHaveBeenCalled();
  });
});
