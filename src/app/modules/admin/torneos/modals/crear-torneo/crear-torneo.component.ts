import { ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-crear-torneo',
    templateUrl: './crear-torneo.component.html',
    styleUrls: ['./crear-torneo.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CrearTorneoComponent implements OnInit {

    torneoForm: FormGroup;

    tipoAccion:any = 'Crear';

    grupos:any = [
        {id: 2},
        {id: 3},
        {id: 4},
        {id: 5},
    ];

    constructor(
        public matDialogRef: MatDialogRef<CrearTorneoComponent>,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.torneoForm = this._formBuilder.group({
            nombre: new FormControl({ value: '', disabled: false },Validators.required),
            tipo: new FormControl({ value: '', disabled: false },Validators.required),
            rama: new FormControl({ value: '', disabled: false },Validators.required),
            modalidad: new FormControl({ value: '', disabled: false },Validators.required),
            grupos: new FormControl({ value: '', disabled: false },Validators.required),
            categoria: new FormControl({ value: '', disabled: false },Validators.required),
        });

        this.tipoAccion = data.accion;
    }

    ngOnInit() {}

    onGrupoChange(){

    }

    crearTorneo(){
        this.matDialogRef.close({crear: true});
    }

    onNoClick(): void {
        this.matDialogRef.close();
    }
}
