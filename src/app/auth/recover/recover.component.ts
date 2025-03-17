import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from "../../header/header.component";

@Component({
  selector: 'app-recover',
  imports: [RouterLink, HeaderComponent],
  templateUrl: './recover.component.html',
  styleUrl: './recover.component.css'
})
export class RecoverComponent {

}
