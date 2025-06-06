import { Component } from '@angular/core';
import { Cliente } from '../model/cliente';
import { CommonModule } from '@angular/common';
import { FormsModule  } from '@angular/forms';
@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
    mensagem: String = "";
    obj: Cliente = new Cliente;

    constructor(){
      let json = localStorage.getItem("cliente");
      if(json!=null){
        this.obj = JSON.parse(json);
      }
    }

    gravar(){
      localStorage.setItem("cliente", JSON.stringify(this.obj));
      this.mensagem = "O cliente foi gravado com sucesso!";
    }
}