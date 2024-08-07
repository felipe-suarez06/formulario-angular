//main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component'; // Suponiendo que AppComponent es tu componente raíz
import { appConfig } from './app/app.config'; // Asegúrate de que la ruta sea correcta

bootstrapApplication(AppComponent,appConfig);
