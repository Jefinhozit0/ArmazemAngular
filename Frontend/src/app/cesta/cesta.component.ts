import { Component } from '@angular/core';
import { Cesta } from '../model/cesta';
import { CommonModule } from '@angular/common';
import { CestaService } from '../services/cesta.service'; // 1. Importe o serviço

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

  // 2. Injete o CestaService no construtor
  constructor(private cestaService: CestaService){ 
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
    // Recalcula o total antes de remover
    this.cesta.total -= this.cesta.itens[item].valor;
    this.cesta.itens.splice(item, 1);
    
    // Se a cesta ficar vazia após a remoção
    if (this.cesta.itens.length === 0) {
      this.limpar();
    } else {
      localStorage.setItem("cesta", JSON.stringify(this.cesta));
    }
  }

  // 3. Adicione a função para finalizar a compra
  finalizarCompra() {
  // 1. Buscar os dados do usuário logado do localStorage
  const dadosUsuarioJSON = localStorage.getItem('usuarioLogado'); // Verifique se a chave é esta mesma

  // 2. Verificar se o usuário está de fato logado
  if (dadosUsuarioJSON) {
    // 3. Adicionar os dados do cliente ao objeto da cesta
    this.cesta.cliente = JSON.parse(dadosUsuarioJSON);

    // Agora o objeto this.cesta contém tanto os itens quanto os dados do cliente
    console.log('Enviando para o backend:', this.cesta); // Log para depuração

    // 4. Enviar a cesta COMPLETA para o backend
    this.cestaService.finalizarCompra(this.cesta).subscribe({
      next: (response) => {
        alert('Compra finalizada com sucesso!');
        // Ou usar um modal/toast com os detalhes
        console.log('Detalhes da compra:', response);
        this.limpar(); // Limpa a cesta após o sucesso
      },
      error: (error) => {
        const errorMessage = error.error?.error || 'Ocorreu um erro desconhecido.';
        alert('Erro ao finalizar compra: ' + errorMessage);
        console.error(error);
      }
    });

  } else {
    // Caso o usuário não esteja logado, ele não deve conseguir finalizar a compra
    alert('Você precisa fazer o login para finalizar a compra!');
    // Opcional: redirecionar o usuário para a página de login
    // location.href = '/login';
  }
}
}