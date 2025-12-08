

export function decodeJwtToken(token: string): any {
  try {

    const parts = token.split('.');

    if (parts.length !== 3) {
      console.error('❌ Token JWT inválido (não tem 3 partes)');
      return null;
    }

    const payload = parts[1];

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

export function getHotelIdFromToken(token: string | undefined | null): string | null {
  if (!token) {
    return null;
  }

  const decoded = decodeJwtToken(token);

  if (!decoded) {
    return null;
  }

  return decoded.HotelId || decoded.hotelId || decoded.hotel_id || null;
}

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

