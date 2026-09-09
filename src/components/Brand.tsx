import React from 'react';
import Image from 'next/image';

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Image src="/favicon.png" alt="ALYORA" width={42} height={42} style={{ objectFit: 'contain' }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <span style={{ color: light ? '#ffffff' : '#153545', fontSize: 25, letterSpacing: 4, fontWeight: 300 }}>ALYORA</span>
      <span style={{ color: light ? '#e3e9e4' : '#5b7074', fontSize: 8, letterSpacing: 1.1, marginTop: 1 }}>Where Life Finds Its Place.</span>
      </div>
    </div>
  );
}
