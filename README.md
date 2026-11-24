# ChaveFlow CRM

**CRM imobiliário Full Stack com gestão de leads, controle de presença por QR Code e distribuição round-robin de oportunidades.**

O ChaveFlow CRM é uma aplicação web desenvolvida com **React, TypeScript e Supabase**, voltada à organização de leads imobiliários, acompanhamento de negociações e distribuição de oportunidades entre corretores.

O projeto demonstra conhecimentos em desenvolvimento Full Stack, autenticação, autorização, PostgreSQL, segurança, concorrência, regras de negócio e interfaces responsivas.

## Demonstração online

**Aplicação:** https://san-remo-crm-rose.vercel.app

**Repositório GitHub:** https://github.com/brunobonettib/chaveflow-crm

### Acessos de demonstração

Utilize as contas abaixo para testar os diferentes perfis do sistema.

| Perfil | E-mail | Senha |
|---|---|---|
| Gestor | gestor.demo@example.com | Senhadogestor123. |
| Corretora Ana | ana.demo@example.com | Senhadaana123. |
| Corretor Pedro | pedro.demo@example.com | Senhadopedro123. |
| Corretora Carla | carla.demo@example.com | Senhadacarla123. |

**Ambiente demonstrativo:** todos os usuários e leads são fictícios. O ambiente é compartilhado, portanto os dados podem ser modificados por outros visitantes.

Para experimentar a distribuição, entre como gestor, cadastre um lead no reservatório e confirme a presença de um corretor utilizando o QR Code.

## Tecnologias utilizadas

| Camada | Tecnologia |
|---|---|
| Frontend | React, TypeScript e Vite |
| Autenticação | Supabase Auth |
| Banco de dados | PostgreSQL (Supabase) |
| Segurança | Row Level Security (RLS) |
| Regras de negócio | Funções RPC em PL/pgSQL |
| Navegação | React Router |
| QR Code | qrcode.react |
| Hospedagem | Vercel |
| Versionamento | Git e GitHub |
| IA no desenvolvimento | OpenAI Codex e ChatGPT |

## Funcionalidades

### Painel do gestor

- Dashboard com indicadores de leads e oportunidades.
- Cadastro, edição e consulta de contatos.
- Funil Kanban com seis etapas.
- Reservatório de leads sem responsável.
- Visualização da fila de corretores habilitados.
- Geração e renovação automática do QR Code de presença.
- Distribuição round-robin de oportunidades.
- Histórico persistente de distribuições.
- Consulta de detalhes e observações dos leads.

### Painel do corretor

- Autenticação individual.
- Visualização exclusiva dos leads atribuídos.
- Atualização das etapas de atendimento.
- Registro de observações com data.
- Confirmação de presença pelo celular mediante leitura do QR Code.

### Funil de vendas

O sistema organiza as oportunidades nas seguintes etapas:

1. Novo
2. Em contato
3. Visita agendada
4. Proposta
5. Ganho
6. Perdido

Leads sem responsável permanecem no reservatório até a distribuição.

## Controle de presença por QR Code

O ChaveFlow CRM utiliza uma fila contínua de corretores habilitados por presença.

**Regras implementadas:**

- O QR Code é renovado automaticamente a cada cinco minutos.
- Somente o código vigente confirma presença.
- Cada confirmação habilita o corretor por cinco horas.
- A renovação durante a validade preserva sua posição.
- Após a expiração, uma nova confirmação coloca o corretor no final da fila.
- A validação utiliza o horário do banco de dados, evitando depender do relógio do navegador.

## Distribuição round-robin

A distribuição é iniciada pelo gestor e processa uma oportunidade por acionamento.

O algoritmo seleciona o **lead mais antigo do reservatório** e o **próximo corretor com presença válida**.

Após receber um lead, o corretor é movido para o final da fila.

O banco de dados garante a consistência da operação por meio de transações, bloqueios e restrições de integridade.

O sistema também:

- Ignora corretores com presença expirada.
- Impede a distribuição duplicada do mesmo lead.
- Registra o histórico com lead, corretor e data.
- Informa quando não existem leads disponíveis.
- Informa quando não existem corretores habilitados.

## Arquitetura e decisões técnicas

A aplicação utiliza uma arquitetura Full Stack com frontend React integrado diretamente ao Supabase.

```text
React + TypeScript
       |
       +-- Supabase Auth
       |       |
       |       +-- Autenticação e sessões
       |
       +-- PostgreSQL
               |
               +-- Row Level Security (RLS)
               |
               +-- Funções RPC
                       |
                       +-- Controle de presença
                       +-- Validação do QR Code
                       +-- Distribuição round-robin
                       +-- Histórico persistente
```

### Por que utilizar funções RPC no PostgreSQL?

As regras críticas são executadas no banco de dados, em vez de depender exclusivamente do frontend.

Essa decisão permite:

- Centralizar a validação de permissões.
- Utilizar um relógio confiável para controlar expirações.
- Garantir atomicidade nas distribuições.
- Controlar operações concorrentes.
- Impedir alterações indevidas na fila e no histórico.

### Segurança

O sistema combina Supabase Auth, RLS e permissões explícitas no PostgreSQL.

O gestor possui acesso administrativo aos leads, enquanto cada corretor visualiza somente as oportunidades sob sua responsabilidade.

As funções administrativas verificam o papel do usuário no banco de dados.

O frontend utiliza somente a chave publicável do Supabase. Chaves privilegiadas e credenciais de infraestrutura não são incluídas no código-fonte.

## Como executar localmente

