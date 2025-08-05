interface Recipe {
  ingredients: {
    flour: number
    water: number
    salt: number
    yeast: number
    oil: number
    sugar: number
  }
  preFerment: {
    enabled: boolean
    type: 'biga' | 'poolish'
    percentage: number
    hydration: number
  }
}

interface DoughSettingsProps {
  recipe: Recipe
  onRecipeChange: (recipe: Recipe) => void
  onCalculate: () => void
}

import { useState } from 'react'

// Touch-friendly stepper component with click-to-edit
const TouchStepper = ({ value, onChange, min = 0, max = 100, step = 0.1, unit = '%', disabled = false }: {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  disabled?: boolean
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value.toString())

  const handleDecrease = () => {
    const newValue = Math.max(min, value - step)
    onChange(Math.round(newValue * 10) / 10)
  }

  const handleIncrease = () => {
    const newValue = Math.min(max, value + step)
    onChange(Math.round(newValue * 10) / 10)
  }

  const handleValueClick = () => {
    if (!disabled) {
      setIsEditing(true)
      setInputValue(value.toString())
    }
  }

  const handleInputSubmit = () => {
    const numValue = parseFloat(inputValue)
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(Math.round(numValue * 10) / 10)
    } else {
      // Reset to current value if invalid
      setInputValue(value.toString())
    }
    setIsEditing(false)
  }

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputSubmit()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setInputValue(value.toString())
    }
  }

  return (
    <div className={`flex items-center bg-gray-800 rounded-2xl border-2 ${disabled ? 'border-orange-200 bg-orange-100' : 'border-gray-600'} overflow-hidden`}>
      <button
        onClick={handleDecrease}
        disabled={disabled || value <= min}
        className={`flex-1 py-4 px-6 text-2xl font-black transition-all active:scale-95 ${
          disabled || value <= min
            ? 'text-gray-500 cursor-not-allowed'
            : 'text-white hover:bg-gray-700 active:bg-gray-600'
        }`}
        style={{ minHeight: '60px', minWidth: '60px' }}
      >
        −
      </button>
      <div className={`flex-2 py-4 px-4 text-center border-x-2 relative ${
        disabled ? 'border-orange-200 bg-orange-50' : 'border-gray-600'
      }`}>
        {isEditing ? (
          <input
            type="number"
            inputMode="decimal"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleInputSubmit}
            onKeyDown={handleInputKeyPress}
            className="w-full text-xl font-bold text-white bg-transparent text-center outline-none border-none"
            style={{ fontSize: '20px' }}
            autoFocus
            min={min}
            max={max}
            step={step}
          />
        ) : (
          <button
            onClick={handleValueClick}
            disabled={disabled}
            className={`text-xl font-bold transition-all ${
              disabled 
                ? 'text-orange-800 cursor-not-allowed' 
                : 'text-white hover:text-blue-300 cursor-pointer'
            }`}
          >
            {value.toFixed(1)}{unit}
            {!disabled && (
              <div className="text-xs text-gray-400 mt-1">tap to edit</div>
            )}
          </button>
        )}
      </div>
      <button
        onClick={handleIncrease}
        disabled={disabled || value >= max}
        className={`flex-1 py-4 px-6 text-2xl font-black transition-all active:scale-95 ${
          disabled || value >= max
            ? 'text-gray-500 cursor-not-allowed'
            : 'text-white hover:bg-gray-700 active:bg-gray-600'
        }`}
        style={{ minHeight: '60px', minWidth: '60px' }}
      >
        +
      </button>
    </div>
  )
}

// Touch-friendly slider component with click-to-edit
const TouchSlider = ({ value, onChange, min = 0, max = 100, step = 1, unit = '%', label }: {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  label: string
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value.toString())

  const handleValueClick = () => {
    setIsEditing(true)
    setInputValue(value.toString())
  }

  const handleInputSubmit = () => {
    const numValue = parseFloat(inputValue)
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue)
    } else {
      // Reset to current value if invalid
      setInputValue(value.toString())
    }
    setIsEditing(false)
  }

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputSubmit()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setInputValue(value.toString())
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-300 font-medium">{label}</span>
        {isEditing ? (
          <input
            type="number"
            inputMode="decimal"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleInputSubmit}
            onKeyDown={handleInputKeyPress}
            className="text-white font-bold text-lg bg-gray-700 px-3 py-1 rounded-lg text-center outline-none border-2 border-purple-400"
            style={{ fontSize: '18px', width: '80px' }}
            autoFocus
            min={min}
            max={max}
            step={step}
          />
        ) : (
          <button
            onClick={handleValueClick}
            className="text-white font-bold text-lg hover:text-purple-300 transition-all px-3 py-1 rounded-lg hover:bg-gray-700"
          >
            {value}{unit}
            <div className="text-xs text-gray-400">tap to edit</div>
          </button>
        )}
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((value - min) / (max - min)) * 100}%, #374151 ${((value - min) / (max - min)) * 100}%, #374151 100%)`
          }}
        />
      </div>
    </div>
  )
}

