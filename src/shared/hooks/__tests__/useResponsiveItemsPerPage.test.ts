/**
 * Testes: useResponsiveItemsPerPage Hook
 * Testa o hook de items por página responsivo
 * SOLID - Single Responsibility: Testa apenas cálculo responsivo
 */

import { renderHook } from '@testing-library/react';
import { useResponsiveItemsPerPage } from '../useResponsiveItemsPerPage';

// Mock window.innerWidth
const mockWindowWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
};

describe('useResponsiveItemsPerPage', () => {
  beforeEach(() => {
    // Reset window width
    mockWindowWidth(1024);
  });

  it('deve retornar valor mobile para telas pequenas', () => {
    mockWindowWidth(500);
    const { result } = renderHook(() =>
      useResponsiveItemsPerPage({ mobile: 1, tablet: 2, desktop: 3 })
    );

    expect(result.current).toBe(1);
  });

  it('deve retornar valor tablet para telas médias', () => {
    mockWindowWidth(800);
    const { result } = renderHook(() =>
      useResponsiveItemsPerPage({ mobile: 1, tablet: 2, desktop: 3 })
    );

    expect(result.current).toBe(2);
  });

  it('deve retornar valor desktop para telas grandes', () => {
    mockWindowWidth(1200);
    const { result } = renderHook(() =>
      useResponsiveItemsPerPage({ mobile: 1, tablet: 2, desktop: 3 })
    );

    expect(result.current).toBe(3);
  });

  it('deve usar valores padrão quando não especificado', () => {
    mockWindowWidth(1200);
    const { result } = renderHook(() => useResponsiveItemsPerPage({}));

    expect(result.current).toBe(3); // desktop padrão
  });

  it('deve usar desktop como padrão no SSR', () => {
    // Simula SSR (window undefined)
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;

    const { result } = renderHook(() => useResponsiveItemsPerPage({ mobile: 1, tablet: 2, desktop: 3 }));

    expect(result.current).toBe(3);

    global.window = originalWindow;
  });
});

