# Smartcart

App mobile de carrinho de compras. Estrutura inicial em **React Native + Expo (TypeScript)**.

## Stack

| Camada        | Escolha                                   |
| ------------- | ----------------------------------------- |
| Runtime       | Expo SDK 57 / React Native 0.86 / React 19 |
| Linguagem     | TypeScript (`strict`)                     |
| Navegação     | Expo Router (file-based) + Native Tabs    |
| Estado        | React Context + `useReducer`             |
| Persistência  | `expo-sqlite/kv-store` (drop-in do AsyncStorage) |
| Lógica        | Funções puras em `src/lib/cart.ts`       |
| Testes        | Jest (`jest-expo`) + React Native Testing Library |
| Build/Release | EAS Build + EAS Submit                    |

Por que Expo: preview em celular real via QR code sem emulador, toolchain só com Node,
e ecossistema JS/TS alinhado a integrações de e-commerce.

## Estrutura

```
app/                        Rotas (Expo Router) — só arquivos de rota e _layout
  _layout.tsx               Providers + <NativeTabs> (abas Produtos / Carrinho)
  (products)/
    _layout.tsx             <Stack> da aba Produtos
    index.tsx               "/"      Catálogo
  (cart)/
    _layout.tsx             <Stack> da aba Carrinho
    cart.tsx                "/cart"  Carrinho
  +not-found.tsx            Rota 404
src/                        Código não-rota (importado via alias `@/`)
  types/index.ts            Modelos (Product, CartItem, CartSummary)
  lib/cart.ts               Regras do carrinho (puras, testáveis)
  lib/cart-storage.ts       Serialização/validação do carrinho salvo (puras)
  lib/cart-persistence.ts   Leitura/escrita no storage
  data/products.ts          Catálogo estático (trocar por API depois)
  context/CartContext.tsx   Provider + hook useCart
  components/
    ProductCard.tsx
    CartItemRow.tsx
  theme.ts                  Design tokens
```

## Scripts

```bash
npm start          # inicia o Metro / Expo Dev Server (preview mobile)
npm test           # roda a suíte de testes
npm run typecheck  # tsc --noEmit
npm run android    # abre no emulador/dispositivo Android
npm run ios        # abre no simulador iOS (macOS)
npm run web        # abre no navegador
```

## Preview no celular

1. `npm start`
2. Instale o app **Expo Go** no celular.
3. Escaneie o QR code exibido no terminal (mesma rede Wi-Fi).

## Build e distribuição

- Identificador do app: **`com.smartcart.app`** (`ios.bundleIdentifier` e `android.package`) — permanente depois de publicado.
- Projeto EAS: `@sergiomarazo/Smartcart`.

| Perfil (`eas.json`) | Para quê                             | Saída                          |
| ------------------- | ------------------------------------ | ------------------------------ |
| `development`       | build de desenvolvimento             | interna                        |
| `preview`           | teste interno, instalável direto     | `.apk` no Android              |
| `production`        | lojas                                | `.aab` no Android, build number automático |

```bash
npx eas-cli@latest build --profile preview    --platform android
npx eas-cli@latest build --profile production --platform ios
npx eas-cli@latest build -p ios --profile production --submit
```

`appVersionSource: "remote"` deixa o número de build no servidor da EAS; o `autoIncrement`
do perfil `production` cuida de subir a cada build. O `version` (1.0.0) continua vindo do
`app.json`. Credenciais de submit (Apple ID, service account do Google Play) são coletadas
na primeira execução de `eas submit` — nenhum segredo fica no repositório.

### Pendências conhecidas

- O perfil `development` só funciona depois de `npx expo install expo-dev-client`.
- `userInterfaceStyle: "light"` não tem efeito no Android sem `expo-system-ui`.
- `expo` e `expo-router` estão presos em `57.0.19` / `57.0.18`. Os patches seguintes puxam
  `react-native-reanimated@4.6.0` → `react-native-worklets@0.12.x`, fora do range de peer
  declarado pelo `expo-modules-core@57.0.16`. Sem conseguir satisfazer esse peer na raiz, o
  npm aninha o `expo-modules-core` dentro de `expo/`, onde o `jest-expo` não o resolve — e a
  suíte inteira deixa de rodar. Reavaliar quando o range for corrigido upstream.

## Regras de negócio já implementadas

- Adicionar / remover / alterar quantidade de itens.
- Cálculo de subtotal, contagem de itens e total.
- Desconto automático de 10% quando o subtotal atinge R$ 200,00.
- Formatação monetária em BRL; valores armazenados em centavos (inteiros).
- Carrinho persistido entre sessões do app.

### Sobre a persistência

Só `{ productId, quantity }` vai para o disco — nunca o preço. Ao abrir o app o carrinho
é reconstruído resolvendo os ids contra o catálogo atual, então um carrinho restaurado
dias depois nunca leva um preço desatualizado para o checkout. SKUs que saíram do
catálogo, payloads corrompidos ou de outra versão de schema são descartados em silêncio.
