/**
 * Testes: usePagination Hook
 * Testa o hook de paginação
 * SOLID - Single Responsibility: Testa apenas lógica de paginação
 */

import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../usePagination';

describe('usePagination', () => {
  const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));

  it('deve inicializar na primeira página', () => {
    const { result } = renderHook(() => usePagination({ items, itemsPerPage: 10 }));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.items.length).toBe(10);
  });

  it('deve calcular totalPages corretamente', () => {
    const { result } = renderHook(() => usePagination({ items, itemsPerPage: 10 }));

    expect(result.current.totalPages).toBe(3); // 25 items / 10 por página = 3 páginas
  });

  it('deve ir para próxima página', () => {
    const { result } = renderHook(() => usePagination({ items, itemsPerPage: 10 }));

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.items[0].id).toBe(11);
  });

  it('deve ir para página anterior', () => {
    const { result } = renderHook(() => usePagination({ items, itemsPerPage: 10 }));

    act(() => {
      result.current.goToPage(2);
      result.current.goToPreviousPage();
    });

    expect(result.current.currentPage).toBe(1);
  });

  it('deve ir para primeira página', () => {
    const { result } = renderHook(() => usePagination({ items, itemsPerPage: 10 }));

    act(() => {
      result.current.goToPage(3);
      result.current.goToFirstPage();
    });

    expect(result.current.currentPage).toBe(1);
  });

  it('deve ir para última página', () => {
    const { result } = renderHook(() => usePagination({ items, itemsPerPage: 10 }));

    act(() => {
      result.current.goToLastPage();
    });

    expect(result.current.currentPage).toBe(3);
    expect(result.current.items.length).toBe(5); // Última página tem 5 items
  });

  it('não deve ir para página inválida', () => {
    const { result } = renderHook(() => usePagination({ items, itemsPerPage: 10 }));

    act(() => {
      result.current.goToPage(0);
    });

    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.goToPage(100);
    });

    expect(result.current.currentPage).toBe(1);
  });

  it('deve retornar hasNextPage e hasPreviousPage corretamente', () => {
    const { result } = renderHook(() => usePagination({ items, itemsPerPage: 10 }));

    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPreviousPage).toBe(false);

    act(() => {
      result.current.goToLastPage();
    });

    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.hasPreviousPage).toBe(true);
  });

  it('deve usar itemsPerPage padrão quando não especificado', () => {
    const { result } = renderHook(() => usePagination({ items }));

    expect(result.current.itemsPerPage).toBe(10);
  });
});

