//formulario-detalle.component.ts

import { Component, OnInit } from '@angular/core';
import { FormularioService } from '../formulario.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // Importar CommonModule para directivas básicas de Angular
import pako from 'pako';

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
    this.formularioService.obtenerFormularioPorId(id).then(async data => {
      this.formulario = data.formById;
      if (this.formulario.archivo) {
        const decompressedBase64 = await this.decompressBase64(this.formulario.archivo);
        this.archivoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${decompressedBase64}`);
      }
    }).catch(error => {
      console.error('Error al obtener datos del formulario:', error);
    });
  }


private async decompressBase64(compressedBase64: string): Promise<string> {
  const binaryString = atob(compressedBase64); // Decodificar base64 a texto binario
  const binaryLength = binaryString.length;
  const bytes = new Uint8Array(binaryLength);
  for (let i = 0; i < binaryLength; i++) {
    bytes[i] = binaryString.charCodeAt(i); // Convertir texto binario a array de bytes
  }
  const decompressed = pako.inflate(bytes); // Descomprimir los bytes

  // Convertir ArrayBuffer a base64
  const blob = new Blob([decompressed], { type: 'application/octet-stream' });
  const reader = new FileReader();
  let decompressedBase64 = '';

  return new Promise<string>((resolve, reject) => {
    reader.onloadend = () => {
      decompressedBase64 = reader.result as string;
      const base64 = decompressedBase64.split(',')[1]; // Obtener solo la parte base64
      resolve(base64);
    };
    reader.onerror = () => reject('Error en la conversión a base64');
    reader.readAsDataURL(blob);
  });
}
}
