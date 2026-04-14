## API de Colaboradores (Top Limp)

Base URL (dev): `http://localhost:3001`

### Autenticação (escrita)

Se a variável de ambiente `ADMIN_TOKEN` estiver configurada no backend, as rotas de escrita exigem:

`Authorization: Bearer <ADMIN_TOKEN>`

Se `ADMIN_TOKEN` não estiver configurado, o backend permite escrita (modo desenvolvimento).

### Modelo de dados (campos)

- `nome` (string, obrigatório)
- `funcao` (string, obrigatório)
- `status` (string: `ativo|inativo|afastado|ferias|folga|desligado`)
- `cpf` (string, obrigatório, 11 dígitos, único)
- `rg` (string)
- `ctps` (string)
- `pis` (string)
- `dataNascimento` (date/string) aceita: `dd/mm/aaaa`, `ddmmaaaa` ou `yyyy-mm-dd`
- `dataAdmissao` (date/string) aceita: `dd/mm/aaaa`, `ddmmaaaa` ou `yyyy-mm-dd`
- `telefone` (string)
- `email` (string)
- `tipoEscala` (string: `6x1|5x2|12x36|outros`)
- `diaFolgaSemanal` (string: `domingo|segunda-feira|terca-feira|quarta-feira|quinta-feira|sexta-feira|sabado`)
- `senhaPortal` (string, opcional; armazenada como hash no servidor)
- `observacoes` (string)
- `arquivado` (boolean)

### Respostas padrão

Sucesso:

```json
{ "success": true, "message": "..." }
```

Erro:

```json
{ "success": false, "message": "...", "errors": { "campo": "..." } }
```

### Endpoints

#### GET `/api/colaboradores`

Lista colaboradores com paginação, ordenação e filtros.

Query params:
- `q` (string) pesquisa por nome/e-mail/CPF
- `status` (string) filtra por status
- `arquivados` (`0|1|false|true`) `0` lista ativos (padrão), `1` lista arquivados
- `page` (number) padrão `1`
- `limit` (number) padrão `12`, máximo `100`
- `sortBy` (`nome|cpf|createdAt|updatedAt|status`) padrão `nome`
- `sortDir` (`asc|desc`) padrão `asc`

Resposta:

```json
{
  "success": true,
  "message": "Colaboradores encontrados com sucesso",
  "page": 1,
  "limit": 12,
  "total": 120,
  "items": []
}
```

#### GET `/api/colaboradores/:id`

Busca por ID.

#### POST `/api/colaboradores`

Cria colaborador.

Observação: `cpf` é obrigatório e único; CPF inválido retorna `400`, CPF duplicado retorna `409`.

#### PUT `/api/colaboradores/:id`

Atualiza colaborador.

Observação: `cpf` não pode ser alterado (retorna `400` se enviado).

Para arquivar/desarquivar:

```json
{ "arquivado": true }
```

#### DELETE `/api/colaboradores/:id`

Remove colaborador (hard delete).

