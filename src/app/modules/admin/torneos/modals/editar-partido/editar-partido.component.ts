import { ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-editar-partido',
    templateUrl: './editar-partido.component.html',
    styleUrls: ['./editar-partido.component.scss'],
})
export class EditarPartidoComponent implements OnInit {

    constructor(
        public matDialogRef: MatDialogRef<EditarPartidoComponent>,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {}

    ngOnInit() {}

    confirmar(){

    }

    onNoClick(): void {
        this.matDialogRef.close();
    }
}
