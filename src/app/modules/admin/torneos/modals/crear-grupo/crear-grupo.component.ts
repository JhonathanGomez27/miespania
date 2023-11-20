import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'app-crear-grupo',
    templateUrl: './crear-grupo.component.html',
    styleUrls: ['./crear-grupo.component.scss'],
})
export class CrearGrupoComponent implements OnInit {

    tipoAccion:any = 'Crear';

    public jugadoresFiltroCtrl: FormControl = new FormControl();
    public filteredJugadores: ReplaySubject<any[]> = new ReplaySubject<any[]>(null);

    constructor(
        public matDialogRef: MatDialogRef<CrearGrupoComponent>,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.tipoAccion = data.accion;
    }

    ngOnInit(): void {}

    onNoClick(): void {
        this.matDialogRef.close();
    }
}
