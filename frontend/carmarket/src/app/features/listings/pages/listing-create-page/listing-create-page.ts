import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListingService } from '../../services/listings.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FUEL_TYPES, CAR_LISTING_BOUNDS, maxYear } from '../../models/car-listing.model';

@Component({
  selector: 'app-listing-create-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './listing-create-page.html',
  styleUrl: './listing-create-page.css',
})
export class ListingCreatePage {
  form!: FormGroup;
  fuelTypes = FUEL_TYPES;

  constructor(
    private fb: FormBuilder,
    private listingsService: ListingService,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      brand: ['', [Validators.required, Validators.maxLength(CAR_LISTING_BOUNDS.brand.maxLength)]],
      model: ['', [Validators.required, Validators.maxLength(CAR_LISTING_BOUNDS.model.maxLength)]],
      year: [
        '',
        [
          Validators.required,
          Validators.min(CAR_LISTING_BOUNDS.year.min),
          Validators.max(maxYear()),
        ],
      ],
      price: [
        '',
        [
          Validators.required,
          Validators.min(CAR_LISTING_BOUNDS.price.min),
          Validators.max(CAR_LISTING_BOUNDS.price.max),
        ],
      ],
      mileage: [
        '',
        [
          Validators.required,
          Validators.min(CAR_LISTING_BOUNDS.mileage.min),
          Validators.max(CAR_LISTING_BOUNDS.mileage.max),
        ],
      ],
      fuel_type: ['', Validators.required],
      description: [
        '',
        [Validators.required, Validators.maxLength(CAR_LISTING_BOUNDS.description.maxLength)],
      ],
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.listingsService.createListing(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/listings']);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  goBack() {
    this.location.back();
  }

  errorFor(field: string): string | null {
    const control = this.form.get(field);
    if (!control || control.valid || !control.touched) return null;

    const errors = control.errors ?? {};
    if (errors['required']) return 'A mező kitöltése kötelező.';
    if (errors['maxlength']) return `Legfeljebb ${errors['maxlength'].requiredLength} karakter.`;
    if (errors['min']) return `Nem lehet kevesebb, mint ${errors['min'].min}.`;
    if (errors['max']) return `Nem lehet több, mint ${errors['max'].max}.`;
    return null;
  }
}
