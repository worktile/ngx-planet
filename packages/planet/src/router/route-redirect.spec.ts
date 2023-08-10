import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterOutlet, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routeRedirect, redirectToRoute } from './route-redirect';

describe('route-redirect', () => {
    it('should redirect to success use redirectToRoute', async () => {
        @Component({ standalone: true, template: '<router-outlet></router-outlet>', imports: [RouterOutlet] })
        class TestComponent {}

        @Component({ standalone: true, template: 'hello world' })
        class HelloComponent {}

        TestBed.configureTestingModule({
            providers: [
                provideRouter([
                    {
                        path: 'app1',
                        component: TestComponent,
                        children: [redirectToRoute('hello'), { path: 'hello', component: HelloComponent }]
                    }
                ])
            ]
        });

        const harness = await RouterTestingHarness.create();
        const activatedComponent = await harness.navigateByUrl('/app1');
        expect(activatedComponent).toBeInstanceOf(TestComponent);
        expect(harness.routeNativeElement?.innerHTML).toContain('hello world');
    });

    it('should redirect to success use routeRedirect', async () => {
        @Component({ standalone: true, template: '' })
        class TestComponent {
            routeRedirect = routeRedirect('hello');
        }

        @Component({ standalone: true, template: 'hello world' })
        class HelloComponent {}

        TestBed.configureTestingModule({
            providers: [
                provideRouter([
                    { path: '', component: TestComponent },
                    { path: 'hello', component: HelloComponent }
                ])
            ]
        });

        const harness = await RouterTestingHarness.create();
        const activatedComponent = await harness.navigateByUrl('/');
        expect(activatedComponent).toBeInstanceOf(HelloComponent);
        expect(harness.routeNativeElement?.innerHTML).toContain('hello world');
    });
});
