//formulario.components.ts


import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormularioService } from '../formulario.service';
import { CommonModule } from '@angular/common'; // Importar CommonModule para directivas básicas de Angular
import { FormsModule } from '@angular/forms'; // Importa FormsModule para el uso de ngModel



@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule

 ],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent {
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
          this.formData.archivo = archivoBase64;
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
}

