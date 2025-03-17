import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @Input() showMenus: boolean = true;

  public appTitle: string = '';

  constructor(
    private titleService: Title,
    private router: Router
  ) {}

  ngOnInit() {
    // Recupera o título definido globalmente
    this.appTitle = this.titleService.getTitle();

    // Se desejar manter alguma lógica de verificação de rota, ajuste-a conforme necessário.
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Opcional: atualizar a propriedade com base na rota
        // this.showMenus = event.url === '/home';
      }
    });
  }
}