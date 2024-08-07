//formulario-detalle.component.ts

import { Component, OnInit } from '@angular/core';
import { FormularioService } from '../formulario.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // Importar CommonModule para directivas básicas de Angular

@Component({
  selector: 'app-formulario-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formulario-detalle.component.html',
  styleUrl: './formulario-detalle.component.css'
})
export class FormularioDetalleComponent implements OnInit {
  formulario: { id: string; nombre: string; apellido: string; asunto: string; archivo: string; fecharegistro: string } | undefined;
  archivoUrl: SafeResourceUrl | null = null;

  constructor(
    private formularioService: FormularioService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.formularioService.obtenerFormularioPorId(id).then(data => {
      this.formulario = data.formById;
      if (this.formulario.archivo) {
        this.archivoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${this.formulario.archivo}`);
      }
    }).catch(error => {
      console.error('Error al obtener datos del formulario:', error);
    });
  }
}
