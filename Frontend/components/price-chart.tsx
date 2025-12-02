'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const PRICE_DATA = [
  { date: 'Sem 1', precio: 1499, tienda: 'promedio' },
  { date: 'Sem 2', precio: 1450, tienda: 'promedio' },
  { date: 'Sem 3', precio: 1400, tienda: 'promedio' },
  { date: 'Sem 4', precio: 1350, tienda: 'promedio' },
  { date: 'Sem 5', precio: 1320, tienda: 'promedio' },
  { date: 'Sem 6', precio: 1299, tienda: 'promedio' },
]

export default function PriceChart() {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={PRICE_DATA}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            opacity={0.5}
          />
          <XAxis stroke="var(--color-muted-foreground)" dataKey="date" />
          <YAxis stroke="var(--color-muted-foreground)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: `1px solid var(--color-border)`,
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'var(--color-foreground)' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="precio"
            stroke="var(--color-primary)"
            strokeWidth={3}
            dot={{ fill: 'var(--color-primary)', r: 5 }}
            name="Precio promedio"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
