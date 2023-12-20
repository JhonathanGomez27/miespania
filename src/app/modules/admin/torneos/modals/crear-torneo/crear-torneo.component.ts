import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TorneosService } from '../../torneos.service';
import { Subject, takeUntil } from 'rxjs';
import { setValue } from '@ngneat/transloco';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-crear-torneo',
    templateUrl: './crear-torneo.component.html',
    styleUrls: ['./crear-torneo.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CrearTorneoComponent implements OnInit, OnDestroy {

    torneoForm: FormGroup;

    tipoAccion:any = 'Crear';

    sets: any = [
        {id: 1, sets: {sets_ganar: 1, sets_totales: 1}},
        {id: 2, sets: {sets_ganar: 2, sets_totales: 3}},
        {id: 3, sets: {sets_ganar: 3, sets_totales: 5}}
    ]

    valuesSet: any = {};

    ramas: any = [];
    tipos: any = [];
    modalidades: any = [];
    categorias: any = [];
    fases: any = [];

    mostrarJornadas: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    Toast: typeof Swal;

    torneo: any = {};

    constructor(
        public matDialogRef: MatDialogRef<CrearTorneoComponent>,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _torneoService: TorneosService,
    ) {
        this.torneoForm = this._formBuilder.group({
            nombre: new FormControl({ value: '', disabled: false },Validators.required),
            tipo_torneo: new FormControl({ value: '', disabled: false },Validators.required),
            rama: new FormControl({ value: '', disabled: false },Validators.required),
            modalidad: new FormControl({ value: '', disabled: false },Validators.required),
            cantidad_grupos: new FormControl({ value: 2, disabled: false },[Validators.required]),
            categoria: new FormControl({ value: '', disabled: false },Validators.required),
            cantidad_jornadas_regulares: new FormControl({ value: 1, disabled: true },Validators.required),
            cantidad_jornadas_cruzadas: new FormControl({ value: 1, disabled: true },Validators.required),
        });

        this.tipoAccion = data.accion;

        if(data.accion === 'Editar'){
            this.torneoForm.get('modalidad').disable();
            this.torneo = data.torneo;
        }

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

    ngOnInit() {
        // ramas
        this._torneoService.ramas$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.ramas = response;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        // tipos
        this._torneoService.tipos$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.tipos = response;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        // modalidades
        this._torneoService.modalidades$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.modalidades = response;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        // categorias
        this._torneoService.categorias$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.categorias = response;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        // fases
        this._torneoService.fases$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.fases = response;

            response.forEach(element => {
                this.valuesSet[element.nombre] = 1;
            });

            if(this.tipoAccion === 'Editar'){
                this.torneoForm.patchValue(this.torneo);
                this.ordenarFasesEditar(this.torneo.configuracion_sets);
                this.tipoTorneoChange({value: this.torneo.tipo_torneo})
            }
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

    onGrupoChange(){

    }

    crearTorneo(){
        // this.matDialogRef.close({crear: true});

        if(this.torneoForm.invalid){
            this.Toast.fire({
                icon: 'error',
                title: 'Complete todos los campos del torneo para continuar.'
            });

            this.torneoForm.markAllAsTouched();
        }

        let data = this.torneoForm.getRawValue();

        if(data.cantidad_jornadas_cruzadas > data.cantidad_jornadas_regulares){
            this.Toast.fire({
                icon: 'error',
                title: 'La cantidad de jornadas cruzadas no debe ser mayor a las jornadas regulares.'
            });
            return;
        }

        let configuracion_sets:any = {}

        for (const [key, value] of Object.entries(this.valuesSet)) {
            configuracion_sets[key] = this.getFasePorId(value);
        }

        let values = {...this.torneoForm.getRawValue(), configuracion_sets: configuracion_sets};

        if(values.tipo_torneo === 'regular'){
            delete values.jornadas;
        }

        values.fase_actual = 'grupos';

        // console.log(values);

        this.matDialogRef.close(values);
    }

    tipoTorneoChange(event:any){
        if(event.value === 'escalera'){
            this.mostrarJornadas = true;
            this.torneoForm.get('cantidad_jornadas_cruzadas').enable();
            this.torneoForm.get('cantidad_jornadas_regulares').enable();
        }else{
            this.mostrarJornadas = false;
            this.torneoForm.get('cantidad_jornadas_cruzadas').disable();
            this.torneoForm.get('cantidad_jornadas_regulares').disable();
        }

        this._changeDetectorRef.markForCheck();
    }

    getFasePorId(id:any){
        let value:any = {}
        this.sets.forEach(set => {
            if(set.id === id){
                value = set.sets;
            }
        });

        return value;
    }

    ordenarFasesEditar(fases: any){
        for (const [key, value] of Object.entries(fases)) {
            let sets: any = value;
            this.valuesSet[key] = sets.sets_ganar;
        }

        this._changeDetectorRef.markForCheck();
    }

    onNoClick(): void {
        this.matDialogRef.close();
    }
}
