import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-listing-create-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './listing-create-page.html',
  styleUrl: './listing-create-page.css',
})
export class ListingCreatePage {
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

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
