import { bootstrapApplication } from '@angular/platform-browser';
import '@iss/component-kernel/register';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig).catch((error) => console.error(error));
