import { TestBed } from '@angular/core/testing';
import { NotFound } from './not-found';
import { provideRouter } from '@angular/router';
import { routes } from '../../../app.routes';
import { RouterTestingHarness } from '@angular/router/testing';

describe('NotFound', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
  });

  it('should render for an unknown top-level path', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/nonsense');

    expect(component).toBeInstanceOf(NotFound);
  });

  it('should render for an unknown path under a lazy-loaded feature', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/listings/non/sense');

    expect(component).toBeInstanceOf(NotFound);
  });

  it('should not render for a path that matches a real route', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/login');

    expect(component).not.toBeInstanceOf(NotFound);
  });
});
