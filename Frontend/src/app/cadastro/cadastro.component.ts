import { Component } from '@angular/core';
import { Cliente } from '../model/cliente';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Importe o HttpClient
import { Router } from '@angular/router'; // Importe o Router para redirecionar

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // Adicione HttpClientModule
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
    mensagem: string = "";
    obj: Cliente = new Cliente();

    // Injete o HttpClient e o Router
    constructor(private http: HttpClient, private router: Router) {}

    // Esta função agora envia os dados para o backend
    gravar() {
      // Prepara os dados, removendo espaços em branco extras para evitar erros
      const dadosParaEnviar = {
        ...this.obj, // Copia todos os dados do formulário
        email: this.obj.email.trim(),
        nome: this.obj.nome.trim()
        // Adicione .trim() para outros campos se necessário
      };

      // Define a URL da API para criar um novo cliente
      const apiUrl = 'http://localhost:3000/api/clientes';

      // Faz a requisição POST para o backend
      this.http.post<Cliente>(apiUrl, dadosParaEnviar).subscribe({
        next: (clienteCriado) => {
          // SUCESSO! O cliente foi criado no banco de dados.
          this.mensagem = "Cadastro realizado com sucesso!";

          // Opcional: Redireciona o usuário para a tela de login após 2 segundos
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (erro) => {
          // ERRO! Não foi possível criar o cliente.
          this.mensagem = "Ocorreu um erro ao realizar o cadastro. Verifique os dados e tente novamente.";
          console.error("Erro ao cadastrar:", erro);
        }
      });
    }
}