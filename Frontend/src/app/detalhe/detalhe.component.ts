import { Component } from '@angular/core';
import { Produto } from '../model/produto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalhe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalhe.component.html',
  styleUrl: './detalhe.component.css'
})
export class DetalheComponent {
    mensagem: string  = "";
    obj: Produto = new Produto();

    constructor(){
      let json = localStorage.getItem("produto");
      if(json==null){
        this.mensagem = "Produto não encontrado! verifique!";
      } else {
        this.obj = JSON.parse(json);
      }
    }
}
