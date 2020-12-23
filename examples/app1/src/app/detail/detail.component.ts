import { Component } from '@angular/core';
import { ThyDialogRef } from 'ngx-tethys/dialog';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html'
})
export class App1DetailComponent {
    constructor(private dialogRef: ThyDialogRef<App1DetailComponent>) {}

    ok() {
        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }
}
