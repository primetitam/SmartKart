# Smartcart — Dispendio (registro de decisoes e conclusoes)

## Data: 2026-09-06 — Trabalho 1: tema claro forcado + audio + icones

### Leitura concluida (README.md e projeto original)
- README confirma stack: Expo SDK 57 / RN 0.86 / React 19, Expo Router com Native Tabs,
  Context + useReducer, expo-sqlite/kv-store para persistencia, Jest, EAS Build.
- Pendencias conhecidas no README:
  * `userInterfaceStyle: "light"` sem efeito no Android sem ao menos `android.forceDarkAllowed=false`
    (este trabalho resolve com a flag) e idealmente `expo-system-ui` (follow-up opcional).
  * expo/expo-router travados em 57.0.19/57.0.18 por peer do expo-modules-core — reavaliar no futuro.
- Projeto original (protoripo web): "Harmonious Cyan & Amber Design System".
  Identidade: fundo slate-100 (#F1F5F9), cartoes brancos, texto slate-900 (#0F172A),
  acento ciano (#06b6d4) para acao principal/ativo e amber (#f59e0b) para destaque;
  raios 10/14/22/9999; grelha 2x2 de acoes; bottom-nav ativo em ciano.

### Conclusoes e decisoes (Work 1)
1. expo-audio:
   - pedido "^2.0.3" NAO existe no npm; versao correta para SDK 57 = "~57.0.4"
     (bundledNativeModules.json). Ajustado em package.json com cuidado (edicao pontual, JSON valido).
   - `npm install` OK -> expo-audio 57.0.4 instalado. Build nativo so e preciso em
     standalone/dev build (expo prebuild). Expo Go ja inclui o modulo.
   - Ver expo-audio.txt (requisitos marcados como OBRIGATORIO).
2. Icons das tabs nativas: SUBSTITUIDOS por @expo/vector-icons IONICONS
   (Inicio=home, Historico=time-outline). SEM MaterialCommunityIcons em lugar nenhum
   (grep confirmou zero ocorrencias).
3. Tema nativo default = "Harmonious Cyan & Amber" (light, forcado):
   - src/theme.ts recolore para background #F1F5F9, surface #FFF, ink slate-900,
     accent cyan #06B6D4, destaque amber #F59E0B, raios 10/14/22/9999.
     Names de tokens preservados -> nenhuma tela quebrou.
   - Tab ativo agora ciano (accent), inativo slate-500.
4. Forced light theme:
   - app.json: android.forceDarkAllowed = false (desativa dark overlay do Android 10+).
   - userInterfaceStyle permanece "light".
   - Follow-up recomendado: expo-system-ui para o root background seguir o tema claro.

### Pendentes / proximos passos sugeridos
- Aplicar a grelha 2x2 de acoes (cor por cartao: cyan/amber/amb/rose) na tela inicial,
  conforme referencia web.
- Feature de voz no pre-list (expo-speech-recognition) e playback/feedback sonoro (expo-audio).
- Expor historico com grafico (referencia: bar-chart cyan).

## Anexo — Referencia 2: logica/prototipo "SMARTCART MODERN" (app.js)

### Modelo de dados do prototipo (referencia p/ app nativo)
- Lista: { id, name, budget, createdAt, items[] }
- Item:  { id, name, category, price, qty, checked }
- Historico: { id, store, date, total, itemsCount, saved }
- Nao-encontrado (faltantes): { id, name, store, date }
- Valor monetario em REAIS float (app nativo usa centavos/int — manter padrao nativo).

### Conclusoes / features a considerar no nativo
- CONCEITO DE ORCAMENTO por lista (budget) c/ barra "ao vivo" (percentual do limite).
  O app nativo nao tem budget — candidato a proxima feature.
- Categorias com emoji (Hortifruti, Laticinios, Padaria, Acougue, Bebidas, Limpeza, Outros).
- "checked" por item c/ progresso (X de Y no carrinho) — nativo ja tem (getProgress).
- "Economizou R$X" no historico (saved) — ver se o fluxo nativo de fechamento tem esse dado.
- "Itens nao encontrados" (unfound) re-adicionaveis a lista — 3a aba do prototipo; nativo nao tem.
- Tema escuro/claro no prototipo; NATIVO FORCADO em claro (decisao Work 1).
- Grelha 2x2 de acoes (gerar lista / iniciar compra / editar / descartar) — pendente no nativo.
