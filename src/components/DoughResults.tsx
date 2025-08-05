import { useState } from 'react'

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

interface DoughResultsProps {
  recipe: Recipe
  onBack: () => void
}

// Touch-friendly stepper component for results with click-to-edit
const ResultStepper = ({ value, onChange, min = 1, max = 20, step = 1, unit = '', label }: {
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

  const handleDecrease = () => {
    const newValue = Math.max(min, value - step)
    onChange(newValue)
  }

  const handleIncrease = () => {
    const newValue = Math.min(max, value + step)
    onChange(newValue)
  }

  const handleValueClick = () => {
    setIsEditing(true)
    setInputValue(value.toString())
  }

  const handleInputSubmit = () => {
    const numValue = parseInt(inputValue)
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
      <label className="block text-lg font-bold text-gray-200 tracking-wide">
        {label.toUpperCase()}
      </label>
      <div className="flex items-center bg-gray-800 rounded-2xl border-2 border-gray-600 overflow-hidden">
        <button
          onClick={handleDecrease}
          disabled={value <= min}
          className={`flex-1 py-6 px-6 text-3xl font-black transition-all active:scale-95 ${
            value <= min
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-white hover:bg-gray-700 active:bg-gray-600'
          }`}
          style={{ minHeight: '80px', minWidth: '80px' }}
        >
          −
        </button>
        <div className="flex-2 py-6 px-6 text-center border-x-2 border-gray-600 relative">
          {isEditing ? (
            <input
              type="number"
              inputMode="numeric"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleInputSubmit}
              onKeyDown={handleInputKeyPress}
              className="w-full text-2xl font-black text-white bg-transparent text-center outline-none border-none"
              style={{ fontSize: '24px' }}
              autoFocus
              min={min}
              max={max}
              step={step}
            />
          ) : (
            <button
              onClick={handleValueClick}
              className="text-2xl font-black text-white hover:text-orange-300 transition-all cursor-pointer"
            >
              {value}{unit}
              <div className="text-xs text-gray-400 mt-1">tap to edit</div>
            </button>
          )}
        </div>
        <button
          onClick={handleIncrease}
          disabled={value >= max}
          className={`flex-1 py-6 px-6 text-3xl font-black transition-all active:scale-95 ${
            value >= max
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-white hover:bg-gray-700 active:bg-gray-600'
          }`}
          style={{ minHeight: '80px', minWidth: '80px' }}
        >
          +
        </button>
      </div>
    </div>
  )
}

