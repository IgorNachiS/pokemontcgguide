# Pokémon TCG Guide

## 📱 Sobre o App

Aplicativo móvel em **React Native** para fãs do Pokémon Trading Card Game (TCG) com:

* 🔍 Busca de cartas Pokémon TCG
* ⭐ Gerenciamento de lista de desejos
* 🔐 Autenticação de usuário
* 👤 Perfil personalizado

## ✨ Funcionalidades

### 🔒 Autenticação

* Login com Firebase
* Gerenciamento de perfil

### 🃏 Cartas Pokémon

* Busca avançada de cartas
* Visualização detalhada
* Favoritos

### 🛒 Lista de Compras

* Adicionar/remover cartas
* Organizar por prioridade

### 🗺️ Navegação

* Menu lateral (*drawer*)
* Navegação intuitiva

## 🛠️ Instalação

### Pré-requisitos

* Node.js v18+
* Expo CLI:

  ```bash
  npm install -g expo-cli
  ```
* Conta no Firebase

### Passo a Passo

Clone o repositório:

```bash
git clone https://github.com/IgorNachiS/pokemontcgguide
cd pokemontcgguide
```

Instale as dependências:

```bash
npm install
# ou
yarn install
```

Configure o Firebase:
Crie um arquivo `firebaseConfig.js` na raiz do projeto com suas credenciais do Firebase:

```js
// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "sua-chave",
  authDomain: "seu-app.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## 🚀 Como Executar

```bash
npx expo start --offline
```

Escaneie o QR code com o aplicativo **Expo Go** (dispositivo físico) ou pressione:

* `a` para Android Emulator
* `i` para iOS Simulator

## 📂 Estrutura de Arquivos

```
.
├── src/
│   ├── assets/          # Ícones e imagens
│   ├── components/      # Componentes reutilizáveis
│   ├── contexts/        # Contextos do React
│   ├── hooks/           # Custom hooks
│   ├── navigation/      # Configuração de navegação
│   ├── screens/         # Telas do app
│   ├── services/        # API e serviços
│   ├── styles/          # Estilos globais
│   └── utils/           # Utilitários
├── App.js               # Entrada principal
└── firebaseConfig.js    # Configuração do Firebase
```

## 📦 Dependências Principais

| Pacote            | Versão   | Uso                  |
| ----------------- | -------- | -------------------- |
| react-native      | 0.72+    | Framework base       |
| expo              | \~48.0.0 | Plataforma Expo      |
| @react-navigation | ^6.x     | Navegação            |
| firebase          | ^9.0+    | Autenticação e banco |
| axios             | ^1.0+    | Requisições HTTP     |
| nativewind        | ^2.0+    | Estilização          |
