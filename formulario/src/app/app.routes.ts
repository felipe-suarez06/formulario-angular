//app.routes.ts

import { NgModule } from '@angular/core';

import { RouterModule,Routes } from '@angular/router';

import { FormularioComponent } from './formulario/formulario.component'

export const routes: Routes = [
  {
    path: '',
    component: FormularioComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
