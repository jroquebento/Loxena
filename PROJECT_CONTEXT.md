# Loxena — Project Context

> Documento interno de contexto e continuidade do projeto.  
> Não é a documentação pública principal do GitHub.

**Projeto:** Loxena  
**Tipo:** Full Stack — Gestão de Operações Logísticas  
**Status:** Planejamento aprovado / Desenvolvimento ainda não iniciado  
**Versão do contexto:** 1.0

---

# 1. Objetivo do projeto

O Loxena é o segundo grande projeto de portfólio do desenvolvedor.

O projeto deve complementar o TaskManager API, que teve foco principalmente em backend.

### TaskManager

Principalmente:

- C#
- .NET
- ASP.NET Core
- REST API
- SQL Server
- autenticação
- testes
- Docker
- CI/CD
- GitHub Actions

### Loxena

Principalmente:

- React
- TypeScript
- JavaScript moderno
- HTML/CSS
- consumo de API REST
- desenvolvimento de interfaces
- integração frontend/backend
- CRUD Full Stack
- autenticação no frontend
- dashboards
- filtros e buscas
- uso consciente de IA durante o desenvolvimento

O objetivo não é competir com sistemas logísticos reais em complexidade.

O objetivo é demonstrar que o desenvolvedor consegue construir uma aplicação Full Stack funcional baseada em um problema de negócio plausível.

---

# 2. Princípio principal

> **Fluxo completo, regras suficientes para parecer real, poucas exceções.**

O projeto deve começar em nível médio e crescer gradualmente.

A prioridade é:

> **terminar um projeto bom > criar um projeto enorme e não terminar.**

O Loxena não deve virar um WMS completo.

Sempre que surgir uma possível funcionalidade ou tecnologia nova, devemos perguntar:

1. É necessária para o funcionamento?
2. Resolve um problema real do projeto?
3. Traz aprendizado relevante?
4. Aumenta significativamente a complexidade?
5. Existe uma solução mais simples?

Se uma funcionalidade não for necessária, ela deve permanecer fora do MVP.

---

# 3. Contexto do negócio

O Loxena representa uma empresa fictícia distribuidora de produtos eletrônicos.

A operação possui um ambiente de armazenagem e distribuição.

O projeto foi inspirado em experiências reais de operação logística, mas não deve reproduzir as regras ou convenções específicas de nenhuma empresa real.

No MVP:

- existe uma única unidade operacional;
- existe um estoque operacional;
- existem fornecedores;
- existem clientes;
- existem funcionários internos;
- os produtos entram através do recebimento;
- produtos são armazenados em localizações;
- clientes possuem pedidos;
- pedidos percorrem o fluxo operacional até entrega ou retirada.

---

# 4. Problemas que o sistema resolve

O sistema busca centralizar:

- informações de produtos;
- informações de clientes;
- estoque;
- localização física dos produtos;
- recebimentos;
- pedidos;
- andamento das operações;
- movimentações de estoque.

Problemas considerados:

- informações espalhadas;
- dificuldade para saber o estoque disponível;
- dificuldade para localizar produtos;
- perda de rastreabilidade;
- dificuldade para acompanhar pedidos;
- divergência entre estoque físico e sistema.

---

# 5. Usuários

## Usuário operacional

Executa atividades dos setores operacionais.

## Encarregado / líder

Acompanha e coordena atividades operacionais.

## Gerente

Acompanha informações operacionais e gerenciais.

## Administrador

Administra usuários, permissões e configurações administrativas.

## Cliente

Representa quem realiza um pedido.

No MVP, cliente não precisa possuir acesso ao sistema interno.

---

# 6. Fluxo logístico principal

```text
RECEBIMENTO
     ↓
ARMAZENAGEM
     ↓
ESTOQUE
     ↓
PEDIDO
     ↓
PAGAMENTO CONFIRMADO
     ↓
SEPARAÇÃO
     ↓
CONFERÊNCIA
     ↓
EMBALAGEM
     ↓
EXPEDIÇÃO
     ↓
ENTREGA / RETIRADA
```

---

# 7. Estados do pedido

Fluxo definido:

```text
CRIADO
   ↓
PAGAMENTO_CONFIRMADO
   ↓
SEPARANDO
   ↓
CONFERENCIA
   ↓
EMBALAGEM
   ↓
EXPEDICAO
   ↓
ENTREGUE / RETIRADO
```

