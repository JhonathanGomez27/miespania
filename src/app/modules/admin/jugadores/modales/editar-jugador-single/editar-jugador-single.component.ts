import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-editar-jugador-single',
    templateUrl: './editar-jugador-single.component.html',
    styleUrls: ['./editar-jugador-single.component.scss'],
})
export class EditarJugadorSingleComponent implements OnInit {

    jugadorForm: FormGroup;

    Toast:any;

    constructor(
        public matDialogRef: MatDialogRef<EditarJugadorSingleComponent>,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
        this.jugadorForm = this._formBuilder.group({
            nombre: new FormControl({ value: '', disabled: false },Validators.required),
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
    }

    ngOnInit() {}

    confirmarJugador(){
        if(this.jugadorForm.invalid){
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
