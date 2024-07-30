// formulario.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormularioComponent } from './formulario.component';
import { FormsModule } from '@angular/forms';
import { FormularioService } from '../formulario.service';

describe('FormularioComponent', () => {
  let component: FormularioComponent;
  let fixture: ComponentFixture<FormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormularioComponent],
      imports: [FormsModule],  // Asegúrate de importar FormsModule para usar ngModel
      providers: [FormularioService],  // Asegúrate de proporcionar el servicio necesario
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form after submission', () => {
    // Simular el envío del formulario con datos válidos
    component.formData = {
      nombre: 'John',
      apellido: 'Doe',
      asunto: 'Consulta',
      archivo: null,
      fecharegistro: ''
    };

    spyOn(window, 'confirm').and.returnValue(true);  // Simular confirmación de usuario

    component.onSubmit({ valid: true } as any);  // Simular envío de formulario válido

    expect(component.formData).toEqual({
      nombre: '',
      apellido: '',
      asunto: '',
      archivo: null,
      fecharegistro: ''
    });
  });
});
