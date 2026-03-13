import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
  ) {
    this.form = this.fb.group({
      brand: [''],
      model: [''],
      year: [''],
      price: [''],
      mileage: [''],
      fuel_type: [''],
      description: [''],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.listingService.getListing(id).subscribe((listing) => {
      this.form.patchValue(listing);
    });
  }

  submit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.listingService.updateListing(id, this.form.value).subscribe(() => {
      this.router.navigate(['/listings']);
    });
  }
}
