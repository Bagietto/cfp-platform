## 1. Shared Contract and Backend Validation

- [x] 1.1 Confirmar o uso de `SpeakerDTO` de `shared-types` como contrato compartilhado do fluxo de CFP e documentar como o backend mantera compatibilidade estrutural com ele.
- [x] 1.2 Criar o modulo de CFP no app `api/` com controller e service dedicados para submissao de palestras.
- [x] 1.3 Adicionar DTO de entrada decorado com `class-validator` e integrar o endpoint NestJS com `@Body()` e validacao estrita para rejeitar campos ausentes, invalidos ou inesperados.
- [x] 1.4 Criar testes Jest no backend cobrindo payloads invalidos e garantindo respostas `400 Bad Request`.

## 2. Frontend Submission Experience

- [x] 2.1 Criar a rota e o componente standalone de submissao de CFP no app `frontend/`.
- [x] 2.2 Modelar o estado local do formulario com Signals, incluindo estado inicial, disponibilidade do submit e status de envio.
- [x] 2.3 Implementar o formulario com os campos do contrato `SpeakerDTO` e aplicar requisitos WAI-ARIA para labels, erros e estados de interacao.
- [x] 2.4 Integrar o envio do formulario ao endpoint da API usando o contrato compartilhado de `shared-types`.

## 3. Frontend Quality and Completion

- [x] 3.1 Criar testes Jest no frontend validando o estado inicial do Signal do modulo de CFP.
- [x] 3.2 Criar testes Jest no frontend validando que o botao de envio permanece bloqueado enquanto o formulario estiver invalido ou incompleto.
- [x] 3.3 Revisar o fluxo completo para garantir consistencia entre contrato compartilhado, validacao do backend e comportamento do frontend.
