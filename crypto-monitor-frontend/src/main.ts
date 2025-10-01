import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// Services
import { AuthService } from './app/services/auth.service';
import { CryptoService } from './app/services/crypto.service';
import { AlertService } from './app/services/alert.service';
import { MonitoringService } from './app/services/monitoring.service'; // ADICIONAR
import { AuthGuard } from './app/guards/auth.guard';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(ReactiveFormsModule, FormsModule),
    AuthService,
    CryptoService,
    AlertService,
    MonitoringService, // ADICIONAR
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
}).catch(err => console.error('Erro ao inicializar aplicação:', err));
