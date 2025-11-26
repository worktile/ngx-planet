import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { ThyDialog } from 'ngx-tethys/dialog';
import { ADetailComponent } from '../a-detail/a-detail.component';
import { AppRootContext } from '@demo/common';
import { faker } from '@faker-js/faker';
import { createEditor, Element } from 'slate';
import { AngularEditor, BaseElementFlavour, withAngular } from 'slate-angular';
import { TheDataMode, TheOptions } from '@worktile/theia';

@Component({
    selector: 'app-theia',
    templateUrl: './theia.component.html',
    standalone: false
})
export class AppTheiaComponent implements OnInit {
    @HostBinding(`class.thy-layout-content`) isThyLayoutContent = true;

    options: TheOptions = {
        readonly: true,
        disabled: false,
        mode: TheDataMode.json,
        placeholder: '输入/快速插入内容',
        inlineToolbarVisible: true,
        scrollContainer: '.thy-layout-content',
        autoFocus: true,
        autoNormalize: true,
        richMedia: true
    };

    constructor(
        private router: Router,
        private thyDialog: ThyDialog,
        public appRootContext: AppRootContext
    ) {}

    ngOnInit() {}

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
