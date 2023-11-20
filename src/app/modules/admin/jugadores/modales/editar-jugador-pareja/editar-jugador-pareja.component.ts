import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-editar-jugador-pareja',
    templateUrl: './editar-jugador-pareja.component.html',
    styleUrls: ['./editar-jugador-pareja.component.scss'],
})
export class EditarJugadorParejaComponent implements OnInit {

    parejaForm: FormGroup;

    tipoAccion: any = 'Crear';

    Toast:any;

    constructor(
        public matDialogRef: MatDialogRef<EditarJugadorParejaComponent>,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
        this.parejaForm = this._formBuilder.group({
            jugadorUno: new FormControl({ value: '', disabled: false },Validators.required),
            jugadorDos: new FormControl({ value: '', disabled: false },Validators.required),
            ranking: new FormControl({ value: '', disabled: false },[Validators.required, Validators.pattern("[0-9]*")]),
            rama: new FormControl({ value: '', disabled: false },Validators.required),
            categoria: new FormControl({ value: '', disabled: false },Validators.required),
        });

        this.Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
        });

        this.tipoAccion = data.accion;
    }

    ngOnInit() {}

    confirmar(){
        if(this.parejaForm.invalid){
            this.Toast.fire({
                icon: 'error',
                title: "Debe completar todos los campos antes de continuar."
            });

            return;
        }
    }

    onNoClick(): void {
        this.matDialogRef.close();
    }
}
