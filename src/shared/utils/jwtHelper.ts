/**
 * Utility: JWT Helper
 * Funções auxiliares para trabalhar com JWT tokens
 */

/**
 * Decodifica um JWT token sem validar assinatura
 * (útil apenas para leitura de claims públicas)
 */
export function decodeJwtToken(token: string): any {
  try {
    // JWT tem 3 partes separadas por ponto: header.payload.signature
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      console.error('❌ Token JWT inválido (não tem 3 partes)');
      return null;
    }
    
    // Decodifica a segunda parte (payload) que contém as claims
    const payload = parts[1];
    
    // Converte de Base64URL para string
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('❌ Erro ao decodificar JWT:', error);
    return null;
  }
}

/**
 * Extrai o HotelId do token JWT
 */
export function getHotelIdFromToken(token: string | undefined | null): string | null {
  if (!token) {
    return null;
  }
  
  const decoded = decodeJwtToken(token);
  
  if (!decoded) {
    return null;
  }
  
  // O token pode ter HotelId em diferentes formatos:
  // - HotelId (conforme documentação da API)
  // - hotelId
  // - hotel_id
  return decoded.HotelId || decoded.hotelId || decoded.hotel_id || null;
}

/**
 * Extrai informações do usuário do token JWT
 */
export function getUserInfoFromToken(token: string | undefined | null) {
  if (!token) {
    return null;
  }
  
  const decoded = decodeJwtToken(token);
  
  if (!decoded) {
    return null;
  }
  
  return {
    userId: decoded.nameid || decoded.sub || decoded.userId || null,
    name: decoded.name || decoded.unique_name || null,
    email: decoded.email || null,
    hotelId: decoded.HotelId || decoded.hotelId || decoded.hotel_id || null,
    role: decoded.role || null,
    exp: decoded.exp || null,
  };
}

