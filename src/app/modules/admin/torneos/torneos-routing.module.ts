import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TorneosComponent } from './torneos.component';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
    {
        path: '',
        component: TorneosComponent,
        children:[
            {
                path: '',
                component: ListComponent,
            },
            {
                path: ':id',
                component: DetailsComponent
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TorneosRoutingModule { }
