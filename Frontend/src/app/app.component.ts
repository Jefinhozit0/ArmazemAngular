import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PesquisaComponent } from './pesquisa/pesquisa.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PesquisaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'loja2025';
}
