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
    const targetTotalWeight = doughBalls * ballWeight
    
    // Calculate the total percentage of all ingredients
    const totalPercentage = recipe.ingredients.flour + 
                           recipe.ingredients.water + 
                           recipe.ingredients.salt + 
                           recipe.ingredients.yeast + 
                           recipe.ingredients.oil + 
                           recipe.ingredients.sugar
    
    // Calculate flour weight based on target total weight
    const totalFlourWeight = (targetTotalWeight * recipe.ingredients.flour) / totalPercentage
    
    // Calculate all ingredient weights based on flour weight
    const totalWaterWeight = (totalFlourWeight * recipe.ingredients.water) / recipe.ingredients.flour
    const totalSaltWeight = (totalFlourWeight * recipe.ingredients.salt) / recipe.ingredients.flour
    const totalYeastWeight = (totalFlourWeight * recipe.ingredients.yeast) / recipe.ingredients.flour
    const totalOilWeight = (totalFlourWeight * recipe.ingredients.oil) / recipe.ingredients.flour
    const totalSugarWeight = (totalFlourWeight * recipe.ingredients.sugar) / recipe.ingredients.flour
    
    // Calculate actual total weight (might be slightly different due to rounding)
    const actualTotalWeight = totalFlourWeight + totalWaterWeight + totalSaltWeight + totalYeastWeight + totalOilWeight + totalSugarWeight
    
    let preFermentFlour = 0
    let preFermentWater = 0
    let preFermentYeast = 0
    let finalFlour = totalFlourWeight
    let finalWater = totalWaterWeight

    if (recipe.preFerment.enabled) {
      // Calculate pre-ferment flour based on percentage of total flour
      preFermentFlour = (totalFlourWeight * recipe.preFerment.percentage) / 100
      preFermentWater = preFermentFlour * (recipe.preFerment.hydration / 100)
      
      // All yeast goes in the pre-ferment
      preFermentYeast = totalYeastWeight
      
      // Remaining flour and water for final dough
      finalFlour = totalFlourWeight - preFermentFlour
      finalWater = totalWaterWeight - preFermentWater
    }

    // Other ingredients for final dough (yeast only if no pre-ferment)
    const otherIngredients = {
      salt: totalSaltWeight,
      yeast: recipe.preFerment.enabled ? 0 : totalYeastWeight,
      oil: totalOilWeight,
      sugar: totalSugarWeight,
    }

    // Calculate hydration percentage
    const totalHydrationPercent = (totalWaterWeight / totalFlourWeight) * 100

    return {
      totalDoughWeight: actualTotalWeight,
      totalFlourWeight,
      totalWaterWeight,
      totalHydrationPercent,
      preFerment: {
        flour: preFermentFlour,
        water: preFermentWater,
        yeast: preFermentYeast,
        total: preFermentFlour + preFermentWater + preFermentYeast
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
          {/* Overall Dough Summary */}
          <div className="bg-blue-900/50 rounded-2xl p-6 border border-blue-600/30 mb-6">
            <h3 className="text-lg font-bold text-blue-300 mb-4 uppercase tracking-wide">
              Total Dough Composition
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-black text-white">{Math.round(weights.totalFlourWeight)}g</div>
                <div className="text-blue-300 font-medium">Total Flour</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-white">{Math.round(weights.totalWaterWeight)}g</div>
                <div className="text-blue-300 font-medium">Total Water</div>
              </div>
            </div>
            <div className="text-center mt-4 pt-4 border-t border-blue-600/30">
              <div className="text-2xl font-bold text-blue-200">
                {weights.totalHydrationPercent.toFixed(1)}% Hydration
              </div>
            </div>
          </div>

          {/* Pre-ferment Section */}
          {recipe.preFerment.enabled && weights.preFerment.total > 0 && (
            <div className="bg-purple-900/50 rounded-2xl p-6 border border-purple-600/30">
              <h3 className="text-lg font-bold text-purple-300 mb-4 uppercase tracking-wide">
                {recipe.preFerment.type} ({recipe.preFerment.hydration}% hydration)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-lg">Flour</span>
                  <span className="text-white font-bold text-xl">{Math.round(weights.preFerment.flour)}g</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-lg">Water</span>
                  <span className="text-white font-bold text-xl">{Math.round(weights.preFerment.water)}g</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-lg">Yeast</span>
                  <span className="text-white font-bold text-xl">{Math.round(weights.preFerment.yeast)}g</span>
                </div>
                <div className="border-t border-purple-600/30 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300 font-bold text-lg">Total {recipe.preFerment.type}</span>
                    <span className="text-purple-300 font-bold text-xl">{Math.round(weights.preFerment.total)}g</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Final Dough Mix Section */}
          <div>
            <h3 className="text-lg font-bold text-green-300 mb-4 uppercase tracking-wide">
              Final Dough Mix
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-lg font-medium">
                  {recipe.preFerment.enabled ? 'Remaining Flour' : 'Flour'}
                </span>
                <span className="text-white text-2xl font-bold">{Math.round(weights.finalDough.flour)}g</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-lg font-medium">
                  {recipe.preFerment.enabled ? 'Remaining Water' : 'Water'}
                </span>
                <span className="text-white text-2xl font-bold">{Math.round(weights.finalDough.water)}g</span>
              </div>
              {Object.entries(weights.finalDough).map(([key, weight]) => {
                if (key === 'flour' || key === 'water' || weight === 0) return null
                return (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-gray-300 text-lg font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <span className="text-white text-2xl font-bold">{Math.round(weight as number)}g</span>
                  </div>
                )
              })}
              {recipe.preFerment.enabled && (
                <div className="flex justify-between items-center border-t border-gray-600 pt-4">
                  <span className="text-gray-300 text-lg font-medium">Add {recipe.preFerment.type.charAt(0).toUpperCase() + recipe.preFerment.type.slice(1)}</span>
                  <span className="text-purple-300 text-2xl font-bold">{Math.round(weights.preFerment.total)}g</span>
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