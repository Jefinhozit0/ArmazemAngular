import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pesquisa',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pesquisa.component.html',
  styleUrl: './pesquisa.component.css'
})
export class PesquisaComponent {
  filtro: string = "";

  fazerBusca(){
      localStorage.setItem("filtro", this.filtro);
      location.href="vitrine";    
  }  

  limparBusca(){
    localStorage.removeItem("filtro");
    location.href="vitrine";    
  }

}