export default function DoughSettings({ recipe, onRecipeChange, onCalculate }: DoughSettingsProps) {
  const updateIngredient = (ingredient: keyof Recipe['ingredients'], value: number) => {
    onRecipeChange({
      ...recipe,
      ingredients: {
        ...recipe.ingredients,
        [ingredient]: value
      }
    })
  }

  const updatePreferment = (field: keyof Recipe['preFerment'], value: boolean | string | number) => {
    onRecipeChange({
      ...recipe,
      preFerment: {
        ...recipe.preFerment,
        [field]: value
      }
    })
  }

  const ingredientInputs = [
    { key: 'flour', label: 'Flour', unit: '%', disabled: true, min: 100, max: 100, step: 0 },
    { key: 'water', label: 'Water', unit: '%', disabled: false, min: 45, max: 85, step: 0.5 },
    { key: 'salt', label: 'Salt', unit: '%', disabled: false, min: 1, max: 4, step: 0.1 },
    { key: 'yeast', label: 'Yeast', unit: '%', disabled: false, min: 0.1, max: 2, step: 0.1 },
    { key: 'oil', label: 'Oil', unit: '%', disabled: false, min: 0, max: 10, step: 0.5 },
    { key: 'sugar', label: 'Sugar', unit: '%', disabled: false, min: 0, max: 5, step: 0.5 },
  ] as const

  return (
    <div className="space-y-8">
      {/* Baker's Percentages */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl text-white border border-gray-700/50">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          Baker's Percentages
        </h2>
        
        <div className="space-y-6">
          {ingredientInputs.map(({ key, label, unit, disabled, min, max, step }) => (
            <div key={key} className="space-y-3">
              <label className="block text-lg font-bold text-gray-200 tracking-wide">
                {label.toUpperCase()}
              </label>
              <TouchStepper
                value={recipe.ingredients[key]}
                onChange={(value) => updateIngredient(key, value)}
                min={min}
                max={max}
                step={step}
                unit={unit}
                disabled={disabled}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Pre-ferment Controls */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl text-white border border-gray-700/50">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
            <h2 className="text-2xl font-bold text-white">Pre-ferment</h2>
          </div>
          <button
            onClick={() => updatePreferment('enabled', !recipe.preFerment.enabled)}
            className={`relative inline-flex h-12 w-20 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-300 active:scale-95 ${
              recipe.preFerment.enabled ? 'bg-purple-600' : 'bg-gray-600'
            }`}
            style={{ minHeight: '48px', minWidth: '80px' }}
          >
            <span
              className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform duration-200 ${
                recipe.preFerment.enabled ? 'translate-x-10' : 'translate-x-2'
              }`}
            />
            <span className={`absolute text-xs font-bold ${
              recipe.preFerment.enabled 
                ? 'left-2 text-white' 
                : 'right-2 text-gray-300'
            }`}>
              {recipe.preFerment.enabled ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
        
        {recipe.preFerment.enabled && (
          <div className="space-y-8">
            {/* Type Selector */}
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => {
                  updatePreferment('type', 'poolish')
                  updatePreferment('hydration', 100)
                }}
                className={`py-6 px-8 rounded-2xl font-bold transition-all text-xl active:scale-95 ${
                  recipe.preFerment.type === 'poolish'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-xl'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
                style={{ minHeight: '72px' }}
              >
                🥖 Poolish (100% hydration)
              </button>
              <button
                onClick={() => {
                  updatePreferment('type', 'biga')
                  updatePreferment('hydration', 50)
                }}
                className={`py-6 px-8 rounded-2xl font-bold transition-all text-xl active:scale-95 ${
                  recipe.preFerment.type === 'biga'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-xl'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
                style={{ minHeight: '72px' }}
              >
                🍞 Biga (~50% hydration)
              </button>
            </div>
            
            {/* Controls */}
            <div className="space-y-8">
              <div>
                <TouchSlider
                  value={recipe.preFerment.percentage}
                  onChange={(value) => updatePreferment('percentage', value)}
                  min={5}
                  max={50}
                  step={1}
                  unit="%"
                  label="Percentage of Total Dough"
                />
              </div>
              
              <div>
                <TouchSlider
                  value={recipe.preFerment.hydration}
                  onChange={(value) => updatePreferment('hydration', value)}
                  min={30}
                  max={150}
                  step={5}
                  unit="%"
                  label="Hydration Level"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Calculate Button */}
      <div className="text-center">
        <button
          onClick={onCalculate}
          className="w-full py-8 bg-gradient-to-r from-green-500 to-green-600 text-white text-2xl font-black rounded-3xl focus:outline-none transition-all shadow-2xl active:scale-95 active:shadow-lg"
          style={{ minHeight: '80px' }}
        >
          🧮 Calculate Dough
        </button>
      </div>
    </div>
  )
}