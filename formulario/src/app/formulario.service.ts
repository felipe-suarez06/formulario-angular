//formulario.service.ts

import { Injectable } from '@angular/core';
import { GraphQLClient } from 'graphql-request';

interface FormResponse {
  formById: {
    id: string;
    nombre: string;
    apellido: string;
    asunto: string;
    archivo: string;
    fecharegistro: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class FormularioService {

  private graphqlEndpoint = 'http://localhost:4002/graphql';
  private client: GraphQLClient;

  constructor() {
    this.client = new GraphQLClient(this.graphqlEndpoint);
  }

  async enviarDatos(formData: any) {
    const mutation = `
      mutation SubmitForm($input: FormInput!) {
        submitForm(input: $input) {
          nombre
          apellido
          asunto
          fecharegistro
        }
      }
    `;

    try {
      const data = await this.client.request(mutation, { input: formData });
      return data;
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      throw error;
    }
  }

  async obtenerFormularioPorId(id: string): Promise<FormResponse> {
    const query = `
      query FormById($id: ID!) {
        formById(id: $id) {
          id
          nombre
          apellido
          asunto
          archivo
          fecharegistro
        }
      }
    `;

    try {
      return await this.client.request<FormResponse>(query, { id });
    } catch (error) {
      console.error('Error al obtener formulario por ID:', error);
      throw error;
    }
  }
}
