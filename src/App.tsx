import DoughCalculator from './components/DoughCalculator'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-100 to-orange-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
              🍕
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              DoughCalc Pro
            </h1>
          </div>
        </header>
        <DoughCalculator />
      </div>
    </div>
  )
}

export default App
