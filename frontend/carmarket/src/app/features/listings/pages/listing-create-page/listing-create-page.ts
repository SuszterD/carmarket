import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ListingService } from '../../services/listings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listing-create-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './listing-create-page.html',
  styleUrl: './listing-create-page.css',
})
export class ListingCreatePage {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private listingsService: ListingService,
    private router: Router,
  ) {}

  submit() {
    if (this.form.invalid) return;

    this.listingsService.createListing(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/listings']);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  ngOnInit() {
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
}
