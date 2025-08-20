"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, Sparkles, Home, Share2, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface PredictionResult {
  predicted_age: number
  user_data: {
    name: string
    date_of_birth: string
    place_of_birth: string
    current_job: string
  }
}

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const storedResult = localStorage.getItem("predictionResult")
    if (storedResult) {
      const parsedResult = JSON.parse(storedResult)
      setResult(parsedResult.data)

      // Show confetti animation
      setTimeout(() => setShowConfetti(true), 500)
    } else {
      router.push("/predict")
    }
  }, [router])

  const calculateCurrentAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    return today.getFullYear() - birth.getFullYear()
  }

  const getYearsUntilMarriage = () => {
    if (!result) return 0
    const currentAge = calculateCurrentAge(result.user_data.date_of_birth)
    return Math.max(0, result.predicted_age - currentAge)
  }

  const shareResult = () => {
    if (navigator.share && result) {
      navigator.share({
        title: "My Marriage Age Prediction",
        text: `I'm predicted to get married at age ${result.predicted_age}! 💍`,
        url: window.location.origin,
      })
    } else {
      // Fallback to copying to clipboard
      const text = `I'm predicted to get married at age ${result?.predicted_age}! Check out your prediction at ${window.location.origin}`
      navigator.clipboard.writeText(text)
      alert("Result copied to clipboard!")
    }
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-open-sans">Loading your prediction...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background py-8 px-4 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: i % 2 === 0 ? "#6366f1" : "#f97316",
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <Heart className="w-16 h-16 text-primary mx-auto mb-6 float-animation" />
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 font-montserrat">
            Your Marriage
            <span className="text-primary block">Prediction</span>
          </h1>
          <p className="text-lg text-muted-foreground font-open-sans">
            Based on your personal data and lifestyle factors
          </p>
        </motion.div>

        {/* Result Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-card rounded-2xl p-8 shadow-2xl border border-border mb-8"
        >
          {/* Main Result */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5, type: "spring" }}
              className="bg-gradient-to-r from-primary to-secondary rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center pulse-glow"
            >
              <span className="text-4xl font-black text-white font-montserrat">{result.predicted_age}</span>
            </motion.div>

            <h2 className="text-2xl md:text-3xl font-bold text-card-foreground mb-2 font-montserrat">
              You'll likely get married at age {result.predicted_age}
            </h2>

            {getYearsUntilMarriage() > 0 ? (
              <p className="text-lg text-muted-foreground font-open-sans">
                That's approximately {getYearsUntilMarriage()} years from now!
              </p>
            ) : (
              <p className="text-lg text-secondary font-open-sans font-semibold">The time might be now! 💍</p>
            )}
          </div>

          {/* User Info Summary */}
          <div className="bg-muted/30 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4 font-montserrat">Prediction Based On:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-open-sans">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <span className="ml-2 font-medium text-card-foreground">{result.user_data.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Current Age:</span>
                <span className="ml-2 font-medium text-card-foreground">
                  {calculateCurrentAge(result.user_data.date_of_birth)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Location:</span>
                <span className="ml-2 font-medium text-card-foreground">{result.user_data.place_of_birth}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Profession:</span>
                <span className="ml-2 font-medium text-card-foreground">{result.user_data.current_job}</span>
              </div>
            </div>
          </div>

          {/* Fun Message */}
          <div className="bg-primary/5 rounded-xl p-6 text-center">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-card-foreground font-medium font-open-sans">
              Remember, this is just for fun! Your real love story will unfold in its own perfect timing. 💕
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/" className="flex-1">
            <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 font-montserrat">
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </Link>

          <button
            onClick={shareResult}
            className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 font-montserrat"
          >
            <Share2 className="w-5 h-5" />
            Share Result
          </button>

          <Link href="/predict" className="flex-1">
            <button className="w-full bg-card hover:bg-card/80 text-card-foreground border border-border px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 font-montserrat">
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
