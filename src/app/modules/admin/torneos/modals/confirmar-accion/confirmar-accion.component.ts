import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-confirmar-accion',
    templateUrl: './confirmar-accion.component.html',
    styleUrls: ['./confirmar-accion.component.scss'],
})
export class ConfirmarAccionComponent implements OnInit {

    mensaje: string = '';

    constructor(
        public matDialogRef: MatDialogRef<ConfirmarAccionComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.mensaje = data.mensaje;
    }

    ngOnInit() {}

    confirmar(){
        this.matDialogRef.close(true);
    }

    onNoClick(): void {
        this.matDialogRef.close();
    }
}
