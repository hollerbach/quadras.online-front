import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private titleService: Title) {}

  ngOnInit() {
    const hostname = window.location.hostname;
    let title = ''; // Título padrão

    // Mapeamento de domínios para títulos específicos
    switch (hostname) {
      case 'mercearia.digital':
        title = 'Mercearia Digital';
        break;
      case 'varejo.digital':
        title = 'Varejo Digital';
        break;
      // Adicione outros casos conforme necessário
      default:
        title = 'localhost';
        break;
    }
    // Atualiza o título da página
    this.titleService.setTitle(title);

  }
}