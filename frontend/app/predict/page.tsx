"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, User, MapPin, Briefcase, Smartphone, Bike, Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function PredictPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    date_of_birth: "",
    place_of_birth: "",
    current_job: "",
    body_count: 0,
    is_perfume_used: false,
    has_iphone: false,
    has_bike: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/predict`,
        formData,
      )

      // Store result and redirect
      localStorage.setItem("predictionResult", JSON.stringify(response.data))
      router.push("/result")
    } catch (error) {
      console.error("Error making prediction:", error)
      alert("Error making prediction. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "body_count"
            ? Number.parseInt(value) || 0
            : value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <Heart className="w-12 h-12 text-primary mx-auto mb-4 float-animation" />
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 font-montserrat">
            Predict Your
            <span className="text-primary block">Marriage Age</span>
          </h1>
          <p className="text-lg text-muted-foreground font-open-sans">
            Fill in your details for a personalized prediction
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-card rounded-2xl p-8 shadow-xl border border-border"
        >
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-card-foreground mb-2 font-open-sans">
                <User className="w-4 h-4 text-primary" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 font-open-sans"
                placeholder="Enter your full name"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-card-foreground mb-2 font-open-sans">
                <Heart className="w-4 h-4 text-primary" />
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 font-open-sans"
              />
            </div>

            {/* Place of Birth */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-card-foreground mb-2 font-open-sans">
                <MapPin className="w-4 h-4 text-primary" />
                Place of Birth
              </label>
              <input
                type="text"
                name="place_of_birth"
                value={formData.place_of_birth}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 font-open-sans"
                placeholder="City, Country"
              />
            </div>

            {/* Current Job */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-card-foreground mb-2 font-open-sans">
                <Briefcase className="w-4 h-4 text-primary" />
                Current Job
              </label>
              <select
                name="current_job"
                value={formData.current_job}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 font-open-sans"
              >
                <option value="">Select your job</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Doctor">Doctor</option>
                <option value="Teacher">Teacher</option>
                <option value="Artist">Artist</option>
                <option value="Entrepreneur">Entrepreneur</option>
                <option value="Student">Student</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Body Count */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-card-foreground mb-2 font-open-sans">
                <Heart className="w-4 h-4 text-secondary" />
                Relationship Experience
              </label>
              <input
                type="number"
                name="body_count"
                value={formData.body_count}
                onChange={handleInputChange}
                min="0"
                max="50"
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 font-open-sans"
                placeholder="Number of past relationships"
              />
            </div>

            {/* Lifestyle Questions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground font-montserrat">Lifestyle Questions</h3>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <label className="flex items-center gap-2 text-sm font-medium text-card-foreground font-open-sans">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Do you use perfume regularly?
                </label>
                <input
                  type="checkbox"
                  name="is_perfume_used"
                  checked={formData.is_perfume_used}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary focus:ring-primary border-border rounded"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <label className="flex items-center gap-2 text-sm font-medium text-card-foreground font-open-sans">
                  <Smartphone className="w-4 h-4 text-primary" />
                  Do you have an iPhone?
                </label>
                <input
                  type="checkbox"
                  name="has_iphone"
                  checked={formData.has_iphone}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary focus:ring-primary border-border rounded"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <label className="flex items-center gap-2 text-sm font-medium text-card-foreground font-open-sans">
                  <Bike className="w-4 h-4 text-primary" />
                  Do you own a bike?
                </label>
                <input
                  type="checkbox"
                  name="has_bike"
                  checked={formData.has_bike}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary focus:ring-primary border-border rounded"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-8 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground px-6 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 font-montserrat"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                Predicting...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Predict My Marriage Age
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  )
}