O pedido pode ser cancelado antes da expedição.

Pedidos já expedidos não poderão ser cancelados no MVP.

---

# 8. Regras de negócio aprovadas

## Produtos

- Todo produto pertence a uma categoria.
- Produto possui propriedades básicas.
- Produto pode ser ativado/desativado.
- Produto desativado não pode ser utilizado em novos pedidos.
- Produto com estoque existente não deve ser excluído fisicamente.

## Estoque

- Um produto pode estar em várias localizações.
- Uma localização pode possuir diferentes produtos.
- Estoque possui quantidade física.
- Estoque possui quantidade reservada.
- Estoque disponível = físico - reservado.
- Reserva acontece somente após confirmação do pagamento.
- Cancelamento libera a reserva.
- Saída física ocorre na expedição.
- Alterações relevantes devem gerar movimentação.

## Recebimento

- Recebimento possui fornecedor.
- Recebimento possui vários itens.
- Item representa um produto e quantidade.
- O estoque físico aumenta quando o produto é efetivamente armazenado.

## Pedidos

- Pedido pertence a um cliente.
- Pedido possui vários itens.
- Item representa um produto e quantidade.
- Pedido possui estado.
- Pedido pode ser cancelado antes da expedição.
- Pedido pago reserva estoque.

## Operação

- Separação utiliza produto, quantidade e localização.
- Conferência verifica produto e quantidade.
- Divergências não devem criar um subsistema complexo no MVP.
- Embalagem é uma etapa operacional simples.
- Expedição representa a saída física.
- Entrega ou retirada conclui o pedido.

---

# 9. Estoque e rastreabilidade

O sistema deve evitar alterações silenciosas.

Tipos iniciais de movimentação:

```text
ENTRADA
SAIDA
RESERVA
LIBERACAO_RESERVA
AJUSTE_POSITIVO
AJUSTE_NEGATIVO
```

Motivos de ajuste podem incluir:

```text
INVENTARIO
AVARIA
```

Avarias não terão um módulo próprio no MVP.

---

# 10. Inventário

O MVP terá inventário simplificado.

Fluxo:

```text
Quantidade no sistema
        ↓
Contagem física
        ↓
Comparação
        ↓
Diferença
        ↓
Ajuste
        ↓
Movimentação registrada
```

Não será criado inicialmente um sistema avançado de inventário, contagens cíclicas ou planejamento de inventário.

---

# 11. Localização

Não utilizar o formato específico:

```text
715-34-0-101
```

Esse formato pertence à experiência real que serviu como inspiração.

O Loxena utilizará uma entidade genérica:

```text
Location
```

O código da localização pode seguir um formato simples definido pelo próprio sistema.

Exemplos:

```text
A-01-03
A-02-05
B-01-02
```

O formato exato ainda não é uma decisão arquitetural importante.

---

# 12. Entidades iniciais

## Acesso

```text
User
```

## Catálogo

```text
Product
Category
```

## Pessoas externas

```text
Customer
Supplier
```

## Armazém

```text
Location
```

## Estoque

```text
Inventory
StockMovement
```

## Recebimento

```text
Receiving
ReceivingItem
```

## Pedidos

```text
Order
OrderItem
```

Total inicial:

**12 entidades.**

---

# 13. Relacionamentos principais

```text
Category 1 ─── N Product

Customer 1 ─── N Order

Order 1 ─── N OrderItem

Product 1 ─── N OrderItem

Supplier 1 ─── N Receiving

Receiving 1 ─── N ReceivingItem

Product 1 ─── N ReceivingItem

Product 1 ─── N Inventory

Location 1 ─── N Inventory

Product 1 ─── N StockMovement
```

Os processos de:

- separação;
- conferência;
- embalagem;
- expedição;

não serão automaticamente transformados em entidades.

Primeiro devemos verificar se o estado do pedido e registros existentes são suficientes.

---

# 14. Arquitetura planejada

Backend:

```text
backend/
├── Loxena.Api
├── Loxena.Application
├── Loxena.Domain
└── Loxena.Infrastructure
```

Frontend:

```text
frontend/
└── Loxena.Web
```

A arquitetura deve permanecer pragmática.

Não devemos copiar automaticamente todas as abstrações utilizadas no TaskManager.

