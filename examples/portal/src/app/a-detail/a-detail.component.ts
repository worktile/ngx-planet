import { Component, inject } from '@angular/core';
import { ThyDialogRef } from 'ngx-tethys/dialog';

@Component({
    selector: 'app-a-detail',
    templateUrl: './a-detail.component.html',
    standalone: false
})
export class ADetailComponent {
    private dialogRef = inject<ThyDialogRef<ADetailComponent>>(ThyDialogRef);

    constructor() {}

    ok() {
        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }
}
