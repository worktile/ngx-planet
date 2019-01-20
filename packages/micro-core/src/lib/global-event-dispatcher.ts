import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Injectable, NgZone } from '@angular/core';

export interface GlobalDispatcherEvent {
    name: string;
    payload: any;
}

@Injectable()
export class GlobalEventDispatcher {
    private subject$: Subject<GlobalDispatcherEvent> = new Subject();

    constructor(private ngZone: NgZone) {}

    dispatch(name: string, payload?: any) {
        this.subject$.next({
            name: name,
            payload: payload
        });
    }

    register(eventName: string): Observable<any> {
        return Observable.create(observer => {
            const subscription = this.subject$
                .pipe(
                    filter(event => {
                        return event.name === eventName;
                    }),
                    map(event => {
                        return event.payload;
                    })
                )
                .subscribe(payload => {
                    this.ngZone.run(() => {
                        observer.next(payload);
                    });
                });
            return () => {
                subscription.unsubscribe();
            };
        });
    }
}
