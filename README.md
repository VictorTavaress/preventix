# Preventix

Aplicativo mobile para geração de relatórios técnicos em PDF com base em dados coletados no campo. O Preventix permite preencher informações, adicionar imagens, gerar um PDF estilizado e salvar automaticamente o arquivo em um bucket S3 com link público para visualização e compartilhamento.

## ✨ Funcionalidades

- 📋 Preenchimento de formulários com dados técnicos
- 📷 Captura ou upload de imagens diretamente no app
- 🧾 Geração de PDF customizado com visual baseado no relatório SKF
- ☁️ Upload automático do PDF para o Amazon S3 com link público
- 📤 Tela dedicada para visualização, compartilhamento e download do PDF

## 🛠 Tecnologias Utilizadas

- [Expo Go](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [React Context API](https://reactjs.org/docs/context.html)
- [expo-print](https://docs.expo.dev/versions/latest/sdk/print/)
- [AWS S3](https://aws.amazon.com/pt/s3/)
- [Serverless Framework](https://www.serverless.com/)
- [Amazon DynamoDB](https://aws.amazon.com/dynamodb/)

## ▶️ Como rodar o projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/preventix.git
   cd preventix
    npm install
    npm run dev
   
# 📄 Gerando o PDF
O relatório PDF é gerado a partir de um template HTML com placeholders ({{company}}, {{date}}, {{machineId}}, etc) que são substituídos dinamicamente com os dados inseridos no app. O estilo segue o padrão visual da SKF, com:

Cabeçalho azul e logotipo

Tabelas formatadas

Imagens técnicas e de máquina

Cálculos de tolerância com indicadores ✓ ou ✗

# ☁️ Upload no S3
Após a geração, o PDF é salvo em um bucket S3 com link público. O link é armazenado junto com os dados do usuário no DynamoDB.