### Pré-requisitos

- Node.js compatível com a versão do Vite utilizada no projeto
- npm
- Projeto Supabase

Clone o repositório:

```bash
git clone https://github.com/brunobonettib/chaveflow-crm.git
cd chaveflow-crm
```

Instale as dependências:

```bash
npm install
```

Crie `.env.local` a partir de `.env.example`:

```dotenv
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publicavel
VITE_APP_URL=http://localhost:5173
```

Inicie a aplicação:

```bash
npm run dev
```

Para validar o build de produção:

```bash
npm run build
```

O projeto utiliza configuração de rotas para permitir navegação direta entre páginas na Vercel.

**Observação:** para testar a leitura do QR Code em um celular, configure `VITE_APP_URL` com um endereço acessível pelo dispositivo, como a URL pública da aplicação.

Nunca utilize chaves secretas ou `service_role` em variáveis com prefixo `VITE_`.

## Configuração do Supabase

Crie um projeto Supabase e habilite a autenticação por e-mail e senha.

### Migrações do banco

As migrações estão disponíveis em `supabase/migrations/`.

Execute os arquivos na ordem indicada, utilizando o SQL Editor do Supabase com privilégios administrativos.

| Ordem | Arquivo | Finalidade |
|---|---|---|
| 1 | `20261112000000_create_profiles.sql` | Perfis e autorização |
| 2 | `20261112010000_create_leads.sql` | Leads, etapas e observações |
| 3 | `20261112020000_create_presenca.sql` | Presença e QR Code |
| 4 | `20261112030000_create_distribuicao.sql` | Distribuição e histórico |

As migrações criam tabelas, índices, políticas RLS, permissões e funções necessárias para o funcionamento da aplicação.

### Criação dos usuários

1. Acesse **Authentication → Users** no Supabase.
2. Crie as contas fictícias de demonstração.
3. Copie o UUID de cada usuário.
4. Cadastre o perfil correspondente em `public.profiles`.
5. Associe o papel `gestor` ou `corretor`.
6. Desabilite o cadastro público, caso as contas sejam administradas exclusivamente pelo projeto.

Exemplo de cadastro administrativo:

```sql
insert into public.profiles (id, nome, papel)
values (
  'UUID_DO_USUARIO',
  'Corretor Demo',
  'corretor'
);
```

Substitua o UUID pelo identificador do usuário criado no Supabase Auth e execute o comando como administrador.

O schema `private` deve permanecer fora dos schemas expostos pela Data API.

Configure também o endereço da aplicação em **Authentication → URL Configuration**.

As migrações não criam automaticamente as contas de demonstração nem os leads fictícios.

## Como testar as funcionalidades

### 1. Gestão de leads

Entre como gestor, cadastre um lead fictício e verifique que ele aparece no reservatório.

Edite os dados, registre uma observação e recarregue a página para conferir a persistência.

### 2. Controle de presença

No painel do gestor, exiba o QR Code.

Escaneie o código com a câmera de um celular, autentique-se como corretor e confirme a presença.

Confira a validade e a posição do corretor na fila.

### 3. Distribuição round-robin

Com corretores habilitados e leads disponíveis no reservatório, acione **Distribuir próximo lead**.

Confira o resultado, a movimentação do corretor na fila e o histórico.

Repita a operação para observar a distribuição circular.

### 4. Atendimento pelo corretor

Entre com a conta de um corretor que recebeu um lead.

Abra os detalhes, atualize a etapa e registre uma observação.

O corretor não pode consultar leads de outros profissionais nem executar operações administrativas.

## Testes e validação

Durante o desenvolvimento foram realizados:

- Builds de produção.
- Testes direcionados das regras de distribuição.
- Verificações de concorrência e rollback.
- Testes de permissões e políticas RLS.
- Rejeição de QR Code expirado.
- Renovação de presença com preservação da posição.
- Testes reais de leitura do QR Code pelo celular.
- Distribuições consecutivas com persistência do histórico.
- Verificações de responsividade em desktop e dispositivos móveis.

Os testes automatizados direcionados foram realizados durante o desenvolvimento. O repositório não inclui atualmente uma suíte automatizada completa e reproduzível.

## Uso de inteligência artificial

O desenvolvimento contou com apoio de **OpenAI Codex** e **ChatGPT**.

**Codex:** implementação de componentes React, integração com Supabase, migrações SQL, ajustes de interface e testes direcionados.

**ChatGPT:** análise dos requisitos, apoio às decisões de arquitetura, revisão das regras de negócio, orientação de testes e documentação.

As implementações foram acompanhadas de verificações manuais, builds e consultas SQL.

## Limitações conhecidas

- A aplicação utiliza exclusivamente dados fictícios para demonstração.
- O ambiente público é compartilhado e seus dados podem ser alterados por visitantes.
- O QR Code é exibido na área do gestor, sem uma tela independente para recepção.
- A confirmação de presença não utiliza geolocalização.
- A distribuição circular não possui animação visual de roleta.
- Os testes automatizados executados durante o desenvolvimento não estão integralmente versionados no repositório.
- A disponibilidade da demonstração depende dos serviços de hospedagem e banco de dados utilizados.

## Sobre o projeto

O ChaveFlow CRM surgiu de um desafio técnico Full Stack e foi posteriormente adaptado como projeto independente de portfólio.

O desenvolvimento priorizou uma aplicação funcional, responsiva e com regras críticas de negócio executadas de forma segura no PostgreSQL.

---

**ChaveFlow CRM — Projeto Full Stack de portfólio | 2026**