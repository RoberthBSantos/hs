# House Scan - Room Mapper AR

Aplicativo mobile para mapeamento e digitalização de cômodos usando Realidade Aumentada (AR). O House Scan permite escanear ambientes reais através da câmera do dispositivo, detectar automaticamente paredes, portas e janelas, e gerar modelos 3D precisos que podem ser exportados para softwares profissionais de arquitetura e design.

## 🎯 Proposta

O House Scan é uma solução inovadora que combina tecnologias de AR (Realidade Aumentada) com modelagem 3D para facilitar o processo de levantamento arquitetônico. O aplicativo permite que arquitetos, designers de interiores, engenheiros e até mesmo proprietários possam:

- **Escanear cômodos em tempo real** usando a câmera do smartphone
- **Detectar automaticamente** cantos, paredes, portas e janelas
- **Visualizar modelos 3D interativos** do ambiente escaneado
- **Exportar para formatos profissionais** (OBJ, DXF) compatíveis com SketchUp, AutoCAD e outros softwares CAD

## ✨ Funcionalidades

### Escaneamento AR
- Detecção automática de cantos e paredes usando ARKit (iOS) / ARCore (Android)
- Rastreamento de movimento em tempo real
- Identificação de aberturas (portas e janelas)
- Medição precisa de dimensões (largura, altura, profundidade)

### Visualização 3D
- Renderização interativa do modelo 3D do cômodo
- Controles de órbita para navegação (zoom, rotação, pan)
- Visualização de paredes, piso e aberturas
- Destaque visual diferenciado para portas e janelas

### Exportação
- **Formato OBJ**: Compatível com SketchUp, Blender, 3ds Max
- **Formato DXF**: Compatível com AutoCAD, Revit, ArchiCAD
- Compartilhamento direto do arquivo via sistema nativo do dispositivo

### Modelagem de Dados
- Estrutura de dados robusta para representação de cômodos
- Suporte a múltiplas paredes com diferentes espessuras e alturas
- Gerenciamento de aberturas (portas e janelas) com dimensões precisas
- Cálculo automático de áreas e perímetros

## 🛠️ Tecnologias Utilizadas

### Core
- **React Native 0.81.5** - Framework multiplataforma
- **Expo SDK 54.0.0** - Plataforma de desenvolvimento e deploy
- **TypeScript 5.1.3** - Tipagem estática para maior confiabilidade
- **React 19.1.0** - Biblioteca UI moderna

### Realidade Aumentada e 3D
- **expo-gl 16.0.7** - Renderização OpenGL ES para AR
- **Three.js 0.160.0** - Biblioteca 3D para modelagem e renderização
- **@react-three/fiber 9.4.2** - Renderizador React para Three.js
- **@react-three/drei 10.7.7** - Helpers e componentes úteis para Three.js

### Navegação e UI
- **@react-navigation/native 6.1.9** - Sistema de navegação
- **@react-navigation/stack 6.3.20** - Navegação em pilha
- **react-native-gesture-handler 2.28.0** - Gestos nativos
- **react-native-safe-area-context 5.6.0** - Áreas seguras do dispositivo

### Exportação e Utilitários
- **dxf-writer 1.18.0** - Geração de arquivos DXF
- **expo-file-system 19.0.19** - Sistema de arquivos
- **expo-sharing 14.0.7** - Compartilhamento de arquivos
- **uuid 9.0.1** - Geração de IDs únicos

### Desenvolvimento
- **Jest 29.2.1** - Framework de testes
- **jest-expo 54.0.0** - Configuração Jest para Expo
- **Babel** - Transpilação de código

## 📁 Estrutura do Projeto

