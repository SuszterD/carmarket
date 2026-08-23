import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListingCreatePage } from './listing-create-page';
import { ListingService } from '../../services/listings.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { of, throwError } from 'rxjs';

const formData = {
  brand: 'test',
  model: 'test',
  year: 1900,
  price: 0,
  mileage: 0,
  fuel_type: 'Benzin',
  description: 'test',
};

describe('ListingCreatePage', () => {
  let component: ListingCreatePage;
  let fixture: ComponentFixture<ListingCreatePage>;
  let listingServiceMock: { createListing: ReturnType<typeof vi.fn> };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };
  let locationMock: { back: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    listingServiceMock = { createListing: vi.fn() };
    routerMock = { navigate: vi.fn() };
    locationMock = { back: vi.fn() };

    TestBed.configureTestingModule({
      imports: [ListingCreatePage],
      providers: [
        { provide: ListingService, useValue: listingServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: Location, useValue: locationMock },
      ],
    });

    fixture = TestBed.createComponent(ListingCreatePage);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call createListing when form is invalid', () => {
    component.submit();

    expect(listingServiceMock.createListing).not.toHaveBeenCalled();
  });

  it('should show a required message on the brand field after submitting an empty form', () => {
    component.submit();
    fixture.detectChanges();

    const brandError = fixture.nativeElement
      .querySelector('#brand')
      .closest('.form-field')
      .querySelector('.error-message');

    expect(brandError?.textContent).toContain('kötelező');
  });

  it('should show a max length message when brand exceeds 50 characters', () => {
    component.form.get('brand')!.setValue('a'.repeat(51));
    component.form.get('brand')!.markAsTouched();
    fixture.detectChanges();

    const brandError = fixture.nativeElement
      .querySelector('#brand')
      .closest('.form-field')
      .querySelector('.error-message');

    expect(brandError?.textContent).toContain('Legfeljebb 50 karakter');
  });

  it('should show no error message when the form is valid', () => {
    component.form.setValue(formData);
    component.form.markAllAsTouched();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.error-message').length).toBe(0);
  });

  it('should create listing and navigate to /listings', () => {
    component.form.setValue(formData);
    listingServiceMock.createListing.mockReturnValue(
      of({
        user_id: '1',
        id: '1',
        brand: 'test',
        model: 'test',
        year: 1900,
        price: 0,
        mileage: 0,
        fuel_type: 'Benzin',
        description: 'test',
        created_at: '2026-01-01',
      }),
    );

    component.submit();

    expect(listingServiceMock.createListing).toHaveBeenCalledWith(formData);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/listings']);
  });

  it('should not redirect when createListing fails', () => {
    component.form.setValue(formData);
    listingServiceMock.createListing.mockReturnValue(
      throwError(() => new Error('failed to create listing')),
    );

    component.submit();

    expect(routerMock.navigate).not.toHaveBeenCalledWith(['/listings']);
  });
});
