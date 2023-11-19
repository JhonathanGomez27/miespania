import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JugadoresComponent } from './jugadores.component';
import { SinglesComponent } from './singles/singles.component';
import { ParejasComponent } from './parejas/parejas.component';
import { SharedModule } from 'app/shared/shared.module';
import { JugadoresRoutingModule } from './jugadores-routing.module';



@NgModule({
  declarations: [
    JugadoresComponent,
    SinglesComponent,
    ParejasComponent
  ],
  imports: [
    SharedModule,
    JugadoresRoutingModule
  ]
})
export class JugadoresModule { }
