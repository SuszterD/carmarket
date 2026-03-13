import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ListingService } from '../../services/listings.service';

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
  ) {}

  submit() {
    console.log(this.form. value);
    this.listingsService.createListing(this.form.value).subscribe();
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
