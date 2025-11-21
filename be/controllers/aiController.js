// be/controllers/aiController.js
import Reflection from "../models/Reflection.js";
import natural from "natural";
import nlp from "compromise";

// Simple mood prediction based on reflection text
export const predictMood = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    // Simple sentiment analysis
    const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text.toLowerCase());
    const score = analyzer.getSentiment(tokens);

    let predictedMood = "neutral";
    if (score > 0.3) predictedMood = "happy";
    else if (score < -0.3) predictedMood = "sad";
    else if (text.toLowerCase().includes("angry") || text.toLowerCase().includes("frustrated")) predictedMood = "angry";
    else if (text.toLowerCase().includes("anxious") || text.toLowerCase().includes("worried")) predictedMood = "anxious";
    else if (text.toLowerCase().includes("calm") || text.toLowerCase().includes("peaceful")) predictedMood = "calm";

    res.status(200).json({
      predictedMood,
      confidence: Math.abs(score),
      sentimentScore: score,
    });
  } catch (error) {
    console.error("Mood prediction error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Summarize reflection
export const summarizeReflection = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    // Extract key sentences using NLP
    const doc = nlp(text);
    const sentences = doc.sentences().out('array');
    
    // Take first 2 sentences or key phrases
    const summary = sentences.slice(0, 2).join(' ');

    // Extract key topics
    const topics = doc.topics().out('array');
    const nouns = doc.nouns().out('array');

    res.status(200).json({
      summary: summary || text.substring(0, 100) + "...",
      keyTopics: topics.slice(0, 5),
      keyWords: nouns.slice(0, 5),
      wordCount: text.split(' ').length,
    });
  } catch (error) {
    console.error("Summarization error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user insights for therapist
export const getUserInsights = async (req, res) => {
  try {
    const { userId } = req.params;

    const reflections = await Reflection.find({ user: userId })
      .sort({ date: -1 })
      .limit(30);

    if (reflections.length === 0) {
      return res.status(200).json({
        message: "No reflections found",
        insights: {},
      });
    }

    // Mood patterns
    const moodCount = {};
    reflections.forEach(r => {
      moodCount[r.mood] = (moodCount[r.mood] || 0) + 1;
    });

    // Recent negative moods
    const negativeMoods = ["sad", "angry", "anxious"];
    const recentNegative = reflections
      .filter(r => negativeMoods.includes(r.mood.toLowerCase()))
      .slice(0, 5);

    // Common words in reflections
    const allText = reflections.map(r => r.content).join(' ');
    const doc = nlp(allText);
    const commonWords = doc.nouns().out('array').slice(0, 10);

    res.status(200).json({
      totalReflections: reflections.length,
      moodDistribution: moodCount,
      dominantMood: Object.keys(moodCount).reduce((a, b) => moodCount[a] > moodCount[b] ? a : b),
      recentNegativeMoods: recentNegative.length,
      commonThemes: commonWords,
      riskIndicators: recentNegative.length >= 3 ? "High" : recentNegative.length >= 1 ? "Medium" : "Low",
    });
  } catch (error) {
    console.error("User insights error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
