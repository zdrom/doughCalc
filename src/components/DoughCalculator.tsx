import { useState, useEffect } from 'react'

interface Recipe {
  id: string
  name: string
  doughBalls: number | string
  ballWeight: number | string
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

const defaultRecipe: Recipe = {
  id: 'default',
  name: 'Classic Neapolitan',
  doughBalls: 4,
  ballWeight: 250,
  ingredients: {
    flour: 100,
    water: 60,
    salt: 2.5,
    yeast: 0.3,
    oil: 0,
    sugar: 0,
  },
  preFerment: {
    enabled: false,
    type: 'poolish',
    percentage: 20,
    hydration: 100,
  }
}

export default function DoughCalculator() {
  const [recipe, setRecipe] = useState<Recipe>(defaultRecipe)
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [newRecipeName, setNewRecipeName] = useState('')
  
  // Collapse states
  const [collapsed, setCollapsed] = useState({
    settings: false,
    ingredients: false,
    preFerment: false,
  })

  const toggleCollapse = (section: keyof typeof collapsed) => {
    setCollapsed(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  useEffect(() => {
    const saved = localStorage.getItem('pizza-dough-recipes')
    if (saved) {
      setSavedRecipes(JSON.parse(saved))
    }
  }, [])

  const saveRecipes = (recipes: Recipe[]) => {
    localStorage.setItem('pizza-dough-recipes', JSON.stringify(recipes))
    setSavedRecipes(recipes)
  }

  const updateIngredient = (ingredient: keyof Recipe['ingredients'], value: number) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: {
        ...prev.ingredients,
        [ingredient]: value
      }
    }))
  }

  const updatePreferment = (field: keyof Recipe['preFerment'], value: boolean | string | number) => {
    setRecipe(prev => ({
      ...prev,
      preFerment: {
        ...prev.preFerment,
        [field]: value
      }
    }))
  }


  const updateDoughBalls = (value: number | string) => {
    setRecipe(prev => ({ ...prev, doughBalls: value === '' ? '' : Number(value) }))
  }

  const updateBallWeight = (value: number | string) => {
    setRecipe(prev => ({ ...prev, ballWeight: value === '' ? '' : Number(value) }))
  }

  const calculateWeights = () => {
    const doughBalls = Number(recipe.doughBalls) || 1
    const ballWeight = Number(recipe.ballWeight) || 50
    const totalDoughWeight = doughBalls * ballWeight
    const totalFlourWeight = (totalDoughWeight * recipe.ingredients.flour) / 100
    
    let preFermentFlour = 0
    let preFermentWater = 0
    let finalFlour = totalFlourWeight
    let finalWater = (totalDoughWeight * recipe.ingredients.water) / 100

    if (recipe.preFerment.enabled) {
      // Calculate pre-ferment weights
      const preFermentWeight = (totalDoughWeight * recipe.preFerment.percentage) / 100
      preFermentFlour = preFermentWeight / (1 + recipe.preFerment.hydration / 100)
      preFermentWater = preFermentFlour * (recipe.preFerment.hydration / 100)
      
      // Remaining flour and water for final dough
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

  const saveCurrentRecipe = () => {
    if (!newRecipeName.trim()) return
    
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now().toString(),
      name: newRecipeName.trim()
    }
    
    const updatedRecipes = [...savedRecipes, newRecipe]
    saveRecipes(updatedRecipes)
    setNewRecipeName('')
    setShowSaveDialog(false)
  }

  const loadRecipe = (loadedRecipe: Recipe) => {
    setRecipe(loadedRecipe)
  }

  const deleteRecipe = (id: string) => {
    const updatedRecipes = savedRecipes.filter(r => r.id !== id)
    saveRecipes(updatedRecipes)
  }

  const ingredientInputs = [
    { key: 'flour', label: 'Flour', unit: '%', disabled: true },
    { key: 'water', label: 'Water', unit: '%', disabled: false },
    { key: 'salt', label: 'Salt', unit: '%', disabled: false },
    { key: 'yeast', label: 'Yeast', unit: '%', disabled: false },
    { key: 'oil', label: 'Oil', unit: '%', disabled: false },
    { key: 'sugar', label: 'Sugar', unit: '%', disabled: false },
  ] as const

  return (
    <div className="space-y-6">
      {/* Recipe Results - Top Section */}
      <div>
        {/* Weight Results */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 shadow-2xl text-white border border-gray-700/50">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            Recipe Results
          </h2>
          
          {(() => {
            const weights = calculateWeights()
            return (
              <div className="space-y-6">
                {/* Pre-ferment Section */}
                {recipe.preFerment.enabled && weights.preFerment.total > 0 && (
                  <div className="bg-purple-900/50 rounded-2xl p-4 border border-purple-600/30">
                    <h3 className="text-sm font-bold text-purple-300 mb-3 uppercase tracking-wide">
                      {recipe.preFerment.type} ({recipe.preFerment.hydration}% hydration)
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Flour</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">{Math.round(weights.preFerment.flour)}g</span>
                          <span className="text-gray-400 text-xs">({((weights.preFerment.flour / weights.totalFlourWeight) * 100).toFixed(0)}%)</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Water</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">{Math.round(weights.preFerment.water)}g</span>
                          <span className="text-gray-400 text-xs">({((weights.preFerment.water / weights.totalFlourWeight) * 100).toFixed(1)}%)</span>
                        </div>
                      </div>
                      <div className="border-t border-purple-600/30 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300 font-medium">Total</span>
                          <span className="text-purple-300 font-bold">{Math.round(weights.preFerment.total)}g</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Final Dough Section */}
                <div>
                  <h3 className="text-sm font-bold text-green-300 mb-3 uppercase tracking-wide">
                    Final Dough Mix
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm font-medium">Flour</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-lg font-bold">{Math.round(weights.finalDough.flour)}g</span>
                        <span className="text-gray-400 text-xs">({((weights.finalDough.flour / weights.totalFlourWeight) * 100).toFixed(0)}%)</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm font-medium">Water</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-lg font-bold">{Math.round(weights.finalDough.water)}g</span>
                        <span className="text-gray-400 text-xs">({((weights.finalDough.water / weights.totalFlourWeight) * 100).toFixed(1)}%)</span>
                      </div>
                    </div>
                    {Object.entries(weights.finalDough).map(([key, weight]) => {
                      if (key === 'flour' || key === 'water' || weight === 0) return null
                      return (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-gray-300 text-sm font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white text-lg font-bold">{Math.round(weight as number)}g</span>
                            <span className="text-gray-400 text-xs">({recipe.ingredients[key as keyof typeof recipe.ingredients]}%)</span>
                          </div>
                        </div>
                      )
                    })}
                    {recipe.preFerment.enabled && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm font-medium">{recipe.preFerment.type.charAt(0).toUpperCase() + recipe.preFerment.type.slice(1)}</span>
                        <span className="text-white text-lg font-bold">{Math.round(weights.preFerment.total)}g</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-medium">Total Weight</span>
                    <span className="text-2xl font-black text-green-400">{Math.round(weights.totalDoughWeight)}g</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    For {Number(recipe.doughBalls) || 1} dough balls at {Number(recipe.ballWeight) || 50}g each
                  </div>
                </div>
              </div>
            )
          })()}
        </div>

      </div>

      {/* Input Controls */}
      <div className="space-y-6">
        {/* Recipe Controls */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 shadow-2xl text-white border border-gray-700/50">
          <div 
            className="flex items-center justify-between cursor-pointer mb-6"
            onClick={() => toggleCollapse('settings')}
          >
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              Recipe Settings
            </h2>
            <div className="flex items-center gap-3">
              {collapsed.settings && (
                <div className="text-sm text-gray-300 font-medium">
                  {Number(recipe.doughBalls) || 1} balls × {Number(recipe.ballWeight) || 50}g each
                </div>
              )}
              <div className={`transform transition-transform duration-200 ${collapsed.settings ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          {!collapsed.settings && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200 tracking-wide">
                DOUGH BALLS
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={recipe.doughBalls}
                  onChange={(e) => updateDoughBalls(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-600 text-white rounded-2xl focus:outline-none focus:border-orange-400 focus:bg-gray-700 transition-all text-lg font-semibold text-center"
                  required
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm font-medium">balls</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200 tracking-wide">
                BALL WEIGHT
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="50"
                  value={recipe.ballWeight}
                  onChange={(e) => updateBallWeight(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-600 text-white rounded-2xl focus:outline-none focus:border-orange-400 focus:bg-gray-700 transition-all text-lg font-semibold text-center"
                  required
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm font-medium">grams</span>
                </div>
              </div>
            </div>
            </div>
          )}
        </div>

        {/* Ingredients */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 shadow-2xl text-white border border-gray-700/50">
          <div 
            className="flex items-center justify-between cursor-pointer mb-6"
            onClick={() => toggleCollapse('ingredients')}
          >
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              Baker's Percentages
            </h2>
            <div className="flex items-center gap-3">
              {collapsed.ingredients && (
                <div className="text-sm text-gray-300 font-medium">
                  {recipe.ingredients.water}% water, {recipe.ingredients.salt}% salt, {recipe.ingredients.yeast}% yeast
                  {(recipe.ingredients.oil > 0 || recipe.ingredients.sugar > 0) && 
                    `, +${(recipe.ingredients.oil + recipe.ingredients.sugar).toFixed(1)}% extras`
                  }
                </div>
              )}
              <div className={`transform transition-transform duration-200 ${collapsed.ingredients ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          {!collapsed.ingredients && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ingredientInputs.map(({ key, label, unit, disabled }) => (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-semibold text-gray-200 tracking-wide">
                  {label.toUpperCase()}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={recipe.ingredients[key]}
                    onChange={(e) => updateIngredient(key, parseFloat(e.target.value) || 0)}
                    disabled={disabled}
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-2xl focus:outline-none transition-all text-lg font-semibold text-center ${
                      disabled 
                        ? 'bg-orange-100 border-orange-200 text-orange-800 cursor-not-allowed' 
                        : 'bg-gray-800 border-2 border-gray-600 text-white focus:border-red-400 focus:bg-gray-700'
                    }`}
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm font-medium">{unit}</span>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
        
        {/* Pre-ferment Controls */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 shadow-2xl text-white border border-gray-700/50">
          <div 
            className="flex items-center justify-between cursor-pointer mb-6"
            onClick={() => toggleCollapse('preFerment')}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <h2 className="text-xl font-bold text-white">Pre-ferment (Biga/Poolish)</h2>
              <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={recipe.preFerment.enabled}
                  onChange={(e) => updatePreferment('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            <div className="flex items-center gap-3">
              {collapsed.preFerment && (
                <div className="text-sm text-gray-300 font-medium">
                  {recipe.preFerment.enabled ? 
                    `${recipe.preFerment.percentage}% ${recipe.preFerment.type} (${recipe.preFerment.hydration}% hydration)` :
                    'Disabled'
                  }
                </div>
              )}
              <div className={`transform transition-transform duration-200 ${collapsed.preFerment ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {!collapsed.preFerment && recipe.preFerment.enabled && (
            <div className="space-y-6">
              {/* Type Selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    updatePreferment('type', 'poolish')
                    updatePreferment('hydration', 100)
                  }}
                  className={`px-4 py-3 rounded-2xl font-semibold transition-all ${
                    recipe.preFerment.type === 'poolish'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  }`}
                >
                  Poolish (100% hydration)
                </button>
                <button
                  onClick={() => {
                    updatePreferment('type', 'biga')
                    updatePreferment('hydration', 50)
                  }}
                  className={`px-4 py-3 rounded-2xl font-semibold transition-all ${
                    recipe.preFerment.type === 'biga'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  }`}
                >
                  Biga (~50% hydration)
                </button>
              </div>
              
              {/* Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-200 tracking-wide">
                    PERCENTAGE OF TOTAL DOUGH
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="5"
                      max="50"
                      step="1"
                      value={recipe.preFerment.percentage}
                      onChange={(e) => updatePreferment('percentage', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 pr-12 bg-gray-800 border-2 border-gray-600 text-white rounded-2xl focus:outline-none focus:border-purple-400 focus:bg-gray-700 transition-all text-lg font-semibold text-center"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-sm font-medium">%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-200 tracking-wide">
                    HYDRATION LEVEL
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="30"
                      max="150"
                      step="5"
                      value={recipe.preFerment.hydration}
                      onChange={(e) => updatePreferment('hydration', parseFloat(e.target.value) || 50)}
                      className="w-full px-4 py-3 pr-12 bg-gray-800 border-2 border-gray-600 text-white rounded-2xl focus:outline-none focus:border-purple-400 focus:bg-gray-700 transition-all text-lg font-semibold text-center"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-sm font-medium">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recipe Management */}
      <div>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 shadow-2xl text-white border border-gray-700/50">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          Recipe Management
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={() => setShowSaveDialog(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            💾 Save Recipe
          </button>
          
          <button
            onClick={() => setRecipe(defaultRecipe)}
            className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            🔄 Reset to Default
          </button>
        </div>

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-600 transform transition-all">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">💾 Save Recipe</h3>
              <input
                type="text"
                placeholder="Enter recipe name..."
                value={newRecipeName}
                onChange={(e) => setNewRecipeName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-600 bg-gray-700 text-white rounded-2xl focus:outline-none focus:border-blue-400 focus:bg-gray-600 mb-6 text-lg font-medium transition-all placeholder-gray-400"
                onKeyDown={(e) => e.key === 'Enter' && saveCurrentRecipe()}
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={saveCurrentRecipe}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all font-semibold shadow-lg"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowSaveDialog(false)
                    setNewRecipeName('')
                  }}
                  className="flex-1 px-6 py-3 bg-gray-600 text-gray-200 rounded-2xl hover:bg-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-600 transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Saved Recipes */}
        {savedRecipes.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              Saved Recipes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedRecipes.map((savedRecipe) => (
                <div key={savedRecipe.id} className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-4 border-2 border-gray-600 hover:border-purple-400 hover:shadow-lg transition-all">
                  <h4 className="font-bold text-white mb-2 text-lg">{savedRecipe.name}</h4>
                  <p className="text-sm text-gray-300 mb-4">
                    {Number(savedRecipe.doughBalls) || 1} balls × {Number(savedRecipe.ballWeight) || 50}g
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadRecipe(savedRecipe)}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      📥 Load
                    </button>
                    <button
                      onClick={() => deleteRecipe(savedRecipe.id)}
                      className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}