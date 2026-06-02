## Context

O workspace atual possui uma aplicacao Angular 21 em `frontend/`, uma API NestJS em `api/` e uma biblioteca `shared-types` que ja exporta `SpeakerDTO` com os campos `id`, `name`, `email`, `talkTitle` e `isGDE`. Hoje nao existe modulo de CFP, e a base ainda esta proxima do scaffold inicial das duas apps.

O pedido exige regras arquiteturais estritas:
- Frontend com Standalone Components, Signals e conformidade WAI-ARIA.
- Backend com NestJS usando `@Body()` e validacao estrita com `class-validator`.
- Consumo compartilhado do contrato `SpeakerDTO` vindo de `shared-types`.
- Testes unitarios obrigatorios com Jest, incluindo rejeicao `400 Bad Request` no backend e verificacoes de estado inicial de Signal e bloqueio do botao no frontend.

## Goals / Non-Goals

**Goals:**
- Definir um modulo de submissao de palestras ponta a ponta, sem implementar ainda o codigo.
- Estabelecer uma arquitetura que mantenha um contrato de dados consistente entre frontend e backend.
- Garantir que a experiencia de submissao tenha acessibilidade basica e validacao previsivel.
- Planejar a cobertura minima de testes para prevenir regressao nos pontos criticos do fluxo.

**Non-Goals:**
- Nao incluir painel administrativo, revisao de propostas ou workflow de aprovacao.
- Nao incluir persistencia definitiva em banco de dados nesta mudanca inicial, a menos que ela seja necessaria para suportar a submissao minima.
- Nao remodelar `SpeakerDTO` nesta proposta; o fluxo deve partir do contrato ja exportado.
- Nao implementar testes E2E ou automacao visual nesta fase de planejamento.

## Decisions

### 1. Organizar a capability em torno de um unico fluxo `cfp-submission`

O change sera especificado como uma capability unica, cobrindo exibicao do formulario, validacao do envio e processamento do payload.

Alternativas consideradas:
- Separar em duas capabilities, uma de frontend e outra de backend.
  - Rejeitada porque aumentaria a fragmentacao de uma entrega pequena e fortemente acoplada ao mesmo contrato.

### 2. Usar `SpeakerDTO` de `shared-types` como contrato canônico

Frontend e backend devem depender do mesmo DTO exportado, reduzindo divergencia de campos entre tela e API. No backend, ainda sera necessario um DTO de entrada decorado com `class-validator`, mas ele deve manter compatibilidade estrutural com `SpeakerDTO` para preservar o contrato compartilhado.

Alternativas consideradas:
- Duplicar a interface no frontend e no backend.
  - Rejeitada porque cria risco de drift de contrato.
- Decorar diretamente `SpeakerDTO`.
  - Rejeitada em principio porque interfaces TypeScript nao carregam metadata de validacao em runtime para o NestJS.

### 3. Implementar o frontend com Standalone Component e estado baseado em Signals

O formulario de CFP deve ser encapsulado em um componente standalone, com Signals controlando estado inicial, status de envio e habilitacao do submit. Isso atende a regra arquitetural e simplifica os testes do comportamento inicial.

Alternativas consideradas:
- Usar RxJS Subjects ou estado apenas derivado do formulario.
  - Rejeitada porque a exigencia explicita e Signals, e isso reduziria a clareza do estado observado nos testes.

### 4. Aplicar requisitos WAI-ARIA desde o formulario inicial

Campos, mensagens de erro e botao de envio devem ser planejados com rotulos acessiveis, associacao de erros e indicacoes semanticas de estado. O foco aqui e permitir que a accessibility seja parte da definicao do modulo, nao uma correcao posterior.

Alternativas consideradas:
- Tratar acessibilidade como refinamento posterior.
  - Rejeitada porque conflita com a restricao explicita do pedido.

### 5. Validacao estrita no backend via `ValidationPipe` e DTO decorado

O endpoint NestJS deve receber payload no `@Body()` e rejeitar entradas invalidas com `400 Bad Request`. O desenho assume uso de validacao estrita com whitelist e recusa de campos inesperados para garantir previsibilidade do contrato.

Alternativas consideradas:
- Validacao manual no controller ou service.
  - Rejeitada por ser menos consistente e mais sujeita a falhas.
- Confiar apenas na validacao do frontend.
  - Rejeitada porque nao protege a API.

### 6. Tornar os testes unitarios parte do criterio de pronto

O plano inclui testes Jest no backend para payloads invalidos e no frontend para estado inicial do Signal e desabilitacao do botao de envio. Esses testes cobrem as restricoes mais sensiveis do change.

Alternativas consideradas:
- Adiar os testes para uma fase posterior.
  - Rejeitada porque conflita com a exigencia de qualidade do pedido.

## Risks / Trade-offs

- [Contrato compartilhado sem decorators de runtime] → Mitigar com um DTO de validacao no NestJS que mantenha mapeamento 1:1 com `SpeakerDTO` e com testes para detectar divergencias.
- [Divergencia entre caminhos pedidos e caminhos reais do workspace] → Mitigar documentando que a implementacao ocorrera nos apps atuais `frontend/` e `api/`, preservando Angular 21 e NestJS do workspace existente.
- [Formulario acessivel exigir mais estrutura do que um scaffold simples] → Mitigar prevendo desde o inicio labels, atributos ARIA, mensagens de erro e testes que verifiquem estados de interacao essenciais.
- [Uso de `id` em `SpeakerDTO` para uma submissao inicial] → Mitigar definindo no design de implementacao se o frontend envia um identificador gerado localmente ou se o backend complementa esse campo antes da resposta, sem alterar o contrato nesta fase.

## Migration Plan

1. Adicionar a capability e o plano de implementacao no OpenSpec.
2. Implementar primeiro o contrato de integracao entre frontend, backend e `shared-types`.
3. Entregar o endpoint com validacao estrita antes de ligar o submit do frontend.
4. Conectar o formulario Angular ao endpoint somente depois dos testes unitarios basicos estarem definidos.
5. Em caso de rollback, remover a rota do frontend e o endpoint do backend mantendo `shared-types` sem mudancas de comportamento.

## Open Questions

- O campo `id` de `SpeakerDTO` sera preenchido no cliente antes do envio ou atribuido pelo backend no processamento?
- O endpoint deve apenas aceitar a submissao e retornar confirmacao, ou tambem ecoar o objeto normalizado da palestra submetida?
- O fluxo inicial precisara de persistencia real, ou uma implementacao em memoria sera suficiente para a primeira iteracao do modulo?
