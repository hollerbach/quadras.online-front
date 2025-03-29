import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recover',
  imports: [RouterLink],
  templateUrl: './recover.component.html',
  styleUrl: './recover.component.css',
  encapsulation: ViewEncapsulation.None // Desabilita o encapsulamento
})
export class RecoverComponent {

}
