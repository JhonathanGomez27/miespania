import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { JugadoresService } from '../../jugadores.service';

@Component({
    selector: 'app-editar-jugador-single',
    templateUrl: './editar-jugador-single.component.html',
    styleUrls: ['./editar-jugador-single.component.scss'],
})
export class EditarJugadorSingleComponent implements OnInit, OnDestroy {

    jugadorForm: FormGroup;

    Toast:any;

    jugador:any = {};

    ramas: any = [];
    categorias: any = [];
    title: any = '';

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        public matDialogRef: MatDialogRef<EditarJugadorSingleComponent>,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _jugadoresService: JugadoresService
    ) {
        this.jugadorForm = this._formBuilder.group({
            nombre: new FormControl({ value: '', disabled: false },Validators.required),
            apellido: new FormControl({ value: '', disabled: false },Validators.required),
            nombre_a_mostrar: new FormControl({ value: '', disabled: false },Validators.required),
            correo:  new FormControl({ value: '', disabled: false }),
            ranking: new FormControl({ value: '', disabled: false },[Validators.pattern("[0-9]*")]),
            rama: new FormControl({ value: '', disabled: false },Validators.required),
            categoria: new FormControl({ value: '', disabled: false },Validators.required),
            categoria_dobles: new FormControl({ value: '', disabled: false },Validators.required),
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

        if(data.editar){
            this.jugador = data.jugador;
            this.title = data.title;
            this.jugadorForm.patchValue(data.jugador);
            this.jugadorForm.get('correo').setValue(data.jugador.userid.correo);
        }
    }

    ngOnInit() {
        // ramas
        this._jugadoresService.ramas$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.ramas = response;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        // categorias
        this._jugadoresService.categorias$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.categorias = response;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    confirmarJugador(){
        if(this.jugadorForm.invalid){
            this.Toast.fire({
                icon: 'error',
                title: "Debe completar todos los campos antes de continuar."
            });

            this.jugadorForm.markAllAsTouched();

            return;
        }

        this.jugadorForm.disable();

        let values = this.jugadorForm.getRawValue();

        if(this.data.editar){
            values.id = this.jugador.userid.id;
            // console.log("editar");
            if(values.correo === '' || values.correo === null){
                delete values.correo;
            }
            // console.log(values);

            this.matDialogRef.close(values);
        }else{
            // console.log("no editar");
            if(values.correo === '' || values.correo === null){
                delete values.correo;
            }
            // console.log(values);
            this.matDialogRef.close(values);
        }
    }

    onNoClick(): void {
        this.matDialogRef.close();
    }
}
