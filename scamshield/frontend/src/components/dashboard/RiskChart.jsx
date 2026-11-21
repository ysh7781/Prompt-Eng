import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { RISK_CHART_COLORS, getRiskLabel } from '../../utils/riskColors.js'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-[#E8EFF6] bg-white px-3.5 py-2.5 shadow-lg">
        <p className="text-xs font-semibold text-[#172B4D] capitalize">{payload[0].name}</p>
        <p className="text-xs font-medium text-[#64748B] mt-0.5">{payload[0].value} scans ({payload[0].payload?.percentage?.toFixed(1) || 0}%)</p>
      </div>
    )
  }
  return null
}

function RiskChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-56 text-[#94A3B8] text-sm">
        <p className="font-medium">No scans recorded yet</p>
        <p className="text-xs text-[#94A3B8] mt-1">Run your first message or URL scan to view distribution</p>
      </div>
    )
  }

  const chartData = data.map((item) => ({
    name: getRiskLabel(item.risk_level),
    value: item.count,
    percentage: item.percentage,
    color: RISK_CHART_COLORS[item.risk_level] || '#94A3B8',
  }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={88}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => (
            <span className="text-xs text-[#64748B] font-medium">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default RiskChart
