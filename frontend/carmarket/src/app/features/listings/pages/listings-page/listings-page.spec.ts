import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ListingsPage } from './listings-page';

describe('ListingsPage', () => {
  let component: ListingsPage;
  let fixture: ComponentFixture<ListingsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingsPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of([{ id: 1 }]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('CarMarket - Hirdetések');
  });
});
