'use client'

import { useEffect } from 'react';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

interface OverviewProps {
  data: any[]
}

const useSuppressReactWarnings = () => {
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (args.length > 0 && typeof args[0] === 'string' && args[0].includes('Support for defaultProps')) {
        return; // Ignorar la advertencia específica
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError; // Restaurar el console.error original al desmontar
    };
  }, []);
};

export const Overview: React.FC<OverviewProps> = ({ data }) => {
  useSuppressReactWarnings();
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />

        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />

        <Bar dataKey="total" fill="#3498db" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
