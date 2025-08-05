import { useState } from 'react'
import DoughSettings from './components/DoughSettings'
import DoughResults from './components/DoughResults'

interface Recipe {
  id?: string
  name?: string
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

function App() {
  const [recipe, setRecipe] = useState<Recipe>(defaultRecipe)
  const [showResults, setShowResults] = useState(false)

  const handleCalculate = () => {
    setShowResults(true)
  }

  const handleBack = () => {
    setShowResults(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-6 py-8 max-w-2xl">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl flex items-center justify-center text-3xl shadow-xl">
              🍕
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              DoughCalc Pro
            </h1>
          </div>
          <p className="text-gray-300 text-xl font-medium">
            {showResults ? '🎯 Your dough measurements are ready' : '⚙️ Set your ratios and preferences'}
          </p>
        </header>
        
        {showResults ? (
          <DoughResults recipe={recipe} onBack={handleBack} />
        ) : (
          <DoughSettings recipe={recipe} onRecipeChange={setRecipe} onCalculate={handleCalculate} />
        )}
      </div>
      
      {/* Mobile-optimized styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Improve touch responsiveness */
          * {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
          }
          
          /* Ensure good touch targets on all interactive elements */
          button, input[type="range"] {
            touch-action: manipulation;
          }
          
          /* Improve slider appearance on mobile */
          input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            height: 12px;
            border-radius: 6px;
            outline: none;
          }
          
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            height: 28px;
            width: 28px;
            border-radius: 50%;
            background: #8b5cf6;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
            border: 3px solid white;
          }
          
          input[type="range"]::-moz-range-thumb {
            height: 28px;
            width: 28px;
            border-radius: 50%;
            background: #8b5cf6;
            cursor: pointer;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
          }
          
          /* Ensure proper viewport on mobile */
          @media (max-width: 768px) {
            body {
              font-size: 16px; /* Prevent zoom on iOS */
            }
          }
        `
      }} />
    </div>
  )
}

export default App
