import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListingCard } from './listing-card';
import { BehaviorSubject } from 'rxjs';
import { Auth, User } from '../../../../core/auth.service';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';

describe('ListingCard', () => {
  let component: ListingCard;
  let fixture: ComponentFixture<ListingCard>;
  let authServiceMock: { currentUser$: BehaviorSubject<User | null> };

  beforeEach(async () => {
    authServiceMock = {
      currentUser$: new BehaviorSubject<User | null>({
        id: '1',
        username: 'testuser',
        email: 'testuser@example.com',
        created_at: '2026-01-01',
      }),
    };
    await TestBed.configureTestingModule({
      imports: [ListingCard],
      providers: [{ provide: Auth, useValue: authServiceMock }, provideRouter([])],
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

  it('should link to the detail page for this listing', () => {
    const link = fixture.debugElement.query(By.directive(RouterLink));
    const routerLink = link.injector.get(RouterLink);

    expect((routerLink as any).routerLinkInput()).toEqual(['/listings', '1']);
  });

  it('should show the owner badge when the user owns the listing', () => {
    expect(fixture.nativeElement.querySelector('.badge--owner')).toBeTruthy();
  });

  it('should not show the owner badge when the user doesnt own the listing', () => {
    authServiceMock.currentUser$.next({
      id: '2',
      username: 'testuser',
      email: 'testuser@example.com',
      created_at: '2026-01-01',
    });

    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelectorAll('.badge--owner');

    expect(badge).toHaveLength(0);
  });
});
