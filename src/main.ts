import { environment } from './environments/environment';

if (environment.production) {
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${environment.googleTagId}`;
  script.async = true;
  document.head.appendChild(script);

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${environment.googleTagId}');
  `;
  document.head.appendChild(script2);
}

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
