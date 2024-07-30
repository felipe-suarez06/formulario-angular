//formulario.service.ts

import { Injectable } from '@angular/core';
import { GraphQLClient } from 'graphql-request';


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
}
