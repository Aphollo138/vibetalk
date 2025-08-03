# Deploy do VibeTalk Frontend no Vercel

Este guia detalha como fazer o deploy do frontend React do VibeTalk no Vercel.

## Pré-requisitos

1. Conta no [Vercel](https://vercel.com)
2. Repositório Git com o código do projeto
3. Backend já deployado no Render (veja DEPLOY_RENDER.md)

## Configuração das Variáveis de Ambiente

Antes do deploy, configure as seguintes variáveis de ambiente no Vercel:

### Variáveis Obrigatórias

- `VITE_API_URL`: URL do backend no Render (ex: `https://vibetalk-backend.onrender.com`)
- `VITE_SOCKET_URL`: URL do Socket.IO no Render (ex: `https://vibetalk-backend.onrender.com`)
- `VITE_NODE_ENV`: `production`

## Passos para Deploy

### 1. Preparar o Repositório

```bash
# Fazer commit das mudanças
git add .
git commit -m "Preparar para deploy no Vercel"
git push origin main
```

### 2. Conectar ao Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "New Project"
3. Conecte sua conta do GitHub/GitLab/Bitbucket
4. Selecione o repositório do VibeTalk

### 3. Configurar o Projeto

1. **Framework Preset**: Vite
2. **Root Directory**: `vibetalk/` (se o frontend estiver em subpasta)
3. **Build Command**: `pnpm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `pnpm install`

### 4. Configurar Variáveis de Ambiente

Na seção "Environment Variables":

```
VITE_API_URL = https://seu-backend.onrender.com
VITE_SOCKET_URL = https://seu-backend.onrender.com
VITE_NODE_ENV = production
```

### 5. Deploy

1. Clique em "Deploy"
2. Aguarde o build completar
3. Acesse a URL fornecida pelo Vercel

## Configuração de Domínio Personalizado (Opcional)

1. No dashboard do projeto no Vercel
2. Vá para "Settings" > "Domains"
3. Adicione seu domínio personalizado
4. Configure os DNS conforme instruções

## Atualizações Automáticas

O Vercel fará deploy automático a cada push para a branch principal.

## Troubleshooting

### Build Falha

- Verifique se todas as dependências estão no `package.json`
- Confirme se as variáveis de ambiente estão corretas
- Verifique os logs de build no dashboard do Vercel

### Problemas de Conexão com Backend

- Confirme se o backend está rodando no Render
- Verifique se as URLs nas variáveis de ambiente estão corretas
- Teste a conectividade do backend separadamente

### Problemas de CORS

- Confirme se o backend está configurado para aceitar requests do domínio do Vercel
- Verifique as configurações de CORS no Flask

## URLs Importantes

- Dashboard do Vercel: https://vercel.com/dashboard
- Documentação: https://vercel.com/docs
- Suporte: https://vercel.com/support

