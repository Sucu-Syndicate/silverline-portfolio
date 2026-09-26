'use client';

import dynamic from 'next/dynamic';

const Office = dynamic(() => import('./Office'), { ssr: false });

export default function OfficeLoader() {
  return <Office />;
}
