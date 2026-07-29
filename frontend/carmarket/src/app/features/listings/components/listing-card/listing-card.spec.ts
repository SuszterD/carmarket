import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListingCard } from './listing-card';
import { of } from 'rxjs';
import { ListingService } from '../../services/listings.service';
import { Auth } from '../../../../core/auth.service';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';

describe('ListingCard', () => {
  let component: ListingCard;
  let fixture: ComponentFixture<ListingCard>;

  const listingServiceMock = {
    deleteListing: vi.fn(() => of(void 0)),
  };

  const authServiceMock = {
    currentUser$: of({
      id: '1',
      username: 'testuser',
      email: 'testuser@example.com',
      created_at: '2026-01-01',
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingCard],
      providers: [
        { provide: ListingService, useValue: listingServiceMock },
        { provide: Auth, useValue: authServiceMock },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListingCard);
    component = fixture.componentInstance;

    component.listing = {
      id: '1',
      user_id: '1',
      brand: 'BMW',
      model: '320d',
      year: 2020,
      price: 10000000,
      mileage: 80000,
      fuel_type: 'Gázolaj',
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

  it('should link to the edit page for this listing', () => {
    const editLink = fixture.debugElement.query(By.directive(RouterLink));
    const routerLink = editLink.injector.get(RouterLink);

    expect((routerLink as any).routerLinkInput()).toEqual(['/listings/edit', '1']);
  });
});
