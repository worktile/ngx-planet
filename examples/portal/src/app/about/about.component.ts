import { Component, OnInit, HostBinding, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ThyDialog } from 'ngx-tethys/dialog';
import { ADetailComponent } from '../a-detail/a-detail.component';
import { AppRootContext } from '@demo/common';
import { faker } from '@faker-js/faker';
import { createEditor, Element } from 'slate';
import { AngularEditor, BaseElementFlavour, SlateModule, withAngular } from 'slate-angular';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    standalone: false
})
export class AboutComponent implements OnInit {
    private router = inject(Router);
    private thyDialog = inject(ThyDialog);
    appRootContext = inject(AppRootContext);

    @HostBinding(`class.thy-layout-content`) isThyLayoutContent = true;

    constructor() {}

    ngOnInit() {}

    toApp2Dashboard() {
        this.router.navigateByUrl(`/app2/dashboard`);
    }

    openADetail() {
        this.thyDialog.open(ADetailComponent);
    }

    editor = withAngular(createEditor());

    value = buildInitialValue();

    renderElement() {
        return (element: any) => {
            if (element.type === 'heading-one') {
                return H1Flavour;
            }
            return null;
        };
    }
}

export const buildInitialValue = () => {
    const HEADINGS = 2000;
    const PARAGRAPHS = 7;
    const initialValue = [];

    for (let h = 0; h < HEADINGS; h++) {
        initialValue.push({
            type: 'heading-one',
            children: [{ text: faker.lorem.sentence() }]
        });

        for (let p = 0; p < PARAGRAPHS; p++) {
            initialValue.push({
                type: 'paragraph',
                children: [{ text: faker.lorem.paragraph() }]
            });
        }
    }
    return initialValue;
};

export class H1Flavour<T extends Element = Element, K extends AngularEditor = AngularEditor> extends BaseElementFlavour<T, K> {
    render() {
        const nativeElement = document.createElement('h1');
        this.nativeElement = nativeElement;
    }

    rerender() {
        // No-op
    }
}
