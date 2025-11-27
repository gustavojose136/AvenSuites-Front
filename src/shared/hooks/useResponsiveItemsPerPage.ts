/**
 * Hook: useResponsiveItemsPerPage
 * Calcula quantos items mostrar por página baseado no tamanho da tela
 * SOLID - Single Responsibility: Apenas cálculo responsivo
 */

'use client';

import { useState, useEffect } from 'react';

interface ResponsiveConfig {
  mobile?: number;    // < 768px (sm)
  tablet?: number;    // 768px - 1024px (md)
  desktop?: number;   // > 1024px (lg+)
}

const defaultConfig: Required<ResponsiveConfig> = {
  mobile: 1,
  tablet: 2,
  desktop: 3,
};

export function useResponsiveItemsPerPage(config: ResponsiveConfig = {}) {
  const finalConfig = { ...defaultConfig, ...config };
  
  const [itemsPerPage, setItemsPerPage] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return getItemsPerPage(window.innerWidth, finalConfig);
    }
    return finalConfig.desktop;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setItemsPerPage(getItemsPerPage(window.innerWidth, finalConfig));
    };

    // Atualiza na montagem para garantir o valor correto
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [finalConfig.mobile, finalConfig.tablet, finalConfig.desktop]);

  return itemsPerPage;
}

/**
 * Calcula quantos items mostrar baseado na largura da tela
 * SOLID - Single Responsibility: Apenas cálculo
 */
function getItemsPerPage(width: number, config: Required<ResponsiveConfig>): number {
  if (width < 768) {
    return config.mobile;
  } else if (width < 1024) {
    return config.tablet;
  } else {
    return config.desktop;
  }
}

