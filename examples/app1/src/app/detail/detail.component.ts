import { Component, inject } from '@angular/core';
import { ThyDialogRef } from 'ngx-tethys/dialog';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    standalone: false
})
export class App1DetailComponent {
    private dialogRef = inject<ThyDialogRef<App1DetailComponent>>(ThyDialogRef);

    constructor() {}

    ok() {
        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }
}