---

# 15. Stack aprovada

## Backend

- C#
- .NET 10
- ASP.NET Core
- Entity Framework Core
- SQL Server
- REST API
- JWT
- Swagger/OpenAPI
- xUnit
- Moq

## Frontend

- React
- TypeScript
- JavaScript
- HTML
- CSS
- React Router

## Infraestrutura

- Git
- GitHub
- Docker
- Docker Compose
- GitHub Actions

---

# 16. Tecnologias ainda não decididas

Não adicionar por obrigação:

- Axios;
- Tailwind;
- biblioteca de componentes;
- Redux/Zustand;
- React Query;
- React Hook Form;
- bibliotecas de validação;
- bibliotecas de gráficos.

Cada uma deverá ser avaliada quando surgir uma necessidade real.

---

# 17. Idioma

Padrão definido:

### Código

Inglês.

Exemplos:

```text
Product
Order
Customer
Inventory
StockMovement
ConfirmPayment()
Cancel()
```

### Commits e branches

Inglês.

Exemplos:

```text
feature/create-product
feature/order-stock-reservation
fix/order-cancellation
```

### README

Inglês.

### PROJECT_CONTEXT

Português.

### Comunicação e explicações

Português.

Objetivo:

> O projeto segue convenções profissionais internacionais, enquanto o aprendizado e as decisões são discutidos em português.

---

# 18. Git

O projeto será versionado desde o início.

Não é obrigatório reproduzir exatamente o fluxo do TaskManager.

Branches serão utilizadas quando agregarem organização.

Commits devem representar mudanças compreensíveis.

Pull Requests poderão ser utilizados para funcionalidades relevantes, mesmo sendo um projeto individual, quando isso ajudar a simular um fluxo profissional ou revisar uma mudança importante.

---

# 19. IA durante o desenvolvimento

IA é considerada ferramenta de desenvolvimento.

Pode ser utilizada para:

- pesquisa;
- explicação;
- código repetitivo;
- debugging;
- testes;
- revisão;
- documentação;
- comparação de soluções.

Ferramentas possíveis:

- ChatGPT;
- Gemini;
- GitHub Copilot.

### Regra

Nenhum código deve ser incorporado apenas porque uma IA o produziu.

O desenvolvedor precisa compreender o código e a decisão.

### Uso de segunda opinião

Quando houver uma decisão relevante ou dúvida que possa se beneficiar de uma perspectiva independente, o orientador deverá indicar explicitamente:

> **"Preciso de uma segunda opinião do Gemini."**

ou:

> **"Use o Copilot para gerar somente o boilerplate desta parte."**

Também deve explicar:

- por que a ferramenta está sendo utilizada;
- o que perguntar;
- o que não pedir;
- como avaliar a resposta.

---

# 20. MVP

O MVP precisa permitir que o sistema execute um fluxo completo.

### Fluxo mínimo

```text
Cadastrar categoria
        ↓
Cadastrar produto
        ↓
Cadastrar localização
        ↓
Receber produto
        ↓
Armazenar produto
        ↓
Consultar estoque
        ↓
Cadastrar cliente
        ↓
Criar pedido
        ↓
Confirmar pagamento
        ↓
Reservar estoque
        ↓
Separar
        ↓
Conferir
        ↓
Embalar
        ↓
Expedir
        ↓
Entregar / Retirar
```

Também deve existir:

```text
Inventário
    ↓
Diferença
    ↓
Ajuste de estoque
```

---

# 21. Fora do MVP

Explicitamente fora do escopo inicial:

- múltiplos centros de distribuição;
- múltiplas unidades;
- gestão avançada de transportadoras;
- cálculo de frete;
- emissão real de nota fiscal;
- integração fiscal;
- cubagem;
- gestão avançada de embalagens;
- etiquetas;
- trocas;
- devoluções complexas;
- recicláveis;
- quarentena;
- validade;
- lotes avançados;
- compras;
- contratos;
- integrações externas;
- IA como funcionalidade do produto.

Esses itens só poderão voltar à discussão depois do MVP.

---

# 22. Roadmap

## Fase 0 — Fundação

- repositório;
- solução;
- backend;
- frontend;
- banco;
- configuração inicial;
- Git.

## Fase 1 — Acesso e catálogo

