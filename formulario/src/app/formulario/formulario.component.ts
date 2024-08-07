//formulario.components.ts


import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormularioService } from '../formulario.service';
import { CommonModule } from '@angular/common'; // Importar CommonModule para directivas básicas de Angular
import { FormsModule } from '@angular/forms'; // Importa FormsModule para el uso de ngModel
import pako from 'pako';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent {
  title = 'FORMULARIO';

  formData: any = {
    nombre: '',
    apellido: '',
    asunto: '',
    archivo: null,
    fecharegistro: ''
  };

  constructor(private formularioService: FormularioService) {}

  async onSubmit(formulario: NgForm) {
    if (formulario.valid) {
      if (confirm('¿Está seguro de enviar el formulario?')) {
        // Validar que se haya seleccionado un archivo
        if (!this.formData.archivo) {
          alert('Por favor, seleccione un archivo.');
          return;
        }

        // Convertir archivo a base64
        const archivoBase64 = await this.convertirArchivoABase64(this.formData.archivo);
        if (archivoBase64) {
          // Comprimir base64
          this.formData.archivo = await this.compressBase64(archivoBase64);

        } else {
          console.error('Error al convertir archivo a base64');
          return; // Salir si hubo un error en la conversión
        }

        // Asignamos la fecha de registro con la fecha actual en formato ISO 8601
        this.formData.fecharegistro = new Date().toISOString();

        // Llamamos al servicio para enviar los datos
        try {
          const response = await this.formularioService.enviarDatos(this.formData);
          console.log('Formulario enviado correctamente:', response);
          alert('Formulario enviado correctamente.');
          formulario.reset(); // Resetear el formulario después del envío
          this.formData = { // Limpiar los datos del formulario después del envío
            nombre: '',
            apellido: '',
            asunto: '',
            archivo: null,
            fecharegistro: ''
          };
        } catch (error) {
          console.error('Error al enviar formulario:', error);
          alert('Error al enviar formulario. Inténtelo de nuevo más tarde.');
        }
      }
    } else {
      alert('Por favor, complete todos los campos correctamente.');
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file instanceof Blob && file.type === 'application/pdf') {
      this.formData.archivo = file;
    } else {
      console.error('Por favor, seleccione un archivo PDF válido.');
      this.formData.archivo = null;
    }

    // Logging del archivo seleccionado
    console.log('Archivo seleccionado:', file);

    // Validar tamaño del archivo
    const maxSize = 15 * 1024 * 1024; // 10 MB en bytes
    if (file.size > maxSize) {
      console.error('El archivo seleccionado es demasiado grande. Seleccione un archivo más pequeño.');
      this.formData.archivo = null;
      return;
    }
  }

  private convertirArchivoABase64(file: File): Promise<string | null> {
    return new Promise<string | null>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64 = base64String.split(',')[1]; // Obtener solo la parte base64
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);

      if (file instanceof Blob) {
        reader.readAsDataURL(file);
      } else {
        reject(new Error('El parámetro no es un objeto Blob válido.'));
      }
    });
  }

  private async compressBase64(base64String: string): Promise<string> {
    const binaryString = atob(base64String); // Decodificar base64 a texto binario
    const binaryLength = binaryString.length;
    const bytes = new Uint8Array(binaryLength);
    for (let i = 0; i < binaryLength; i++) {
      bytes[i] = binaryString.charCodeAt(i); // Convertir texto binario a array de bytes
    }
    const compressed = pako.deflate(bytes); // Comprimir los bytes

    // Convertir ArrayBuffer a base64
    const blob = new Blob([compressed], { type: 'application/octet-stream' });
    const reader = new FileReader();
    let compressedBase64 = '';

    return new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        compressedBase64 = reader.result as string;
        const base64 = compressedBase64.split(',')[1]; // Obtener solo la parte base64
        resolve(base64);
      };
      reader.onerror = () => reject('Error en la conversión a base64');
      reader.readAsDataURL(blob);
    });
  }
}
