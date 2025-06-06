import { Component } from '@angular/core';
import { Cliente } from '../model/cliente';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  obj: Cliente = new Cliente();
  mensagem: string = "";

  fazerLogin(){
    let json = localStorage.getItem("cliente"); 
    if(json==null){
        this.mensagem="usuario ou senha invalidas!";
    }  else {
        let objGravado = JSON.parse(json);
        if(objGravado.email==this.obj.email &&
            objGravado.senha==this.obj.senha
        ){
          location.href="cadastro";
        } else {
          this.mensagem="usuario ou senha invalidas!";
        }
    }
  }

}