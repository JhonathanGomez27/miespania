import { ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-editar-partido',
    templateUrl: './editar-partido.component.html',
    styleUrls: ['./editar-partido.component.scss'],
})
export class EditarPartidoComponent implements OnInit {

    etapa: any = '';

    sets: any = {};

    partido:any = {};

    puntos: any = [];

    modalidad: any = '';
    Toast: any;

    tipoJugador: string = '';
    tipoJugador2: string = '';

    disableInputs: boolean = false;
    disableInputs2: boolean = false;

    disableShow: boolean = false;

    faseActual: any = '';

    constructor(
        public matDialogRef: MatDialogRef<EditarPartidoComponent>,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.etapa = data.etapa;
        this.sets =data.sets;
        this.partido = data.partido;
        this.faseActual = data.faseActual;

        if(this.faseActual !== this.etapa || data.estado === 'Finalizado'){
            this.disableInputs = true;
            this.disableInputs2 = true;
            this.disableShow = true;
        }

        this.tipoJugador = data.tipoJugador1;
        this.tipoJugador2 = data.tipoJugador2;

        if(this.partido.resultado !== null){
            this.ordenarPuntosEditar();
        }else{
            this.ordenarPuntos();
        }

        if(data.modalidad === 'singles'){
            this.modalidad = 'jugador';
        }else{
            this.modalidad = 'pareja';
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

    ngOnInit() {}

    ordenarPuntos(){
        for (let index = 0; index < this.sets.sets_totales; index++) {
            let data = {jugador1: 0, jugador2: 0};

            if(!this.partido[this,this.tipoJugador].nombre){
                data = {jugador1: 0, jugador2: 1};
                this.disableInputs = true;
            }

            if(!this.partido[this,this.tipoJugador2].nombre){
                data = {jugador1: 1, jugador2: 0};
                this.disableInputs2 = true;
            }

            this.puntos.push(data);
        }
    }

    ordenarPuntosEditar(){
        this.partido.resultado.sets.forEach(element => {
            let puntos = element.marcador.split('-');
            this.puntos.push({jugador1: parseInt(puntos[0]), jugador2: parseInt(puntos[1])});
        });
    }

    confirmar(){
        let valid = false;

        valid = this.validarSets();

        // console.log(this.determinarGanador());

        if(valid){
            this.matDialogRef.close(this.determinarGanador());
        }
    }

    validarSets(){

        let valid = false;
        let puntos1 = 0;
        let puntos2 = 0;

        this.puntos.forEach(element => {
            puntos1 = puntos1 + element.jugador1;
            puntos2 = puntos2 + element.jugador2;
        });

        if(!this.partido[this,this.tipoJugador].nombre && puntos1 > puntos2){
            this.Toast.fire({
                icon: 'error',
                title: 'El jugador 1 no puede tener mas puntos que el jugador 2.'
            });
            valid = false;

            return valid;
        }

        if(!this.partido[this,this.tipoJugador2].nombre && puntos2 > puntos1){
            this.Toast.fire({
                icon: 'error',
                title: 'El jugador 2 no puede tener mas puntos que el jugador 1.'
            });

            valid = false;

            return valid;
        }

        if(puntos1 !== puntos2){
            valid = true;
        }else{
            this.Toast.fire({
                icon: 'error',
                title: 'No puede haber haber empates en puntos totales.'
            });
            valid = false;
        }

        return valid;
    }

    determinarGanador(){
        let jugador1: number = 0;
        let jugador2: number = 0;

        let ganados1: number = 0;
        let ganados2: number = 0;

        let perdidos1: number = 0;
        let perdidos2: number = 0;

        let sets: any = [];

        this.puntos.forEach(element => {
            sets.push({marcador: `${element.jugador1}-${element.jugador2}`});
            jugador1 = jugador1 + element.jugador1;
            jugador2 = jugador2 + element.jugador2;

            if(element.jugador1 !== element.jugador2){
                if(element.jugador1 > element.jugador2){
                    ganados1 = ganados1 + 1;
                    perdidos2 = perdidos2 + 1;
                }else{
                    ganados2 = ganados2 + 1;
                    perdidos1 = perdidos1 + 1;
                }
            }
        });

        return this.ordenarDataPartido(sets, ganados1, ganados2, jugador1, jugador2, perdidos1, perdidos2)
    }

    ordenarDataPartido(sets:any, ganados1: any, ganados2: any, puntos1: any, puntos2: any, perdidos1:any, perdidos2:any){
        let value: any = {
            sets: sets
        };

        if(puntos1 > puntos2){
            value.ganador = {
                tipo: this.modalidad,
                id: this.partido[this.tipoJugador].id,
                setsGanados: ganados1,
                setsPerdidos: perdidos1,
                puntosSets: puntos1
            }

            value.perdedor = {
                tipo: this.modalidad,
                id: this.partido[this.tipoJugador2].id,
                setsGanados: ganados2,
                setsPerdidos: perdidos2,
                puntosSets: puntos2
            }
        }else{
            value.ganador = {
                tipo: this.modalidad,
                id: this.partido[this.tipoJugador2].id,
                setsGanados: ganados2,
                setsPerdidos: perdidos2,
                puntosSets: puntos2
            }

            value.perdedor = {
                tipo: this.modalidad,
                id: this.partido[this.tipoJugador].id,
                setsGanados: ganados1,
                setsPerdidos: perdidos1,
                puntosSets: puntos1
            }
        }

        return value;
    }

    onNoClick(): void {
        this.matDialogRef.close();
    }
}
