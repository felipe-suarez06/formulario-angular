// app.component.ts

import { Component } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import { CommonModule } from '@angular/common';
import {FormularioComponent}from './formulario/formulario.component'


@Component({
  selector: 'app-root',
  standalone: true,

  imports: [RouterOutlet,CommonModule,FormularioComponent],

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'FORMULARIO';
}
