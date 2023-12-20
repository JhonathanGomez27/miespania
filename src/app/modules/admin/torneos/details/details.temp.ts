import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { EditarPartidoComponent } from '../modals/editar-partido/editar-partido.component';
import { CrearTorneoComponent } from '../modals/crear-torneo/crear-torneo.component';
import { CrearGrupoComponent } from '../modals/crear-grupo/crear-grupo.component';
import { TorneosService } from '../torneos.service';
import Swal from 'sweetalert2';
import { ConfirmarAccionComponent } from '../modals/confirmar-accion/confirmar-accion.component';
import { InscribirJugadorComponent } from '../modals/inscribir-jugador/inscribir-jugador.component';
import { VerInscritosComponent } from '../modals/ver-inscritos/ver-inscritos.component';

@Component({
    selector: 'app-details.temp',
    templateUrl: './details.temp.html',
    encapsulation: ViewEncapsulation.None
})
export class DetailsTempComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    cantGrupos: number = 0;

    torneo: any = {};
    grupos: any = [];

    grupoSeleccionado: any = '';
    buscarJugador:any = new FormControl({value: '', disabled: false});

    // variables tabla
    tablaJugadoresData: MatTableDataSource<any> = new MatTableDataSource([]);
    tablaJugadoresColumns: string[] = ['JugadorU', 'jugadorD', 'etapa', 'acciones'];
    Toast: any;

    inscritos: any = [];

    partidos: any = [];

    // Partidos fases
    faseGrupos: any = [];
    faseOctavos: any = [];
    faseCuartos: any = [];
    faseSemifinal: any = [];
    faseFinal: any = [];

    etapa: string = 'grupos';

    etapaControl:any = new FormControl({value: '', disabled: false});

    tipoJugador: string = '';
    tipoJugador2: string = '';

    mensajePartidos:string = '¡No hay partidos para mostrar!';

    showTabla: boolean = false;

    tipojuego: any = '';

    showEditar: boolean = false;

    showAcciones: boolean = false;

    disableButtons: boolean = false;

    showPrograma: boolean = false;

    showSiguienteFase: boolean = false;

    // Escalera
    showSiguietenJornada: boolean = false;
    jornadas: any = [];
    jornadaControl: FormControl = new FormControl({value: '', disabled: false});
    jornadasOrden:any = [];

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
        private _torneoService: TorneosService
    ) {
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
        this._torneoService.torneo$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.torneo = response;
            this.cantGrupos = response.cantidad_grupos;

            this.determinarTorneo();

            if(response.estado !== 'Inicial' && response.estado !== 'Sorteo' && response.tipo_torneo !== 'escalera'){
                this.tablaJugadoresData = new MatTableDataSource([]);
                this.faseOctavos = [];
                this.faseCuartos = [];
                this.faseSemifinal = [];
                this.faseFinal = [];
                this.obtenerPartidosTorneo(response.id, true);
            }

            if(response.estado === 'Inicial'){
                this.showEditar = true;
            }

            if(response.estado === 'Sorteo' && response.tipo_torneo !== 'escalera'){
                this.showAcciones = true;
                this.showPrograma = true;
            }

            if(response.estado === 'Inicial' || response.estado === 'Sorteo'){
                this.etapaControl.disable();
            }

            if(response.estado === 'En Proceso' && response.fase_actual !== 'final' && response.tipo_torneo !== 'escalera'){
                this.showSiguienteFase = true;

                this._changeDetectorRef.markForCheck();
            }

            if(response.estado === 'En Proceso' && response.fase_actual === 'grupos' && response.tipo_torneo === 'escalera' ){
                this.showSiguietenJornada = true;
            }

            if(response.tipo_torneo === 'escalera'){
                this.obtenerDataEscalera();
            }
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        this._torneoService.grupos$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.grupos = response;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        this._torneoService.inscritosTorneo$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.inscritos = response;
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

    editarTorneoDialogo(){
        // Open the dialog
        const dialogRef = this._matDialog.open(CrearTorneoComponent,{
            // width: '80%'
            data: {accion: 'Editar', torneo: this.torneo}
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result !== undefined){
                this.editarTorneo(result);
            }
        });
    }

    editarTorneo(data:any){
        this._torneoService.editarTorneo(this.torneo.id, data).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'Torneo editado con exito.'
                });

                this.actualizarDataTorneo();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    actualizarDataTorneo(){
        this._torneoService.obtenerTorneoByIdRefresh(this.torneo.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this._torneoService.torneo = response;
                if(response.fase_actual === 'final'){
                    this.showSiguienteFase = false;

                    this._changeDetectorRef.markForCheck();
                }
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods grupos
    // -----------------------------------------------------------------------------------------------------

    crearGrupoDialogo(){
        if(this.grupos.length === this.cantGrupos){
            this.Toast.fire({
                icon: 'error',
                title: `La cantidad de grupos en el torneo ya esta en el limite definido: ${this.cantGrupos}`
            });

            return;
        }

        // Open the dialog
        const dialogRef = this._matDialog.open(CrearGrupoComponent,{
            // width: '80%'
            data: {accion: 'Crear', cantGrupos: this.grupos.length, tipojuego: this.tipojuego}
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result !== undefined){
                // console.log(result);
                this.crearGrupo(result);
            }
        });
    }

    crearGrupo(data:any){
        this._torneoService.crearGrupo(data, this.torneo.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'Grupo creado con exito'
                });

                this.actualizarGrupos();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    actualizarGrupos(){
        this._torneoService.obtenerGruposRefresh(this.torneo.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this._torneoService.grupos = response;
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    removerJugador(jugador:any, grupo:any){
        // Open the dialog
        const dialogRef = this._matDialog.open(ConfirmarAccionComponent,{
            // width: '80%'
            data: {mensaje: '¿Estás seguro que quieres eliminar este jugador del grupo?'},
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result === true){
                this._torneoService.removerParticipanteGrupo(this.torneo.id, grupo.id, jugador.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
                    (response:any) => {
                        this.Toast.fire({
                            icon: 'success',
                            title: `El jugador ha sido eliminado del Grupo ${grupo.nombre_grupo}`
                        });

                        this.actualizarGrupos();
                    },(error) => {
                        this.Toast.fire({
                            icon: 'error',
                            title: error.error.mensaje
                        });
                    }
                );
            }
        });
    }

    removeGrupo(grupo:any){
        // this.grupos.splice(index, 1);
        // Open the dialog
        const dialogRef = this._matDialog.open(ConfirmarAccionComponent,{
            // width: '80%'
            data: {mensaje: '¿Estás seguro que quieres borrar este grupo?'},
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result === true){
                this._torneoService.eliminarGrupo(this.torneo.id, grupo.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
                    (response:any) => {
                        this.Toast.fire({
                            icon: 'success',
                            title: 'El grupo ha sido eliminado con exito.'
                        });

                        this.actualizarGrupos();
                    },(error) => {
                        this.Toast.fire({
                            icon: 'error',
                            title: error.error.mensaje
                        });
                    }
                );
            }
        });
    }

    addIntegranteGrupoDialog(grupo:any){
        // Open the dialog
        const dialogRef = this._matDialog.open(CrearGrupoComponent,{
            // width: '80%'
            data: {accion: 'Editar', grupo, cantGrupos: this.grupos.length, tipojuego: this.tipojuego}
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result !== undefined){
                // console.log(result);
                this.anadirIntegranteGrupo(grupo, result)
            }
        });
    }

    anadirIntegranteGrupo(grupo: any, jugador: any){
        this._torneoService.agregarParticipanteGrupo(this.torneo.id, grupo.id, {...jugador}).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'El jugador ha sido agregado con exito al grupo.'
                });

                this.actualizarGrupos();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods partidos
    // -----------------------------------------------------------------------------------------------------

    etapaChange(event:any){
        this.showTabla = false;

        if(this.torneo.tipo_torneo === 'escalera' && event === 'grupos'){
            return;
        }

        switch (event) {
            case 'grupos':
                this.tablaJugadoresData = new MatTableDataSource([]);
                this.mensajePartidos = 'Selecciona un grupo para ver los partidos.';
                break;
            case 'octavos':
                if(this.faseOctavos.length === 0){
                    this.mensajePartidos = 'No hay partidos para esta fase.';
                }else{
                    this.tablaJugadoresData = new MatTableDataSource(this.faseOctavos);
                    this.showTabla = true;
                }
                break;
            case 'cuartos':
                if(this.faseCuartos.length === 0){
                    this.mensajePartidos = 'No hay partidos para esta fase.';
                }else{
                    this.tablaJugadoresData = new MatTableDataSource(this.faseCuartos);
                    this.showTabla = true;
                }
                break;
            case 'semifinales':
                if(this.faseSemifinal.length === 0){
                    this.mensajePartidos = 'No hay partidos para esta fase.';
                }else{
                    this.tablaJugadoresData = new MatTableDataSource(this.faseSemifinal);
                    this.showTabla = true;
                }
                break;
            case 'final':
                if(this.faseFinal.length === 0){
                    this.mensajePartidos = 'No hay partidos para esta fase.';
                }else{
                    this.tablaJugadoresData = new MatTableDataSource(this.faseFinal);
                    this.showTabla = true;
                }
                break;
            default:
                break;
        }

        if(event === 'grupos'){
            this.mensajePartidos = 'Selecciona un grupo para ver los partidos';
        }

        this.etapa = event;
    }

    editarPartido(partido:any){
        // Open the dialog
        const dialogRef = this._matDialog.open(EditarPartidoComponent,{
            // width: '80%',
            data: {sets: this.torneo.configuracion_sets[this.etapa], partido, etapa: this.etapa, modalidad: this.torneo.modalidad, tipoJugador1: this.tipoJugador, tipoJugador2: this.tipoJugador2, faseActual: this.torneo.fase_actual}
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result !== undefined){
                this.actualizarResultado(partido.id, result, partido.fase);
            }
        });
    }

    actualizarResultado(idPartido: any, data: any, fase?:any){
        this._torneoService.actualizarPartido(idPartido, data).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'Partido actualizado con exito',
                });

                this.tablaJugadoresData = new MatTableDataSource([]);
                this.faseOctavos = [];
                this.faseCuartos = [];
                this.faseSemifinal = [];
                this.faseFinal = [];

                this.obtenerPartidosTorneo(this.torneo.id, true, fase);

                this._changeDetectorRef.markForCheck();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    seleccionarGrupoPartidos(grupo:any){

        if(this.etapaControl.value === 'grupos' && this.torneo.tipo_torneo === 'regular'){
            this.grupoSeleccionado = grupo.nombre_grupo;

            this.tablaJugadoresData = new MatTableDataSource(this.faseGrupos[grupo.nombre_grupo]);

            this.showTabla = true;
        }else{
            if(this.etapaControl.value !== 'grupos'){
                this.etapaControl.setValue('grupos');
                this.grupoSeleccionado = grupo.nombre_grupo;

                this.tablaJugadoresData = new MatTableDataSource(this.faseGrupos[grupo.nombre_grupo]);

                this.showTabla = true;
            }else{
                this.showTabla = false;

                this.tablaJugadoresData = new MatTableDataSource([]);
            }

        }

        if(this.torneo.tipo_torneo === 'escalera'){
            if(this.etapaControl.value === 'grupos' && this.jornadaControl.value === ''){
                this.showTabla = false;

                this.tablaJugadoresData = new MatTableDataSource([]);

                this.mensajePartidos = 'Selecciona una jornada.'
            }

            if(this.etapaControl.value === 'grupos' && this.jornadaControl.value !== ''){
                this.tablaJugadoresData = new MatTableDataSource([]);

                this.grupoSeleccionado = grupo.nombre_grupo;
                let jornada = this.jornadaControl.value;
                let partidos: any = [];
                this.faseGrupos[this.grupoSeleccionado].forEach(element => {
                    if(element.jornada.id === jornada){
                        partidos.push(element);
                    }
                });
                this.tablaJugadoresData = new MatTableDataSource(partidos);

                this.showTabla = true;


                this.mensajePartidos = 'Selecciona una jornada.'
            }
        }

        this._changeDetectorRef.markForCheck();
    }

    determinarTorneo(){
        if(this.torneo.modalidad === 'singles'){
            this.tipoJugador = 'jugador1';
            this.tipoJugador2 = 'jugador2';
            this.tipojuego = 'jugador';
        }else{
            this.tipoJugador = 'pareja1';
            this.tipoJugador2 = 'pareja2';
            this.tipojuego = 'pareja';
        }
    }

    obtenerPartidosTorneo(id:any, actualizar?:any, fase?:any){
        this._torneoService.obtenerPartidosTorneo(id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.partidos = response;

                this.ordenarPartidosFaseGrupos(actualizar, fase);

                this._changeDetectorRef.markForCheck();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    ordenarPartidosFaseGrupos(actualizar?:any, fase = ''){
        let grupos: any = {};
        this.grupos.forEach(grupo => {
            grupos[grupo.nombre_grupo] = [];
        });

        this.partidos.forEach(partido => {
            if(partido.fase === 'grupos'){
                grupos[partido.grupo.nombre_grupo].push(partido);
            }

            if(partido.fase === 'octavos'){
                this.faseOctavos.push(partido);
            }

            if(partido.fase === 'cuartos'){
                this.faseCuartos.push(partido);
            }

            if(partido.fase === 'semifinales'){
                this.faseSemifinal.push(partido);
            }

            if(partido.fase === 'final'){
                this.faseFinal.push(partido);
            }
        });

        this.faseGrupos = grupos;

        if(this.grupoSeleccionado !== '' && this.torneo.fase_actual === 'grupos'){
            this.tablaJugadoresData = new MatTableDataSource(this.faseGrupos[this.grupoSeleccionado]);

            this._changeDetectorRef.markForCheck();
        }

        this.etapaControl.enable();
        this.etapaControl.setValue(this.torneo.fase_actual);
        if(actualizar && fase !== 'grupos'){
            this.etapaChange(this.torneo.fase_actual);
        }
        if(this.torneo.fase_actual === 'grupos'){
            this.mensajePartidos = 'Selecciona un grupo para ver los partidos.';
        }

        this._changeDetectorRef.markForCheck();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods incribir jugadores
    // -----------------------------------------------------------------------------------------------------

    inscribirJugadorModal(){
        // Open the dialog
        const dialogRef = this._matDialog.open(InscribirJugadorComponent,{
            // width: '80%'
            data: {accion: 'Crear', tipojuego: this.tipojuego, torneo: this.torneo, inscritos: this.inscritos}
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result !== undefined){
                this.disableButtons = true;
                if(this.torneo.modalidad === 'singles'){
                    this.inscribirJugador(result, this.torneo.id);
                }else{
                    this.inscribirPareja(result, this.torneo.id);
                }
            }
        });
    }

    inscribirJugador(jugador: any, torneo:any){
        this._torneoService.inscribirJugador({jugador, torneo}).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'El jugador ha sido inscrito al torneo con exito.'
                });

                this.disableButtons = false;

                this.obtenerInscritosTorneo();

                this._changeDetectorRef.markForCheck();
            },(error) => {
                this.disableButtons = false;
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    inscribirPareja(pareja: any, torneo:any){
        this._torneoService.inscribirPareja({pareja, torneo}).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'La pareja ha sido inscrita al torneo con exito.'
                });

                this.disableButtons = false;

                this.obtenerInscritosTorneo();

                this._changeDetectorRef.markForCheck();
            },(error) => {
                this.disableButtons = false;
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    obtenerInscritosTorneo(){
        this._torneoService.obtenerInscritosTorneo(this.torneo.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this._torneoService.inscritos = response;
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    verInscritosModal(){
        // Open the dialog
        const dialogRef = this._matDialog.open(VerInscritosComponent,{
            // width: '80%'
            data: {accion: 'Crear', inscritos: this.inscritos, tipojuego: this.tipojuego, torneo: this.torneo}
        });

        dialogRef.afterClosed().subscribe((result) => {

        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods adicionales
    // -----------------------------------------------------------------------------------------------------
    cambiarTorneoAprogramacionDialog(){
        if(!this.grupos.length){
            this.Toast.fire({
                icon: 'error',
                title: 'No se puede programar partidos de la fase de grupos si no hay grupos.'
            });

            return;
        }

        // this.grupos.splice(index, 1);
        // Open the dialog
        const dialogRef = this._matDialog.open(ConfirmarAccionComponent,{
            // width: '80%'
            data: {mensaje: '¿Estás seguro que deseas programar la fase de grupos del torneo? Luego de esta accion no puedes volver a editar los grupos.'},
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result === true){
                this.cambiarTorneoAProgramacion();
            }
        });
    }

    cambiarTorneoAProgramacion(){
        this._torneoService.cambiarTorneoAProgramacion(this.torneo.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.programarPartidos();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    programarPartidos(){
        this._torneoService.programarPartidosFase(this.torneo.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'Se ha sorteado con exito la fase de grupos.'
                });

                this.showAcciones = false;
                this.showPrograma = false;

                this.actualizarDataTorneo();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    sortearSiguienteFaseTorneo(){
        this._torneoService.sortearSiguienteFase(this.torneo.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'Siguiente fase sorteada con exito'
                });

                this.actualizarDataTorneo();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods escalera
    // -----------------------------------------------------------------------------------------------------
    obtenerDataEscalera(){
        this.obtenerJornadasPorTorneo();
    }

    obtenerJornadasPorTorneo(){
        this._torneoService.obtenerJornadasPorTorneo(this.torneo.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.jornadas = response.jornadas;
                this.obtenerPartidosEscalera();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    obtenerPartidosEscalera(){
        this._torneoService.obtenerPartidosTorneo(this.torneo.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.partidos = response;

                this.ordenarJornadas();

                this._changeDetectorRef.markForCheck();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    ordenarJornadas(){
        let grupos: any = {};
        this.grupos.forEach(grupo => {
            grupos[grupo.nombre_grupo] = [];
        });

        this.partidos.forEach(partido => {
            if(partido.fase === 'grupos'){
                grupos[partido.grupo.nombre_grupo].push(partido);
            }

            if(partido.fase === 'octavos'){
                this.faseOctavos.push(partido);
            }

            if(partido.fase === 'cuartos'){
                this.faseCuartos.push(partido);
            }

            if(partido.fase === 'semifinales'){
                this.faseSemifinal.push(partido);
            }

            if(partido.fase === 'final'){
                this.faseFinal.push(partido);
            }
        });

        this.faseGrupos = grupos;

        this.etapaControl.enable();
        this.etapaControl.setValue(this.torneo.fase_actual);

        if(this.torneo.fase_actual === 'grupos'){
            this.mensajePartidos = 'Selecciona un grupo y una jornada para ver los partidos.';
        }
    }

    programarPartidosJornada(){
        if(this.jornadaControl.value === ''){
            return;
        }

        this._torneoService.programarPartidosjornada(this.torneo.id, this.jornadaControl.value).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'Jornada programada con exito.'
                });

                console.log(response);
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    jornadaChange(event:any){
        this._changeDetectorRef.markForCheck();
        if(this.grupoSeleccionado === ''){
            this.mensajePartidos = 'Selecciona un grupo para ver los partidos de la jornada.'
        }else{
            let partidos: any = [];
            this.faseGrupos[this.grupoSeleccionado].forEach(element => {
                if(element.jornada.id === event){
                    partidos.push(element);
                }
            });

            console.log(partidos);
            this.tablaJugadoresData = new MatTableDataSource(partidos);
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods adicionales
    // -----------------------------------------------------------------------------------------------------

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
