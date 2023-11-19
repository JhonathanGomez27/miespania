import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JugadoresComponent } from './jugadores.component';
import { SinglesComponent } from './singles/singles.component';
import { ParejasComponent } from './parejas/parejas.component';

const routes: Routes = [
    {
        path: '',
        component: JugadoresComponent,
        children:[
            {
                path: 'solos',
                component: SinglesComponent,
            },
            {
                path: 'parejas',
                component: ParejasComponent
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JugadoresRoutingModule { }
