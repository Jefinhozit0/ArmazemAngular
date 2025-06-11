import { Component } from '@angular/core';
import { Cliente } from '../model/cliente';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Importe o HttpClient
import { Router } from '@angular/router'; // Importe o Router

@Component({
  selector: 'app-login',
  standalone: true,
  // Adicione HttpClientModule aos imports do componente
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  obj: Cliente = new Cliente();
  mensagem: string = "";

  // Injete o HttpClient e o Router no construtor
  constructor(private http: HttpClient, private router: Router) {}

  fazerLogin() {
    const apiUrl = 'http://localhost:3000/api/clientes/login';

    this.http.post<Cliente>(apiUrl, this.obj).subscribe({
      next: (usuarioLogado) => {
        // SUCESSO! O backend validou o usuário.

        // 1. Salve os dados do usuário retornado pelo backend no localStorage
        // A chave 'usuarioLogado' é a que a cesta de compras procurará.
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));

        // 2. Redirecione para a página principal ou para a vitrine
        this.router.navigate(['/']);
      },
      error: (erro) => {
        // ERRO! O backend retornou um erro (ex: 401 ou 404)
        this.mensagem = "Email ou senha inválidos.";
        console.error('Erro no login:', erro);
      }
    });
  }
}