import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { ListingService } from '../../services/listings.service';
import { FUEL_TYPES, CAR_LISTING_BOUNDS, maxYear } from '../../models/car-listing.model';

@Component({
  selector: 'app-listing-edit-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './listing-edit-page.html',
  styleUrl: './listing-edit-page.css',
})
export class ListingEditPage {
  form!: FormGroup;
  fuelTypes = FUEL_TYPES;

  constructor(
    private fb: FormBuilder,
    private listingService: ListingService,
    private route: ActivatedRoute,
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

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.listingService.getListing(id).subscribe({
      next: (listing) => {
        this.form.patchValue(listing);
      },
      error: () => {
        this.router.navigate(['/listings']);
      },
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.listingService.updateListing(id, this.form.value).subscribe(() => {
      this.router.navigate(['/listings']);
    });
  }

  goBack() {
    this.location.back();
  }
}