- autenticação;
- usuários;
- categorias;
- produtos;
- primeira interface.

## Fase 2 — Estoque

- localização;
- inventory;
- stock movements;
- consulta;
- inventário;
- ajustes.

## Fase 3 — Recebimento

- supplier;
- receiving;
- receiving items;
- armazenagem;
- entrada de estoque.

## Fase 4 — Pedidos

- customer;
- order;
- order items;
- pagamento;
- reserva;
- cancelamento.

## Fase 5 — Operação

- picking;
- checking;
- packing;
- shipping;
- saída de estoque.

## Fase 6 — Entrega / retirada

- tipos de entrega;
- confirmação;
- conclusão.

## Fase 7 — Dashboard

- indicadores;
- filtros;
- buscas;
- gráficos quando justificáveis.

## Fase 8 — Qualidade

- testes;
- tratamento de erros;
- autorização;
- Docker;
- Docker Compose;
- GitHub Actions;
- responsividade;
- UX;
- documentação.

---

# 23. Ordem de implementação

O desenvolvimento deverá seguir uma lógica de **incrementos utilizáveis**.

Não devemos construir todo o backend primeiro e deixar o frontend para o final.

Sempre que possível:

```text
Backend mínimo
      ↓
Endpoint
      ↓
Frontend correspondente
      ↓
Integração
      ↓
Teste
      ↓
Próximo incremento
```

O objetivo é que o sistema se torne utilizável progressivamente.

---

# 24. Critérios para adicionar complexidade

Antes de adicionar uma abstração, biblioteca, padrão ou entidade, perguntar:

> **Qual problema concreto isso resolve?**

Exemplos:

Não criar uma entidade `PickingOperation` apenas porque existe um setor chamado separação.

Não criar `PackagingServiceFactoryStrategy` se uma implementação simples resolve o problema.

Não adicionar Redux se o estado da aplicação ainda puder ser administrado de forma simples.

Não adicionar Axios apenas porque outros projetos utilizam.

Não adicionar Clean Architecture extremamente detalhada apenas por ser considerada "boa prática".

A arquitetura deve servir ao sistema e ao aprendizado.

---

# 25. Estado atual

```text
[████████████████████] Planejamento

[                    ] Implementação
```

### Já decidido

- nome: Loxena;
- domínio;
- problema;
- usuários;
- fluxo;
- MVP;
- principais regras;
- entidades iniciais;
- arquitetura geral;
- stack base;
- idioma;
- estratégia de IA;
- roadmap.

### Ainda não implementado

Tudo relacionado ao código.

---

# 26. Próxima etapa

A próxima etapa é:

**Preparar o repositório GitHub e iniciar a Fase 0.**

Ordem:

```text
GitHub
   ↓
README.md
   ↓
PROJECT_CONTEXT.md
   ↓
.gitignore
   ↓
Primeiro commit
   ↓
Criar solução
   ↓
Criar backend
   ↓
Criar frontend
```

Nenhuma funcionalidade de negócio deve ser implementada antes da fundação estar funcionando.

---

# 27. Regra para continuidade entre conversas

Quando uma nova conversa for iniciada para continuar o projeto, o `PROJECT_CONTEXT.md` deve ser considerado a fonte principal das decisões do projeto.

Ao final de uma etapa importante, o documento deverá ser atualizado com:

- decisões novas;
- mudanças de escopo;
- tecnologias adicionadas/removidas;
- regras alteradas;
- progresso;
- problemas conhecidos;
- próximo passo.

O arquivo deve permanecer enxuto e atualizado.

---

# 28. Filosofia final

O Loxena é um projeto de portfólio e aprendizado.

Não precisa demonstrar que o desenvolvedor sabe implementar todas as tecnologias existentes.

Precisa demonstrar que sabe:

```text
Entender um problema
      ↓
Modelar uma solução
      ↓
Criar uma API
      ↓
Persistir dados
      ↓
Aplicar regras de negócio
      ↓
Construir uma interface
      ↓
Consumir uma API
      ↓
Integrar Frontend + Backend
      ↓
Testar
      ↓
Versionar
      ↓
Fazer deploy / automatizar
      ↓
Entregar
```

> **O objetivo não é construir o maior sistema possível.**
>
> **É construir um sistema suficientemente real para demonstrar competência Full Stack.**