import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListingDetailPage } from './listing-detail-page';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { ListingService } from '../../services/listings.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { Auth, User } from '../../../../core/auth.service';

const listingData = {
  id: '1',
  user_id: '1',
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
  let listingServiceMock: {
    getListing: ReturnType<typeof vi.fn>;
    deleteListing: ReturnType<typeof vi.fn>;
  };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };
  let authServiceMock: { currentUser$: BehaviorSubject<User | null> };

  beforeEach(() => {
    listingServiceMock = { getListing: vi.fn(), deleteListing: vi.fn(() => of(void 0)) };
    routerMock = { navigate: vi.fn() };
    authServiceMock = {
      currentUser$: new BehaviorSubject<User | null>({
        id: '1',
        username: 'testuser',
        email: 'testuser@example.com',
        created_at: '2026-01-01',
      }),
    };
    TestBed.configureTestingModule({
      imports: [ListingDetailPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } },
        },
        { provide: ListingService, useValue: listingServiceMock },
        { provide: Auth, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
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

  it('should show the owner actions when the user owns the listing', () => {
    listingServiceMock.getListing.mockReturnValue(of(listingData));

    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.detail-actions button');

    expect(buttons).toHaveLength(2);
  });

  it('should not show the owner actions when the user doesnt own the listing', () => {
    listingServiceMock.getListing.mockReturnValue(of(listingData));
    authServiceMock.currentUser$.next({
      id: '2',
      username: 'testuser',
      email: 'testuser@example.com',
      created_at: '2026-01-01',
    });

    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.detail-actions button');

    expect(buttons).toHaveLength(0);
  });

  it('should delete the listing and navigate away', () => {
    listingServiceMock.getListing.mockReturnValue(of(listingData));
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    fixture.detectChanges();
    component.deleteListing();

    expect(listingServiceMock.deleteListing).toHaveBeenCalledWith('1');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/listings']);
  });
});