```
hs/
├── src/
│   ├── components/
│   │   └── RoomViewer.tsx      # Componente de visualização 3D
│   ├── models/
│   │   ├── Room.ts             # Modelo de dados do cômodo
│   │   └── Room.test.ts        # Testes unitários
│   ├── screens/
│   │   ├── ScanScreen.tsx      # Tela de escaneamento AR
│   │   └── ResultScreen.tsx    # Tela de visualização e exportação
│   └── services/
│       └── Exporter.ts         # Serviço de exportação (OBJ/DXF)
├── App.tsx                     # Componente raiz
├── app.json                    # Configuração Expo
├── babel.config.js             # Configuração Babel
├── metro.config.js             # Configuração Metro Bundler
├── package.json                # Dependências do projeto
└── tsconfig.json               # Configuração TypeScript
```

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn
- Expo CLI (opcional, mas recomendado)
- Para testar em dispositivos físicos: app Expo Go instalado

### Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd hs
```

2. Instale as dependências:
```bash
npm install --legacy-peer-deps
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
# ou
npx expo start
```

### Executando em Dispositivos

#### iOS (Simulador)
```bash
npm run ios
```

#### Android (Emulador)
```bash
npm run android
```

#### Dispositivo Físico
1. Instale o app **Expo Go** na App Store (iOS) ou Google Play (Android)
2. Execute `npm start`
3. Escaneie o QR code exibido no terminal com:
   - **iOS**: Câmera nativa do iPhone
   - **Android**: App Expo Go

#### Web (Navegador)
```bash
npm run web
```

## 📱 Como Usar

### 1. Escaneamento
1. Abra o app e acesse a tela de escaneamento
2. Aponte a câmera para o cômodo que deseja mapear
3. Mova o dispositivo lentamente ao redor do ambiente
4. O app detectará automaticamente:
   - Cantos e vértices do cômodo
   - Paredes e suas dimensões
   - Portas e janelas

### 2. Visualização
1. Após o escaneamento, visualize o modelo 3D gerado
2. Use gestos para:
   - **Pinça**: Zoom in/out
   - **Arrastar**: Rotacionar a câmera
   - **Dois dedos**: Pan (mover a visualização)

### 3. Exportação
1. Na tela de resultados, escolha o formato desejado:
   - **OBJ**: Para SketchUp, Blender, 3ds Max
   - **DXF**: Para AutoCAD, Revit, ArchiCAD
2. O arquivo será salvo e você poderá compartilhá-lo

## 🏗️ Arquitetura de Dados

O modelo de dados é baseado em uma estrutura hierárquica:

- **Room**: Representa um cômodo completo
  - **Nodes**: Pontos 3D que definem os cantos do cômodo
  - **Walls**: Paredes conectando dois nós, com:
    - Espessura e altura configuráveis
    - Lista de aberturas (portas/janelas)
  - **Openings**: Aberturas nas paredes com:
    - Tipo (porta ou janela)
    - Dimensões (largura, altura)
    - Posição relativa à parede
    - Altura do peitoril (para janelas)

## 🔄 Roadmap e Melhorias Futuras

### Fase Atual (MVP)
- ✅ Estrutura básica de dados
- ✅ Visualização 3D interativa
- ✅ Exportação OBJ e DXF
- ⏳ Integração com ARKit/ARCore (em desenvolvimento)

### Próximas Fases
- [ ] Escaneamento AR real (substituir simulação)
- [ ] Detecção automática de aberturas usando ML
- [ ] Suporte a múltiplos cômodos (plantas completas)
- [ ] Medição de áreas e volumes
- [ ] Exportação para mais formatos (IFC, FBX)
- [ ] Sincronização com nuvem
- [ ] Histórico de escaneamentos
- [ ] Edição manual de modelos
- [ ] Suporte a materiais e texturas
- [ ] Integração com serviços de arquitetura

## 🧪 Testes

Execute os testes unitários:
```bash
npm test
```

## 📄 Licença

Este projeto é privado.

## 👥 Contribuição

Este é um projeto em desenvolvimento ativo. Contribuições são bem-vindas!

## 📞 Suporte

Para questões, problemas ou sugestões, abra uma issue no repositório.

---

**Desenvolvido com ❤️ usando React Native e Expo**
