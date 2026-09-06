import React from 'react';

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <div
        style={{
          position: 'absolute',
          top: -13,
          left: 31,
          width: 22,
          height: 21,
          border: '3px solid #cbbf9d',
          borderBottom: 0,
          transform: 'rotate(45deg)',
        }}
      />
      <span style={{ color: light ? '#ffffff' : '#153545', fontSize: 25, letterSpacing: 4, fontWeight: 300 }}>ALYORA</span>
      <span style={{ color: light ? '#e3e9e4' : '#5b7074', fontSize: 8, letterSpacing: 1.1, marginTop: 1 }}>Where Life Finds Its Place.</span>
    </div>
  );
}
