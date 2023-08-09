import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routeRedirect } from './route-redirect';
import { BehaviorSubject } from 'rxjs';

describe('route-redirect', () => {
    it('should redirect to success', async () => {
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
        const router = TestBed.inject(Router);
        const activatedComponent = await harness.navigateByUrl('/');
        expect(activatedComponent).toBeInstanceOf(HelloComponent);
        expect(harness.routeNativeElement?.innerHTML).toContain('hello world');
    });
});
