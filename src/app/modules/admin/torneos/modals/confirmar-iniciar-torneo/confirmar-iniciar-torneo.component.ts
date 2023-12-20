import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-confirmar-iniciar-torneo',
    templateUrl: './confirmar-iniciar-torneo.component.html',
    styleUrls: ['./confirmar-iniciar-torneo.component.scss'],
})
export class ConfirmarIniciarTorneoComponent implements OnInit {

    inscritos: number = 0;
    torneo: any = {};

    formarGrupos: FormControl = new FormControl(false);

    tipoTorneo: any = '';

    constructor(
        public matDialogRef: MatDialogRef<ConfirmarIniciarTorneoComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.inscritos = data.inscritos;
        this.torneo = data.torneo;
        this.tipoTorneo = data.tipoTorneo;
        if(this.tipoTorneo === 'escalera'){
            this.formarGrupos.setValue(true);
        }
    }

    ngOnInit() {}

    confirmar(){
        this.matDialogRef.close({formar: this.formarGrupos.value})
    }

    onNoClick(): void {
        this.matDialogRef.close();
    }
}
