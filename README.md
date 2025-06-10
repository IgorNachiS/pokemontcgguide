# Guia Pokémon TCG

Este é um aplicativo móvel desenvolvido com React Native para fãs do Pokémon Trading Card Game (TCG). Ele oferece um conjunto abrangente de recursos para aprimorar sua experiência de colecionador:

### 🔍 Busca de Cartas Pokémon TCG

Capacidades de busca avançada para encontrar cartas específicas.

### ⭐ Gerenciamento de Lista de Desejos

Acompanhe as cartas que você deseja adquirir.

### 🔐 Autenticação de Usuário

Login e registro seguros impulsionados pelo Firebase.

### 👤 Perfil Personalizado

Gerencie suas informações de usuário.

---

## ✨ Funcionalidades

### 🔒 Autenticação

* Login e registro usando Firebase.
* Opção de login como convidado.
* Funcionalidade de redefinição de senha.
* Gerenciamento de perfil de usuário.

### 🃏 Cartas Pokémon

* **Busca Avançada de Cartas**: Filtre cartas por nome, tipo, supertipo, subtipo, raridade, coleção, artista, faixa de HP, custo de recuo e dano de ataque.
* **Visualização Detalhada**: Veja informações abrangentes para cada carta, incluindo imagens, detalhes da coleção, raridade, tipos, ataques, fraquezas, resistências e texto de sabor.
* **Preços do TCGPlayer**: Visualize dados de preços em tempo real para as cartas (implementação conceitual, requer integração de API para funcionalidade completa).

### 🛒 Lista de Compras

* Adicione e remova cartas da sua lista de compras pessoal.
* Marque cartas como compradas.
* Visualize sua lista de compras, organizada por status de compra.

### 🗸️ Navegação

* **Navegação por Abas**: Acesso fácil às seções principais como Início, Busca, Lista e Perfil.
* **Navegação Lateral (Drawer)**: Um menu lateral oferece opções de navegação adicionais.

  > ✨ *Observação: O menu lateral aparece após fazer um gesto de arrastar a partir da borda esquerda da tela.*

---

## 🛠️ Instalação

### Pré-requisitos

* Node.js v18+
* Expo CLI:

```bash
npm install -g expo-cli
```

* Um projeto Firebase configurado para autenticação (E-mail/Senha, Anônimo) e Firestore.

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
Crie um arquivo `firebaseConfig.js` na raiz do seu projeto com suas credenciais do Firebase.

```js
// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO_DE_AUTENTICACAO",
  projectId: "SEU_ID_DO_PROJETO",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { auth, db };
```

> 📆 **Nota**: O `app.json` também contém algumas configurações do Firebase, certifique-se de que elas correspondam ao `projectId` e `authDomain` do seu projeto.

---

## 🚀 Como Executar

```bash
npx expo start --offline
```

Após executar o comando, escaneie o código QR com o aplicativo **Expo Go** em um dispositivo físico, ou pressione:

* `a` para Emulador Android
* `i` para Simulador iOS

---

## 📂 Estrutura de Arquivos

```
.
├── .gitignore
├── App.js
├── README.md
├── app.json
├── firebaseConfig.js
├── index.js
├── metro.config.js
├── package-lock.json
├── package.json
└── src/
    ├── components/
    │   ├── CardItem.js
    │   ├── CustomDrawer.js
    │   └── LoadingIndicator.js
    ├── hooks/
    │   ├── useAuth.js
    │   └── useCards.js
    ├── navigation/
    │   └── DrawerNavigator.js
    ├── screens/
    │   ├── AdvancedSearchScreen.js
    │   ├── CardDetailScreen.js
    │   ├── DashboardScreen.js
    │   ├── LoginScreen.js
    │   ├── ProfileScreen.js
    │   └── ShoppingListScreen.js
    └── theme/
        └── PokemonTheme.js
```

---

## 📦 Dependências Principais

| Pacote                                    | Versão    | Uso                                        |
| ----------------------------------------- | --------- | ------------------------------------------ |
| @expo/vector-icons                        | ^14.0.0   | Ícones para Expo e React Native            |
| @react-native-async-storage/async-storage | 1.21.0    | Armazenamento assíncrono persistente       |
| @react-native-picker/picker               | 2.6.1     | Componente nativo de picker                |
| @react-navigation/bottom-tabs             | ^6.5.20   | Navegação por abas                         |
| @react-navigation/drawer                  | ^6.6.15   | Navegação lateral (drawer)                 |
| @react-navigation/native                  | ^6.1.17   | Core de navegação                          |
| @react-navigation/native-stack            | ^6.9.26   | Navegação baseada em pilha                 |
| expo                                      | \~50.0.14 | Plataforma React Native                    |
| expo-linear-gradient                      | \~12.7.2  | Componente de gradiente linear             |
| expo-status-bar                           | \~1.11.1  | Barra de status nativa                     |
| firebase                                  | ^10.8.1   | Autenticação e Firestore                   |
| lottie-react-native                       | 6.3.0     | Animações Lottie                           |
| react                                     | 18.2.0    | Biblioteca React                           |
| react-native                              | 0.73.6    | Framework base                             |
| react-native-gesture-handler              | \~2.14.0  | Gestos nativos                             |
| react-native-paper                        | ^5.12.3   | Componentes Material Design                |
| react-native-reanimated                   | \~3.6.2   | Animações de baixo nível                   |
| react-native-safe-area-context            | 4.8.2     | Insets de área segura                      |
| react-native-screens                      | \~3.29.0  | Primitivos nativos de navegação            |
| react-native-svg                          | 14.1.0    | Renderiza imagens SVG                      |
| react-native-vector-icons                 | ^10.0.3   | Ícones personalizados                      |
| @babel/core                               | ^7.20.0   | Compilador JavaScript                      |
| react-native-svg-transformer              | ^1.3.0    | Transforma SVG em componentes React Native |
