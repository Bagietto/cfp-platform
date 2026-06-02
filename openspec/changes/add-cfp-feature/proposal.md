## Why

O produto ainda nao possui um fluxo formal de Call for Papers, o que impede o cadastro estruturado de palestrantes e dificulta a validacao consistente dos dados enviados. Este change cria a base funcional para receber submissões de palestras com contrato compartilhado entre frontend e backend e com cobertura minima de testes obrigatorios.

## What Changes

- Adicionar um fluxo de submissao de palestras no frontend Angular com formulario acessivel, componentes standalone e estado local baseado em Signals.
- Adicionar um endpoint de submissao no backend NestJS com validacao estrita de payload via `class-validator` usando `@Body()`.
- Padronizar o payload da submissao para consumir o contrato `SpeakerDTO` exportado pela biblioteca `shared-types`.
- Definir cobertura de testes unitarios com Jest para o frontend e backend como parte obrigatoria da entrega.
- Estabelecer regras de acessibilidade e comportamento inicial do formulario, incluindo bloqueio do envio enquanto os dados nao forem validos.

## Capabilities

### New Capabilities
- `cfp-submission`: Permite que palestrantes submetam propostas de palestra por meio de um formulario acessivel no frontend e de um endpoint validado no backend, ambos alinhados ao contrato compartilhado `SpeakerDTO`.

### Modified Capabilities
- Nenhuma.

## Impact

- Frontend Angular 21 no app atual `frontend/`, com nova rota, formulario standalone, Signals e testes Jest.
- Backend NestJS no app atual `api/`, com novo controller/service/DTO de entrada, pipeline de validacao e testes Jest para rejeicao de payload invalido.
- Biblioteca `shared-types`, que passa a ser a fonte de contrato consumida pelas duas aplicacoes para `SpeakerDTO`.
- Fluxo de desenvolvimento do workspace Nx, por exigir sincronizacao entre app web, API e tipos compartilhados.
