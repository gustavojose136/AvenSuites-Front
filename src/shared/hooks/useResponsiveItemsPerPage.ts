

'use client';

import { useState, useEffect, useMemo } from 'react';

interface ResponsiveConfig {
  mobile?: number;

  tablet?: number;

  desktop?: number;

}

const defaultConfig: Required<ResponsiveConfig> = {
  mobile: 1,
  tablet: 2,
  desktop: 3,
};

export function useResponsiveItemsPerPage(config: ResponsiveConfig = {}) {
  const finalConfig = useMemo(() => ({ ...defaultConfig, ...config }), [config.mobile, config.tablet, config.desktop]);

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

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [finalConfig]);

  return itemsPerPage;
}

function getItemsPerPage(width: number, config: Required<ResponsiveConfig>): number {
  if (width < 768) {
    return config.mobile;
  } else if (width < 1024) {
    return config.tablet;
  } else {
    return config.desktop;
  }
}

