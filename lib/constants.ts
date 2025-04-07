export const NAV_THEME = {
  light: {
    background: 'hsl(0 0% 100%)', // Fundo claro
    border: 'hsl(240 5.9% 90%)', // Bordas sutis
    card: 'hsl(0 0% 100%)', // Cartão claro
    notification: 'hsl(0 84.2% 60.2%)', // Notificação
    primary: 'hsl(240 5.9% 10%)', // Elementos principais
    text: 'hsl(240 10% 3.9%)', // Texto escuro
  },

  dark: {
    background: 'rgb(13, 13, 27)', // Baseado em #0D0D1B (convertido para HSL)
    border: 'rgb(13, 13, 27)', // Bordas levemente mais claras
    card: 'rgb(13, 13, 27)', // Cartões com um leve contraste
    notification: 'hsl(0 72% 51%)', // Notificação
    primary: 'hsl(0 0% 98%)', // Texto primário branco
    text: 'hsl(0 0% 95%)', // Texto com alto contraste
  }
};

// export const API_URL = "http://localhost:3000/dev/api"; // LOCAL
export const API_URL = "https://3vga9hjhl8.execute-api.sa-east-1.amazonaws.com/prod/api"; // PROD
// export const API_URL = "https://s5kj096c83.execute-api.sa-east-1.amazonaws.com/dev/api"; // DEV


