// kg CO2e per unit — sourced from IPCC, OurWorldInData, EPA estimates
export const EMISSION_FACTORS = {
  transport: {
    car_petrol:    { label: 'Car (Petrol)',      unit: 'km',    factor: 0.21,  icon: '🚗' },
    car_diesel:    { label: 'Car (Diesel)',      unit: 'km',    factor: 0.17,  icon: '🚙' },
    car_electric:  { label: 'Car (Electric)',    unit: 'km',    factor: 0.05,  icon: '⚡' },
    bus:           { label: 'Bus',               unit: 'km',    factor: 0.089, icon: '🚌' },
    train:         { label: 'Train / Metro',     unit: 'km',    factor: 0.041, icon: '🚆' },
    flight_short:  { label: 'Flight (< 3 hrs)',  unit: 'km',    factor: 0.255, icon: '✈️' },
    flight_long:   { label: 'Flight (> 3 hrs)',  unit: 'km',    factor: 0.195, icon: '🛫' },
    motorcycle:    { label: 'Motorcycle',        unit: 'km',    factor: 0.114, icon: '🏍️' },
    bicycle:       { label: 'Bicycle / Walk',    unit: 'km',    factor: 0,     icon: '🚴' },
  },
  food: {
    beef:          { label: 'Beef',              unit: 'servings', factor: 3.3,  icon: '🥩' },
    lamb:          { label: 'Lamb / Mutton',     unit: 'servings', factor: 2.4,  icon: '🍖' },
    pork:          { label: 'Pork',              unit: 'servings', factor: 0.72, icon: '🐷' },
    chicken:       { label: 'Chicken / Poultry', unit: 'servings', factor: 0.69, icon: '🍗' },
    fish:          { label: 'Fish / Seafood',    unit: 'servings', factor: 0.6,  icon: '🐟' },
    dairy:         { label: 'Dairy (milk/cheese)',unit: 'servings', factor: 0.45, icon: '🧀' },
    eggs:          { label: 'Eggs',              unit: 'servings', factor: 0.18, icon: '🥚' },
    vegetables:    { label: 'Vegetables',        unit: 'servings', factor: 0.06, icon: '🥦' },
    vegan_meal:    { label: 'Vegan Meal',        unit: 'meals',    factor: 0.5,  icon: '🌱' },
  },
  energy: {
    electricity:   { label: 'Electricity',       unit: 'kWh',   factor: 0.233, icon: '💡' },
    natural_gas:   { label: 'Natural Gas',       unit: 'm³',    factor: 2.04,  icon: '🔥' },
    heating_oil:   { label: 'Heating Oil',       unit: 'litres',factor: 2.52,  icon: '🛢️' },
    lpg:           { label: 'LPG / Propane',     unit: 'litres',factor: 1.51,  icon: '🫙' },
  },
  shopping: {
    clothing:      { label: 'New Clothing Item',  unit: 'items', factor: 10,   icon: '👕' },
    electronics:   { label: 'Electronics Device', unit: 'items', factor: 70,   icon: '📱' },
    furniture:     { label: 'Furniture Piece',    unit: 'items', factor: 45,   icon: '🪑' },
    online_order:  { label: 'Online Order (pkg)', unit: 'items', factor: 0.5,  icon: '📦' },
    streaming:     { label: 'Video Streaming',    unit: 'hours', factor: 0.036,icon: '📺' },
  },
}

export const CATEGORIES = {
  transport: { label: 'Transport',  color: '#3b82f6', bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-200',   icon: '🚗' },
  food:      { label: 'Food & Diet',color: '#f59e0b', bg: 'bg-amber-100',  text: 'text-amber-700',  border: 'border-amber-200',  icon: '🍽️' },
  energy:    { label: 'Home Energy',color: '#ef4444', bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-200',    icon: '⚡' },
  shopping:  { label: 'Shopping',   color: '#8b5cf6', bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', icon: '🛍️' },
}

// Average global per-capita annual CO2 budget for 1.5°C: ~2300 kg/year → ~6.3 kg/day
export const DAILY_BUDGET_KG = 6.3
export const ANNUAL_BUDGET_KG = 2300

export const TIPS = {
  transport: [
    { trigger: 'car_petrol', tip: 'Switch one weekly car trip to public transport — saves ~15 kg CO₂ per month.' },
    { trigger: 'flight_long', tip: 'Consider train travel for trips under 600 km — up to 90% lower emissions.' },
    { trigger: 'car_petrol', tip: 'Carpooling halves your per-km transport emissions immediately.' },
  ],
  food: [
    { trigger: 'beef', tip: 'Replace beef with chicken or legumes once a week — saves ~10 kg CO₂ per month.' },
    { trigger: 'beef', tip: 'Try "Meatless Mondays" — a plant-based diet reduces food emissions by up to 50%.' },
    { trigger: 'dairy', tip: "Swapping cow's milk for oat milk cuts dairy emissions by ~70%." },
  ],
  energy: [
    { trigger: 'electricity', tip: 'Switch to a renewable energy tariff — eliminates electricity-source emissions.' },
    { trigger: 'natural_gas', tip: 'Lowering your thermostat by 1°C saves ~10% on heating emissions.' },
    { trigger: 'electricity', tip: 'LED bulbs use 75% less energy than incandescent — replace and forget.' },
  ],
  shopping: [
    { trigger: 'clothing', tip: 'Buy secondhand — extends garment life and cuts per-item emissions by ~80%.' },
    { trigger: 'electronics', tip: 'Repair before replace: fixing a phone saves ~70 kg CO₂ vs. buying new.' },
    { trigger: 'online_order', tip: 'Batch deliveries: fewer, larger orders cut packaging and transport emissions.' },
  ],
}
