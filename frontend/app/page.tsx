"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Users, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";

interface Prediction {
  name: string;
  date_of_birth: string;
  place_of_birth: string;
  current_job: string;
  predicted_age: number;
  created_at: string;
}

export default function HomePage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"
        }/api/predictions`
      );
      setPredictions(response.data.data);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    return today.getFullYear() - birth.getFullYear();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="float-animation"
          >
            <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-foreground mb-6 font-montserrat"
          >
            Marriage Age
            <span className="text-primary block">Predictor</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto font-open-sans"
          >
            Discover when you might tie the knot with our AI-powered prediction
            algorithm. Based on lifestyle factors and personal data.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/predict">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 pulse-glow flex items-center gap-2 mx-auto">
                <Sparkles className="w-5 h-5" />
                Predict My Marriage Age
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Recent Predictions Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Users className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-montserrat">
              Recent Predictions
            </h2>
            <p className="text-lg text-muted-foreground font-open-sans">
              See what others discovered about their marriage timeline
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded mb-3"></div>
                  <div className="h-3 bg-muted rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-muted rounded mb-4 w-1/2"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {predictions.map((prediction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card hover:bg-card/80 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-border"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground font-montserrat">
                        {prediction.name}
                      </h3>
                      <p className="text-sm text-muted-foreground font-open-sans">
                        {prediction.current_job}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 font-open-sans">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Age:</span>{" "}
                      {calculateAge(prediction.date_of_birth)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">From:</span>{" "}
                      {prediction.place_of_birth}
                    </p>
                  </div>

                  <div className="bg-primary/5 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">
                      Predicted Marriage Age
                    </p>
                    <p className="text-2xl font-bold text-primary font-montserrat">
                      {prediction.predicted_age} years
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
