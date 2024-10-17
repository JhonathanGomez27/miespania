import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ProfileResolver, ProfileStatisticsResolver } from './profile.resolver';

const routes: Routes = [
    {
        path: '',
        component: ProfileComponent,
        resolve: {
            data: ProfileResolver,
            statistics: ProfileStatisticsResolver
        }
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
