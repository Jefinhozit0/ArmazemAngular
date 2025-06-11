import { Routes } from '@angular/router';
import { VitrineComponent } from './vitrine/vitrine.component';
import { DetalheComponent } from './detalhe/detalhe.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { LoginComponent } from './login/login.component';
import { EsqueciComponent } from './esqueci/esqueci.component';
import { CestaComponent } from './cesta/cesta.component';
import { HistoricoComponent } from './historico/historico.component';

// 1. Importe o ContatoComponent
import { ContatoComponent } from './contato/contato.component';

export const routes: Routes = [
    {path:"detalhe", component:DetalheComponent},
    {path:"vitrine", component:VitrineComponent},
    {path:"", component:VitrineComponent},
    {path:"cadastro", component:CadastroComponent},
    {path:"login", component:LoginComponent},
    {path:"esqueci", component:EsqueciComponent},
    {path:"cesta", component:CestaComponent},
      { path: 'historico', component: HistoricoComponent },
    {path:"contato", component:ContatoComponent}
];