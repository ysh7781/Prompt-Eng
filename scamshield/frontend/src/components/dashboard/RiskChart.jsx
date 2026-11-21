import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { RISK_CHART_COLORS } from '../../utils/riskColors.js'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-white/10 bg-[#0a1628] px-3 py-2 shadow-xl">
        <p className="text-sm font-medium text-white capitalize">{payload[0].name}</p>
        <p className="text-sm text-white/60">{payload[0].value} scans</p>
      </div>
    )
  }
  return null
}

function RiskChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-white/30 text-sm">
        No data available
      </div>
    )
  }

  const chartData = data.map((item) => ({
    name: item.risk_level,
    value: item.count,
    color: RISK_CHART_COLORS[item.risk_level] || '#6b7280',
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span className="text-xs capitalize text-white/60">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default RiskChart