export default function DoughResults({ recipe, onBack }: DoughResultsProps) {
  const [doughBalls, setDoughBalls] = useState<number>(4)
  const [ballWeight, setBallWeight] = useState<number>(250)

  const calculateWeights = () => {
    const totalDoughWeight = doughBalls * ballWeight
    const totalFlourWeight = (totalDoughWeight * recipe.ingredients.flour) / 100
    
    let preFermentFlour = 0
    let preFermentWater = 0
    let finalFlour = totalFlourWeight
    let finalWater = (totalDoughWeight * recipe.ingredients.water) / 100

    if (recipe.preFerment.enabled) {
      const preFermentWeight = (totalDoughWeight * recipe.preFerment.percentage) / 100
      preFermentFlour = preFermentWeight / (1 + recipe.preFerment.hydration / 100)
      preFermentWater = preFermentFlour * (recipe.preFerment.hydration / 100)
      
      finalFlour = totalFlourWeight - preFermentFlour
      finalWater = ((totalDoughWeight * recipe.ingredients.water) / 100) - preFermentWater
    }

    const otherIngredients = {
      salt: (totalFlourWeight * recipe.ingredients.salt) / 100,
      yeast: (totalFlourWeight * recipe.ingredients.yeast) / 100,
      oil: (totalFlourWeight * recipe.ingredients.oil) / 100,
      sugar: (totalFlourWeight * recipe.ingredients.sugar) / 100,
    }

    return {
      totalDoughWeight,
      totalFlourWeight,
      preFerment: {
        flour: preFermentFlour,
        water: preFermentWater,
        total: preFermentFlour + preFermentWater
      },
      finalDough: {
        flour: finalFlour,
        water: finalWater,
        ...otherIngredients
      }
    }
  }

  const weights = calculateWeights()

  return (
    <div className="space-y-8">
      {/* Scaling Controls */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl text-white border border-gray-700/50">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
          Dough Scaling
        </h2>
        
        <div className="space-y-8">
          <ResultStepper
            value={doughBalls}
            onChange={setDoughBalls}
            min={1}
            max={20}
            step={1}
            unit=" balls"
            label="Number of Dough Balls"
          />
          
          <ResultStepper
            value={ballWeight}
            onChange={setBallWeight}
            min={50}
            max={500}
            step={10}
            unit="g"
            label="Weight Per Ball"
          />
        </div>
      </div>

      {/* Recipe Results */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl text-white border border-gray-700/50">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          Final Measurements
        </h2>
        
        <div className="space-y-8">
          {/* Pre-ferment Section */}
          {recipe.preFerment.enabled && weights.preFerment.total > 0 && (
            <div className="bg-purple-900/50 rounded-2xl p-6 border border-purple-600/30">
              <h3 className="text-lg font-bold text-purple-300 mb-4 uppercase tracking-wide">
                {recipe.preFerment.type} ({recipe.preFerment.hydration}% hydration)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-lg">Flour</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold text-xl">{Math.round(weights.preFerment.flour)}g</span>
                    <span className="text-gray-400 text-sm">({((weights.preFerment.flour / weights.totalFlourWeight) * 100).toFixed(0)}%)</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-lg">Water</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold text-xl">{Math.round(weights.preFerment.water)}g</span>
                    <span className="text-gray-400 text-sm">({((weights.preFerment.water / weights.totalFlourWeight) * 100).toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="border-t border-purple-600/30 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300 font-bold text-lg">Total</span>
                    <span className="text-purple-300 font-bold text-xl">{Math.round(weights.preFerment.total)}g</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Final Dough Section */}
          <div>
            <h3 className="text-lg font-bold text-green-300 mb-4 uppercase tracking-wide">
              Final Dough Mix
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-lg font-medium">Flour</span>
                <div className="flex items-center gap-3">
                  <span className="text-white text-2xl font-bold">{Math.round(weights.finalDough.flour)}g</span>
                  <span className="text-gray-400 text-sm">({((weights.finalDough.flour / weights.totalFlourWeight) * 100).toFixed(0)}%)</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-lg font-medium">Water</span>
                <div className="flex items-center gap-3">
                  <span className="text-white text-2xl font-bold">{Math.round(weights.finalDough.water)}g</span>
                  <span className="text-gray-400 text-sm">({((weights.finalDough.water / weights.totalFlourWeight) * 100).toFixed(1)}%)</span>
                </div>
              </div>
              {Object.entries(weights.finalDough).map(([key, weight]) => {
                if (key === 'flour' || key === 'water' || weight === 0) return null
                return (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-gray-300 text-lg font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white text-2xl font-bold">{Math.round(weight as number)}g</span>
                      <span className="text-gray-400 text-sm">({recipe.ingredients[key as keyof typeof recipe.ingredients]}%)</span>
                    </div>
                  </div>
                )
              })}
              {recipe.preFerment.enabled && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-lg font-medium">{recipe.preFerment.type.charAt(0).toUpperCase() + recipe.preFerment.type.slice(1)}</span>
                  <span className="text-white text-2xl font-bold">{Math.round(weights.preFerment.total)}g</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="border-t border-gray-600 pt-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-300 font-bold text-xl">Total Weight</span>
              <span className="text-4xl font-black text-green-400">{Math.round(weights.totalDoughWeight)}g</span>
            </div>
            <div className="text-gray-400">
              For {doughBalls} dough balls at {ballWeight}g each
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center">
        <button
          onClick={onBack}
          className="w-full py-8 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-2xl font-black rounded-3xl focus:outline-none transition-all shadow-2xl active:scale-95 active:shadow-lg"
          style={{ minHeight: '80px' }}
        >
          ← Back to Settings
        </button>
      </div>
    </div>
  )
}