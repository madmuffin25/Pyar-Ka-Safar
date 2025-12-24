import React from 'react';

export default function MandalaPattern({ className = "", opacity = 0.05 }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="0.5"/>
      <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5"/>
      <circle cx="100" cy="100" r="65" stroke="currentColor" strokeWidth="0.5"/>
      <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="0.5"/>
      <circle cx="100" cy="100" r="35" stroke="currentColor" strokeWidth="0.5"/>
      <circle cx="100" cy="100" r="20" stroke="currentColor" strokeWidth="0.5"/>
      {[...Array(12)].map((_, i) => (
        <g key={i} transform={`rotate(${i * 30} 100 100)`}>
          <path d="M100 5 L105 25 L100 45 L95 25 Z" fill="currentColor" fillOpacity="0.3"/>
          <path d="M100 55 Q115 70 100 85 Q85 70 100 55" stroke="currentColor" strokeWidth="0.5" fill="none"/>
        </g>
      ))}
      {[...Array(8)].map((_, i) => (
        <g key={i} transform={`rotate(${i * 45} 100 100)`}>
          <ellipse cx="100" cy="30" rx="8" ry="15" stroke="currentColor" strokeWidth="0.5" fill="none"/>
        </g>
      ))}
    </svg>
  );
}