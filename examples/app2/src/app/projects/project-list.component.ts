import { Component, EventEmitter, OnInit, DoCheck, HostBinding, inject, ApplicationRef } from '@angular/core';
import { ProjectService } from './projects.service';
import { Router } from '@angular/router';
import { ThyTableRowEvent } from 'ngx-tethys/table';
import { AngularEditor, BaseElementFlavour, withAngular } from 'slate-angular';
import { createEditor, Element } from 'slate';
import { faker } from '@faker-js/faker';

@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    standalone: false
})
export class ProjectListComponent implements OnInit, DoCheck {
    private router = inject(Router);

    private projectService = inject(ProjectService);

    @HostBinding('class') class = 'thy-layout';

    editor = withAngular(createEditor());

    value = buildInitialValue();

    click = new EventEmitter<any>();

    projects: any[];

    loadingDone: boolean;

    search: string;

    ngOnInit() {
        this.getProjects();
    }

    getProjects() {
        this.loadingDone = false;
        setTimeout(() => {
            this.projects = this.projectService.getProjects();
            this.loadingDone = true;
        }, 500);
    }

    openDetail(event: ThyTableRowEvent) {
        this.router.navigateByUrl(`/app2/projects/${event.row.id}`);
        this.click.emit();
        // this.dialog.open(ProjectDetailComponent, {
        //     hasBackdrop: true,
        //     backdropClosable: true,
        //     closeOnNavigation: true
        // });
    }

    ngDoCheck() {
        // this.applicationRef.tick();
        // console.log(window['appRef'] === this.applicationRef);
    }

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
