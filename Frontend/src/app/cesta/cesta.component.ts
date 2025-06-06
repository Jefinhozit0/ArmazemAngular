import { Component } from '@angular/core';
import { Cesta } from '../model/cesta';
import { Produto } from '../model/produto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cesta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cesta.component.html',
  styleUrl: './cesta.component.css'
})
export class CestaComponent {
  cesta : Cesta = new Cesta();
  mensagem: string = "";

  constructor(){
    let json = localStorage.getItem("cesta");
    if(json==null){
      this.mensagem = "Sua cesta de compras esta vazia!!";
    } else {
      this.cesta = JSON.parse(json);
    }
  }

  limpar(){
    localStorage.removeItem("cesta");
    this.cesta = new Cesta();
    this.mensagem = "Sua cesta de compras esta vazia!!";
  }

  continuar(){
    location.href="vitrine";
  }

  removerItem(item:number){
    this.cesta.itens.splice(item, 1);
    localStorage.setItem("cesta", JSON.stringify(this.cesta));
  }
}
