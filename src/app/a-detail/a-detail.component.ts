import { Component } from '@angular/core';
import { ThyDialogRef } from 'ngx-tethys/dialog';

@Component({
    selector: 'app-a-detail',
    templateUrl: './a-detail.component.html'
})
export class ADetailComponent {
    constructor(private dialogRef: ThyDialogRef<ADetailComponent>) {}

    ok() {
        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }
}
