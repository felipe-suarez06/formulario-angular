//app.routes.ts


import { Routes } from '@angular/router';

import { FormularioComponent } from './formulario/formulario.component'
import { FormularioDetalleComponent } from './formulario-detalle/formulario-detalle.component';


export const routes: Routes = [
  { path: '',
    component: FormularioComponent
  },

  { path: 'formulario/:id',
    component: FormularioDetalleComponent
  }
];

