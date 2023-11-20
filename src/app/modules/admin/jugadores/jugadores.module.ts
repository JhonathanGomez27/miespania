import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JugadoresComponent } from './jugadores.component';
import { SinglesComponent } from './singles/singles.component';
import { ParejasComponent } from './parejas/parejas.component';
import { SharedModule } from 'app/shared/shared.module';
import { JugadoresRoutingModule } from './jugadores-routing.module';
import { EditarJugadorSingleComponent } from './modales/editar-jugador-single/editar-jugador-single.component';
import { EditarJugadorParejaComponent } from './modales/editar-jugador-pareja/editar-jugador-pareja.component';



@NgModule({
  declarations: [
    JugadoresComponent,
    SinglesComponent,
    ParejasComponent,
    EditarJugadorSingleComponent,
    EditarJugadorParejaComponent
  ],
  imports: [
    SharedModule,
    JugadoresRoutingModule
  ]
})
export class JugadoresModule { }
