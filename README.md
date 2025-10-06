## 🚀 Tecnologias

Principais tecnologias do projeto:

- [TypeScript](https://www.typescriptlang.org/) - Linguagem principal
- [NestJS](https://nestjs.com/) - Framework backend
- [Kysely](https://kysely.dev/) - Query builder type-safe
- [Kanel](https://kristiandupont.github.io/kanel/) - Gerador de tipos do banco
- [Jest](https://jestjs.io/pt-BR/) - Framework de testes
- [Sentry](https://sentry.io/) - Monitoramento de erros
- [Prometheus](https://prometheus.io/) - Métricas da aplicação
- [AWS SDK](https://aws.amazon.com/sdk-for-javascript/) - Integração com AWS

## 📋 Pré-requisitos

### Ferramentas necessárias

- [Node.js](https://nodejs.org/en/) (versão 22.11.0 ou superior)
- [AWS CLI](https://aws.amazon.com/cli/) configurado com perfil IAM
- [PostgreSQL](https://www.postgresql.org/) para o banco de dados
- [Biome](https://biomejs.dev/pt-br/) (considere instalar o plugin no seu editor)

### Configuração AWS

**IMPORTANTE**: Para usar o script `load-env.ts`, você precisa ter sua conta IAM configurada na AWS CLI:

```bash
# Configure seu perfil AWS (recomendado)
$ aws configure --profile gbm-profile

# Ou configure as credenciais padrão
$ aws configure
```

O script carrega automaticamente as variáveis de ambiente do AWS Secrets Manager baseado no nome do projeto.

## 🚀 Executando o Projeto

### 1. Configuração inicial

```bash
# Clone o repositório
$ git clone <repository-url>
$ cd gbm-app-template-backend

# Instale as dependências
$ npm install

# Configure o arquivo kysely.config.ts com o nome do seu projeto
# Altere o nome da tabela de migrations e lock conforme necessário
```

### 2. Configuração do ambiente

```bash
# Carregue as variáveis de ambiente do AWS Secrets Manager
$ npm run env:pull

# Rode as migrations do banco de dados
$ npm run migrate:latest

# Gere a tipagem do banco de dados
$ npm run kanel
```

### 3. Executar a aplicação

```bash
# Modo desenvolvimento
$ npm run start

# Modo watch (recomendado para desenvolvimento)
$ npm run start:dev

# Modo produção
$ npm run start:prod
```

### 4. Executar testes

```bash
# Testes unitários
$ npm run test

# Testes com watch
$ npm run test --watch

# Cobertura de testes
$ npm run test --coverage
```

## 🗄️ Banco de Dados

### Comandos Kysely

```bash
# Criar nova migration
$ npx kysely migrate:make create_users_table

# Criar nova seed
$ npx kysely seed:make seed_initial_users

# Executar migrations
$ npm run migrate:latest

# Executar seeds
$ npm run seed:run

# Gerar tipagem do banco
$ npm run kanel
```

### Exemplo de Migration

```typescript
import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('email', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('created_at', 'timestamp', (col) => 
      col.defaultTo(sql`now()`).notNull()
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute()
}
```

## 🏗️ Arquitetura e Padrões

### Repository Pattern

O projeto utiliza o Repository Pattern para abstrair o acesso aos dados. Crie repositories para entidades principais:

```typescript
// src/infra/repositories/user.repository.ts
import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { DATABASE_CONNECTION } from "@/infra/database/database.module";
import Database from "@/infra/database/schema/Database";
import { UsersId } from "@/infra/database/schema/public/Users";
import { Repository } from "./interfaces";

export class UserRepository extends Repository<Database>(DATABASE_CONNECTION) {
  async findById(id: UsersId) {
    return await this.db
      .withSchema("public")
      .selectFrom("users")
      .where("id", "=", id)
      .selectAll()
      .executeTakeFirstOrThrow();
  }

  async findByEmail(email: string) {
    return await this.db
      .withSchema("public")
      .selectFrom("users")
      .where("email", "=", email)
      .selectAll()
      .executeTakeFirst();
  }

  async create(userData: CreateUserData) {
    return await this.db
      .withSchema("public")
      .insertInto("users")
      .values(userData)
      .returning("id")
      .executeTakeFirstOrThrow();
  }
}
```

**Quando criar um Repository:**
- Para cada entidade principal do domínio
- Quando há queries complexas que precisam ser reutilizadas
- Para abstrair detalhes de implementação do banco de dados
- Para facilitar testes unitários


## 🛠️ Utilitários Disponíveis

### Formatação de Data

O projeto possui utilitários para manipulação de datas usando `dayjs`:

```typescript
import dayjs from "@/lib/dayjs";
import { 
  isAfter, 
  isAfterOrSame, 
  format, 
  formatWithTime, 
  formatWithTimezone,
  addOneDay,
  diffInMinutes 
} from "@/shared/utils/date";

// Exemplos de uso
const now = dayjs();
const formattedDate = now.format("DD/MM/YYYY HH:mm:ss");
const isoString = now.toISOString();

// Verificar se uma data é posterior
const isLater = isAfter("2024-12-25", "2024-12-24"); // true

// Formatar com timezone
const saoPauloTime = formatWithTimezone(new Date(), "America/Sao_Paulo");
// "2024-12-20T15:30:00-03:00"

// Adicionar tempo específico
const withTime = formatWithTime("2024-12-20", "14:30:00", "America/Sao_Paulo");

// Diferença em minutos
const minutes = diffInMinutes(new Date(), dayjs().subtract(2, 'hours').toDate());
// 120
```

### Formatação de Números

```typescript
import { formatDecimal } from "@/shared/utils/number";

// Exemplos de uso
const price = formatDecimal(1234.5678, 2); // "1234.57"
const weight = formatDecimal(42.1, 3); // "42.100"
const percentage = formatDecimal(0.156789, 4); // "0.1568"
```

### Serviço de Bucket (AWS S3)

```typescript
import { BucketService } from "@/infra/bucket/bucket.service";

// Gerar URL de upload
const uploadData = await bucketService.generateUploadUrl(
  "trucks", // ou "wagons"
  "documento.pdf",
  "application/pdf"
);
// Retorna: { url: "presigned-url", key: "path/key", expiresIn: 900 }

// Obter URL de download
const downloadUrl = await bucketService.get("images/trucks/uuid.jpg");

// Deletar múltiplos arquivos
await bucketService.deleteObjects([
  "images/trucks/old-image.jpg",
  "videos/wagons/old-video.mp4"
]);

// Identificar tipo de arquivo
const fileType = bucketService.defineType("image/jpeg"); // "photo"
const videoType = bucketService.defineType("video/mp4"); // "video"
const docType = bucketService.defineType("application/pdf"); // "file"
```

### DTOs e Validação

Use as classes base para DTOs consistentes:

```typescript
import { BaseEntityDTO, SupportedLanguages } from "@/infra/repositories/dto/base";
import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsEnum } from "class-validator";

export class UserDTO extends BaseEntityDTO {
  @ApiProperty({ example: "João Silva" })
  @IsString()
  name!: string;

  @ApiProperty({ example: "joao@gbmlogistica.com.br" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "2024-01-15T10:30:00Z" })
  @IsDateString()
  createdAt!: string;

  @ApiProperty({ example: 1500.75 })
  @IsNumber()
  salary!: number;

  @ApiProperty({ example: "pt-br", enum: ["en-us", "pt-br", "es"] })
  @IsEnum(["en-us", "pt-br", "es"])
  language!: SupportedLanguages;
}
```

### Tratamento de Erros

Crie erros customizados seguindo o padrão:

```typescript
// src/shared/errors/user-not-found-error.ts
import { NotFoundException } from "@nestjs/common";
import { SupportedLanguages } from "@/infra/repositories/dto/base";

export class UserNotFoundError extends NotFoundException {
  constructor(language: SupportedLanguages = "pt-br") {
    const errorMessage = {
      "en-us": "User not found",
      "pt-br": "Usuário não encontrado",
      "es": "Usuario no encontrado",
    };

    super(errorMessage[language]);
    this.name = "UserNotFoundError";
  }
}
```

## 📊 Monitoramento e Observabilidade

### Métricas Prometheus

O projeto inclui métricas automáticas disponíveis em `/metrics`:

- `http_requests_total` - Contador de requisições HTTP
- `http_request_duration_seconds` - Duração das requisições
- `http_request_size_bytes` - Tamanho das requisições
- `app_uptime_seconds` - Tempo de atividade da aplicação

### Sentry

Monitoramento de erros configurado automaticamente. Configure a variável `SENTRY_DSN` no ambiente:

```bash
SENTRY_DSN=https://your-project@sentry.io/project-id
```

### Swagger/Documentação API

A documentação da API está disponível em `/doc` quando `NODE_ENV !== "production"`.

**Credenciais de acesso:**
- **Usuário:** admin
- **Senha:** Gbmtech@3344

## 🧪 Testes

### Estrutura de Testes

Use o padrão estabelecido para testes unitários:

```typescript
// src/services/__test__/user.service.spec.ts
import { Mocked, TestBed } from "@suites/unit";
import { UserService } from "../user.service";
import { UserRepository } from "@/infra/repositories/user.repository";

describe("UserService", () => {
  let service: UserService;
  let repository: Mocked<UserRepository>;
  let unitOfWork: Mocked<UnitOfWork<Database>>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();
    
    service = unit;
    unitOfWork = unitRef.get<UnitOfWork<Database>>(UnitOfWork);
    repository = mockClass(UserRepository);
  });

  it("should find user by id", async () => {
    // Arrange
    const userId = 123;
    const mockUser = { 
      id: userId, 
      name: "João Silva", 
      email: "joao@test.com" 
    };

    unitOfWork.getRepository.mockReturnValue(repository);
    repository.findById.mockResolvedValue(mockUser);

    // Act
    const result = await service.findById(userId);

    // Assert
    expect(result).toEqual(mockUser);
    expect(repository.findById).toHaveBeenCalledWith(userId);
  });

  it("should throw error when user not found", async () => {
    unitOfWork.getRepository.mockReturnValue(repository);
    // Arrange
    repository.findById.mockRejectedValue(new Error("User not found"));

    // Act & Assert
    await expect(service.findById(999)).rejects.toThrow("User not found");
  });
});
```

### Comandos de Teste

```bash
# Executar todos os testes
$ npm run test

# Testes em modo watch
$ npm run test --watch

# Executar testes específicos
$ npm run test -- user.service.spec.ts

# Cobertura de código
$ npm run test --coverage
```

## ⚙️ Configurações de Ambiente

### Variáveis Obrigatórias

Configure as seguintes variáveis no arquivo `.env` ou AWS Secrets Manager:

```bash
# Banco de dados
DATABASE_URL=postgres://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=user
DATABASE_PASSWORD=password
DATABASE_NAME=dbname

# Autenticação
JWT_SECRET=your-super-secret-jwt-key-here

# APIs externas
TOT_GUARD_URL=https://api.totguard.com

# AWS
AWS_BUCKET_NAME=gbm-bucket-name

# Aplicação
PORT=3000
NODE_ENV=development
TZ=UTC

# Monitoramento (opcional)
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
```

### Exemplo de Configuração AWS Secrets Manager

```json
{
  "DATABASE_URL": "postgresql://user:pass@host:5432/db",
  "JWT_SECRET": "super-secret-key",
  "TOT_GUARD_URL": "https://api.totguard.com",
  "AWS_BUCKET_NAME": "gbm-production-bucket",
  "SENTRY_DSN": "https://key@sentry.io/project"
}
```

## 📝 Convenções e Padrões

### Nomenclatura
- **Arquivos:** kebab-case (`user-service.ts`)
- **Classes:** PascalCase (`UserService`)
- **Métodos:** camelCase (`findById`)
- **Constantes:** UPPER_SNAKE_CASE (`DATABASE_CONNECTION`)
- **Variáveis:** camelCase (`userData`)

### Estrutura de Pastas
```
src/
├── config/          # Configurações da aplicação
├── infra/           # Infraestrutura (banco, APIs, etc.)
│   ├── database/    # Schema e configuração do banco
│   ├── repositories/# Padrão Repository
│   ├── bucket/      # Serviços AWS S3
│   └── http-client/ # Clientes HTTP externos
├── modules/         # Módulos de domínio
├── shared/          # Código compartilhado
│   ├── auth/        # Autenticação e autorização
│   ├── decorators/  # Decorators customizados
│   ├── dto/         # DTOs compartilhados
│   ├── errors/      # Erros customizados
│   ├── utils/       # Utilitários (data, número)
│   └── services/    # Serviços compartilhados
└── lib/             # Bibliotecas customizadas
```

### Commits Convencionais

Use conventional commits para mensagens padronizadas:

```bash
feat: add user registration endpoint
fix: resolve database connection timeout
docs: update API documentation
refactor: improve error handling in auth service
test: add unit tests for user service
chore: update dependencies
```

## 🚀 Deploy

### Deploy Automático via GitHub Actions

O projeto possui workflows configurados para deploy automático:

- **develop branch** → Deploy para ambiente de desenvolvimento
- **main branch** → Deploy para ambiente de produção

### Deploy Manual

```bash
# Build da aplicação
$ npm run build

# Deploy com PM2
$ pm2 start ecosystem.config.js

# Monitorar logs
$ pm2 logs gbm-app-template-backend
```

## 📚 Recursos Adicionais

- [Documentação NestJS](https://docs.nestjs.com/)
- [Documentação Kysely](https://kysely.dev/docs/getting-started)
- [AWS SDK para JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)

## 🆘 Suporte

Para dúvidas ou problemas:

1. Consulte a documentação da API em `/doc`
2. Verifique os logs da aplicação
3. Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido por:** Equipe GBM Logística  
**Autor:** Ryan Vieira Souza <ryan.vieira@gbmlogistica.com.br>
