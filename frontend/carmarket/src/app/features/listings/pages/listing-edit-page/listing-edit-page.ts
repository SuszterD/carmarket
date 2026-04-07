import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { ListingService } from '../../services/listings.service';

@Component({
  selector: 'app-listing-edit-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './listing-edit-page.html',
  styleUrl: './listing-edit-page.css',
})
export class ListingEditPage {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private listingService: ListingService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', Validators.required],
      price: ['', Validators.required],
      mileage: ['', Validators.required],
      fuel_type: ['', Validators.required],
      description: ['', Validators.required],
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.listingService.getListing(id).subscribe((listing) => {
      this.form.patchValue(listing);
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
