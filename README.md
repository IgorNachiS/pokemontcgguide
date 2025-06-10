Guia Pokémon TCG
📱 Sobre o Aplicativo
Este é um aplicativo móvel desenvolvido com React Native para fãs do Pokémon Trading Card Game (TCG). Ele oferece um conjunto abrangente de recursos para aprimorar sua experiência de colecionador:

🔍 Busca de Cartas Pokémon TCG: Capacidades de busca avançada para encontrar cartas específicas.

⭐ Gerenciamento de Lista de Desejos: Acompanhe as cartas que você deseja adquirir.

🔐 Autenticação de Usuário: Login e registro seguros impulsionados pelo Firebase.

👤 Perfil Personalizado: Gerencie suas informações de usuário.

✨ Funcionalidades
🔒 Autenticação
Login e registro usando Firebase.

Opção de login como convidado.

Funcionalidade de redefinição de senha.

Gerenciamento de perfil de usuário.

🃏 Cartas Pokémon
Busca Avançada de Cartas: Filtre cartas por nome, tipo, supertipo, subtipo, raridade, coleção, artista, faixa de HP, custo de recuo e dano de ataque.

Visualização Detalhada: Veja informações abrangentes para cada carta, incluindo imagens, detalhes da coleção, raridade, tipos, ataques, fraquezas, resistências e texto de sabor.

Preços do TCGPlayer: Visualize dados de preços em tempo real para as cartas (implementação conceitual, requer integração de API para funcionalidade completa).

🛒 Lista de Compras
Adicione e remova cartas da sua lista de compras pessoal.

Marque cartas como compradas.

Visualize sua lista de compras, organizada por status de compra.

🗺️ Navegação
Navegação por Abas: Acesso fácil às seções principais como Início, Busca, Lista e Perfil.

Navegação Lateral (Drawer): Um menu lateral oferece opções de navegação adicionais. Para acessar o menu lateral, basta arrastar da borda esquerda da tela.

🛠️ Instalação
Pré-requisitos
Node.js v18+

Expo CLI:

npm install -g expo-cli


Um projeto Firebase configurado para autenticação (E-mail/Senha, Anônimo) e Firestore.

Passo a Passo
Clone o repositório:

git clone https://github.com/IgorNachiS/pokemontcgguide
cd pokemontcgguide


Instale as dependências:

npm install
# ou
yarn install


Configure o Firebase:
Crie um arquivo firebaseConfig.js na raiz do seu projeto com suas credenciais do Firebase.

// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "SUA_API_KEY", // Substitua pela sua chave de API real
  authDomain: "SEU_DOMINIO_DE_AUTENTICACAO", // Substitua pelo seu domínio de autenticação real
  projectId: "SEU_ID_DO_PROJETO", // Substitua pelo seu ID de projeto real
  storageBucket: "SEU_STORAGE_BUCKET", // Substitua pelo seu Storage Bucket real
  messagingSenderId: "SEU_MESSAGING_SENDER_ID", // Substitua pelo seu Messaging Sender ID real
  appId: "SEU_APP_ID" // Substitua pelo seu App ID real
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { auth, db };


(Nota: O app.json também contém algumas configurações do Firebase, certifique-se de que elas correspondam ao projectId e authDomain do seu projeto.)

🚀 Como Executar
npx expo start --offline


Após executar o comando, escaneie o código QR com o aplicativo Expo Go em um dispositivo físico, ou pressione:

a para Emulador Android

i para Simulador iOS

📂 Estrutura de Arquivos
.
├── src/
│   ├── assets/          # Ícones e imagens
│   ├── components/      # Componentes de UI reutilizáveis (ex: CardItem, CustomDrawer, LoadingIndicator)
│   ├── contexts/        # Contextos React (se implementados para estado global)
│   ├── hooks/           # Hooks React personalizados (ex: useAuth, useCards)
│   ├── navigation/      # Configuração de navegação (AppNavigator, DrawerNavigator)
│   ├── screens/         # Telas principais do aplicativo (LoginScreen, DashboardScreen, AdvancedSearchScreen, CardDetailScreen, ProfileScreen, ShoppingListScreen)
│   ├── services/        # API e outros serviços (ex: para busca de dados, não explicitamente fornecido mas boa prática)
│   ├── styles/          # Estilos globais (ex: tema Pokémon específico)
│   └── utils/           # Funções utilitárias
├── App.js               # Ponto de entrada principal do aplicativo
└── firebaseConfig.js    # Configuração do Firebase


📦 Dependências Principais
Pacote

Versão

Uso

react-native

0.79.2

Estrutura base para desenvolvimento de apps móveis

expo

~53.0.9

Plataforma para construir apps React universais

@react-navigation

^7.x

Roteamento e navegação para apps React Native

firebase

^11.8.1

Autenticação e banco de dados Firestore

@react-native-async-storage/async-storage

2.1.2

Armazenamento assíncrono persistente chave-valor

@react-native-picker/picker

^2.11.0

Componente nativo de picker

expo-linear-gradient

~14.1.4

Componente de gradiente linear

expo-status-bar

~2.2.3

Gerencia a aparência da barra de status nativa

react-native-paper

^5.14.5

Material Design para React Native

react-native-gesture-handler

~2.24.0

Gerenciamento de gestos nativo

react-native-reanimated

~3.17.4

Biblioteca de animação de baixo nível

react-native-safe-area-context

5.4.0

Lida com insets de área segura para iOS/Android

react-native-screens

~4.10.0

Primitivos nativos para navegação

react-native-svg

15.11.2

Renderiza imagens SVG em React Native

react-native-vector-icons

^10.2.0

Ícones personalizáveis para React Native

lottie-react-native

7.2.2

Renderiza animações do After Effects

@babel/core

^7.20.0

Compilador JavaScript

react-native-svg-transformer

^1.5.1

Transforma arquivos SVG em componentes React Native
