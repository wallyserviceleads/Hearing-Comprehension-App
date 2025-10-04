+929
-0

import React, { useState, useRef } from 'react';
import { Volume2, Check, X, RotateCcw, Play, Settings, TrendingUp, Plus } from 'lucide-react';

const AuditoryTrainer = () => {
  const [difficulty, setDifficulty] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showVocab, setShowVocab] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newPhrase, setNewPhrase] = useState('');
  const [lastCorrect, setLastCorrect] = useState(null);
  
  const [speechRate, setSpeechRate] = useState(0.9);
  const [noiseType, setNoiseType] = useState('white');
  
  const [sessionHistory, setSessionHistory] = useState([]);
  const [customVocab, setCustomVocab] = useState([]);
  
  const audioContextRef = useRef(null);

  const baseExercises = [
    {
      type: 'multiple-choice',
      text: "I need to pick up milk from the grocery store",
      question: "What does the speaker need to buy?",
      options: ["Bread", "Milk", "Eggs", "Cheese"],
      correct: 1
    },
    {
      type: 'multiple-choice',
      text: "The meeting is scheduled for three o'clock on Tuesday",
      question: "When is the meeting?",
      options: ["Monday at 2", "Tuesday at 3", "Wednesday at 3", "Tuesday at 2"],
      correct: 1
    },
    {
      type: 'fill-blank',
      text: "Please turn left at the second traffic light",
      question: "Please turn ___ at the second traffic light",
      answer: "left"
    },
    {
      type: 'multiple-choice',
      text: "My daughter's birthday party is next Saturday at the park",
      question: "Where is the birthday party?",
      options: ["At home", "At the park", "At a restaurant", "At the pool"],
      correct: 1
    },
    {
      type: 'true-false',
      text: "I'm looking for a red jacket in size medium",
      question: "The speaker wants a blue jacket",
      answer: false
    },
    {
      type: 'fill-blank',
      text: "Can you call me back after lunch around one thirty",
      question: "Can you call me back after lunch around ___",
      answer: "one thirty"
    },
    {
      type: 'multiple-choice',
      text: "The pharmacy closes at six on weekdays",
      question: "When does the pharmacy close on weekdays?",
      options: ["5 PM", "6 PM", "7 PM", "8 PM"],
      correct: 1
    },
    {
      type: 'true-false',
      text: "I'll be waiting by the main entrance near the fountain",
      question: "The speaker will wait by the side entrance",
      answer: false
    },
    {
      type: 'multi-step',
      text: "First, preheat the oven to 350 degrees. Then mix the flour and sugar. Finally, bake for 25 minutes.",
      question: "What are the three steps?",
      options: [
        ["Preheat to 350", "Mix ingredients", "Bake 25 min"],
        ["Mix ingredients", "Preheat to 350", "Bake 25 min"],
        ["Preheat to 400", "Mix flour and eggs", "Bake 20 min"],
        ["Preheat to 350", "Add water", "Bake 30 min"]
      ],
      correct: 0
    },
    {
      type: 'fill-blank',
      text: "The prescription will be ready for pickup tomorrow morning at nine",
      question: "The prescription will be ready for pickup ___ at nine",
      answer: "tomorrow morning"
    },
    {
      type: 'multi-step',
      text: "Take exit 42, turn right onto Main Street, then left at the stoplight",
      question: "What are the directions?",
      options: [
        ["Exit 42", "Right on Main", "Left at light"],
        ["Exit 24", "Left on Main", "Right at light"],
        ["Exit 42", "Left on Main", "Right at light"],
        ["Exit 42", "Right on Main", "Right at light"]
      ],
      correct: 0
    },
    {
      type: 'true-false',
      text: "The concert starts at seven thirty and tickets are twenty dollars",
      question: "Tickets cost thirty dollars",
      answer: false
    }
  ];

  const customExercises = customVocab.map(item => ({
    type: 'multiple-choice',
    text: item.phrase,
    question: `What did you hear about ${item.keyword}?`,
    options: [item.phrase, `Different phrase with ${item.keyword}`, "Something else entirely", "Couldn't hear clearly"],
    correct: 0
  }));

  const exercises = [...baseExercises, ...customExercises];

  const generateNoise = (duration, noiseLevel, type) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const audioContext = audioContextRef.current;
    const bufferSize = audioContext.sampleRate * duration;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * noiseLevel;
      }
    } else if (type === 'restaurant') {
      for (let i = 0; i < bufferSize; i++) {
        const t = i / audioContext.sampleRate;
        output[i] = (Math.sin(2 * Math.PI * 200 * t + Math.random() * 10) + 
                     Math.sin(2 * Math.PI * 400 * t + Math.random() * 10) +
                     Math.random() * 0.5) * noiseLevel * 0.3;
      }
    } else if (type === 'tv') {
      for (let i = 0; i < bufferSize; i++) {
        const t = i / audioContext.sampleRate;
        output[i] = (Math.sin(2 * Math.PI * 300 * t) * 0.5 + Math.random() * 0.5) * noiseLevel * 0.4;
      }
    } else if (type === 'traffic') {
      for (let i = 0; i < bufferSize; i++) {
        const t = i / audioContext.sampleRate;
        output[i] = (Math.sin(2 * Math.PI * 80 * t) + Math.sin(2 * Math.PI * 120 * t) + Math.random() * 0.3) * noiseLevel * 0.35;
      }
    } else if (type === 'crowd') {
      for (let i = 0; i < bufferSize; i++) {
        const t = i / audioContext.sampleRate;
        output[i] = (Math.sin(2 * Math.PI * 150 * t + Math.random() * 20) + 
                     Math.sin(2 * Math.PI * 250 * t + Math.random() * 20) +
                     Math.sin(2 * Math.PI * 350 * t + Math.random() * 20) +
                     Math.random()) * noiseLevel * 0.25;
      }
    }
    
    return noiseBuffer;
  };

  const playAudioWithNoise = async (text) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const audioContext = audioContextRef.current;
    
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.pitch = 1;
    utterance.volume = 1;

    const noiseLevel = difficulty === 'easy' ? 0.1 : difficulty === 'medium' ? 0.25 : 0.4;
    const duration = text.length / 15;
    
    const noiseBuffer = generateNoise(duration, noiseLevel, noiseType);
    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.connect(audioContext.destination);
    noiseSource.start();
    
    utterance.onend = () => {
      setIsPlaying(false);
      noiseSource.stop();
    };
    
    speechSynthesis.speak(utterance);
  };

  const saveSession = (sessionScore, totalQuestions) => {
    const newSession = {
      date: new Date().toISOString(),
      difficulty,
      score: sessionScore,
      total: totalQuestions,
      percentage: Math.round((sessionScore / totalQuestions) * 100)
    };
    setSessionHistory([...sessionHistory, newSession]);
  };

  const handleDifficultySelect = (level) => {
    setDifficulty(level);
    setCurrentExercise(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setTextInput('');
    setLastCorrect(null);
  };

  const handleAnswer = (answer) => {
    if (answered) return;
    
    const exercise = exercises[currentExercise];
    let isCorrect = false;
    
    if (exercise.type === 'multiple-choice' || exercise.type === 'multi-step') {
      isCorrect = answer === exercise.correct;
      setSelectedAnswer(answer);
    } else if (exercise.type === 'true-false') {
      isCorrect = answer === exercise.answer;
      setSelectedAnswer(answer);
    } else if (exercise.type === 'fill-blank') {
      const normalized = answer.toLowerCase().trim();
      const correctAnswer = exercise.answer.toLowerCase().trim();
      isCorrect = normalized === correctAnswer || normalized.includes(correctAnswer);
      setSelectedAnswer(answer);
    }
    
    setAnswered(true);
    setShowFeedback(true);
    setLastCorrect(isCorrect);
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setAnswered(false);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setTextInput('');
      setLastCorrect(null);
    } else {
      const exercise = exercises[currentExercise];
      let finalScore = score;
      if (answered) {
        if (exercise.type === 'fill-blank') {
          const normalized = textInput.toLowerCase().trim();
          const correctAnswer = exercise.answer.toLowerCase().trim();
          if (normalized === correctAnswer || normalized.includes(correctAnswer)) {
            finalScore = score;
          }
        } else if (selectedAnswer === exercise.correct || selectedAnswer === exercise.answer) {
          finalScore = score;
        }
      }
      saveSession(finalScore, exercises.length);
      setCurrentExercise(-1);
    }
  };

  const handleRestart = () => {
    setDifficulty(null);
    setCurrentExercise(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setTextInput('');
    setLastCorrect(null);
  };

  const addCustomVocab = (keyword, phrase) => {
    const newItem = { keyword, phrase, id: Date.now() };
    setCustomVocab([...customVocab, newItem]);
  };

  const deleteCustomVocab = (id) => {
    setCustomVocab(customVocab.filter(item => item.id !== id));
  };

  if (showVocab) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Custom Vocabulary</h2>
              <button
                onClick={() => setShowVocab(false)}
                className="text-gray-600 hover:text-gray-800 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                Add names, places, and phrases specific to your life. These will be included in training exercises.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Keyword (name, place, etc.)
              </label>
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="e.g., Sarah, Walmart, Dr. Johnson"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phrase using the keyword
              </label>
              <input
                type="text"
                value={newPhrase}
                onChange={(e) => setNewPhrase(e.target.value)}
                placeholder="e.g., Sarah is coming over for dinner at six"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => {
                if (newKeyword && newPhrase) {
                  addCustomVocab(newKeyword, newPhrase);
                  setNewKeyword('');
                  setNewPhrase('');
                }
              }}
              className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors mb-6 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Vocabulary Item
            </button>

            {customVocab.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Your Vocabulary</h3>
                <div className="space-y-2">
                  {customVocab.map(item => (
                    <div key={item.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-semibold text-indigo-600">{item.keyword}:</span>
                        <span className="ml-2 text-gray-700">{item.phrase}</span>
                      </div>
                      <button
                        onClick={() => deleteCustomVocab(item.id)}
                        className="text-red-500 hover:text-red-700 ml-4"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showStats) {
    const recentSessions = sessionHistory.slice(-10).reverse();
    const avgScore = sessionHistory.length > 0
      ? Math.round(sessionHistory.reduce((sum, s) => sum + s.percentage, 0) / sessionHistory.length)
      : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Progress Statistics</h2>
              <button
                onClick={() => setShowStats(false)}
                className="text-gray-600 hover:text-gray-800 text-2xl"
              >
                ✕
              </button>
            </div>

            {sessionHistory.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No training sessions yet. Complete a session to see your progress!</p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Total Sessions</div>
                    <div className="text-3xl font-bold text-indigo-600">{sessionHistory.length}</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Average Score</div>
                    <div className="text-3xl font-bold text-green-600">{avgScore}%</div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-700 mb-3">Recent Sessions</h3>
                <div className="space-y-2">
                  {recentSessions.map((session, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-gray-800">
                            {new Date(session.date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {session.difficulty} • {session.score}/{session.total} correct
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-indigo-600">
                          {session.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-600 hover:text-gray-800 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Speech Rate: {speechRate.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Slower (0.5x)</span>
                <span>Normal (0.9x)</span>
                <span>Faster (1.5x)</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Background Noise Type
              </label>
              <div className="space-y-2">
                {[
                  { value: 'white', label: 'White Noise', desc: 'Generic background static' },
                  { value: 'restaurant', label: 'Restaurant', desc: 'Simulated crowd chatter' },
                  { value: 'tv', label: 'TV Background', desc: 'Television in the background' },
                  { value: 'traffic', label: 'Traffic', desc: 'Low-frequency road noise' },
                  { value: 'crowd', label: 'Crowd Voices', desc: 'Multiple overlapping voices' }
                ].map(option => (
                  <label
                    key={option.value}
                    className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      noiseType === option.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="noiseType"
                      value={option.value}
                      checked={noiseType === option.value}
                      onChange={(e) => setNoiseType(e.target.value)}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!difficulty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <Volume2 className="w-16 h-16 mx-auto mb-4 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Auditory Comprehension Trainer
              </h1>
              <p className="text-gray-600">
                Train your brain to understand speech in noisy environments
              </p>
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setShowStats(true)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">Progress</span>
              </button>
              <button
                onClick={() => setShowVocab(true)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Vocabulary</span>
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Settings className="w-5 h-5" />
                <span className="font-semibold">Settings</span>
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Select Difficulty Level
              </h2>
              
              <button
                onClick={() => handleDifficultySelect('easy')}
                className="w-full p-6 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-xl transition-all duration-200 text-left"
              >
                <h3 className="text-lg font-semibold text-green-800 mb-1">Easy</h3>
                <p className="text-sm text-green-700">Low background noise level</p>
              </button>

              <button
                onClick={() => handleDifficultySelect('medium')}
                className="w-full p-6 bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-200 rounded-xl transition-all duration-200 text-left"
              >
                <h3 className="text-lg font-semibold text-yellow-800 mb-1">Medium</h3>
                <p className="text-sm text-yellow-700">Moderate background noise level</p>
              </button>

              <button
                onClick={() => handleDifficultySelect('hard')}
                className="w-full p-6 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-xl transition-all duration-200 text-left"
              >
                <h3 className="text-lg font-semibold text-red-800 mb-1">Hard</h3>
                <p className="text-sm text-red-700">High background noise level</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentExercise === -1) {
    const percentage = Math.round((score / exercises.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Training Complete!
            </h2>
            <div className="text-6xl font-bold text-indigo-600 mb-2">
              {percentage}%
            </div>
            <p className="text-xl text-gray-600 mb-8">
              You got {score} out of {exercises.length} correct
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleRestart}
                className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
              >
                Try Another Level
              </button>
              <button
                onClick={() => {
                  setCurrentExercise(0);
                  setScore(0);
                  setAnswered(false);
                  setSelectedAnswer(null);
                  setShowFeedback(false);
                  setTextInput('');
                  setLastCorrect(null);
                }}
                className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
              >
                Practice Again ({difficulty})
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const exercise = exercises[currentExercise];

  const renderOptionClass = (idx) => {
    if (!answered) {
      return 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50';
    }
    if (exercise.type === 'multiple-choice' || exercise.type === 'multi-step') {
      if (idx === exercise.correct) {
        return 'border-green-300 bg-green-50';
      }
      if (idx === selectedAnswer && idx !== exercise.correct) {
        return 'border-red-300 bg-red-50';
      }
      return 'border-gray-200 opacity-70';
    }
    return 'border-gray-200';
  };

  const renderTrueFalseClass = (value) => {
    if (!answered) {
      return 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50';
    }
    if (value === exercise.answer) {
      return 'border-green-300 bg-green-50';
    }
    if (selectedAnswer === value && value !== exercise.answer) {
      return 'border-red-300 bg-red-50';
    }
    return 'border-gray-200 opacity-70';
  };

  const feedbackDescription = () => {
    if (!showFeedback) return null;
    if (exercise.type === 'fill-blank') {
      return `Correct answer: "${exercise.answer}"`;
    }
    if (exercise.type === 'true-false') {
      return `Correct answer: ${exercise.answer ? 'True' : 'False'}`;
    }
    if (exercise.type === 'multiple-choice' || exercise.type === 'multi-step') {
      const option = exercise.options[exercise.correct];
      if (Array.isArray(option)) {
        return `Correct sequence: ${option.join(' → ')}`;
      }
      return `Correct answer: ${option}`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              Question {currentExercise + 1} of {exercises.length}
            </div>
            <div className="text-sm font-semibold text-indigo-600">
              Score: {score}/{currentExercise + (answered ? 1 : 0)}
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Change Level
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowStats(true)}
                className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
              >
                View Progress
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
              >
                Settings
              </button>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Listen to the phrase:
              </h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                  {difficulty}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium capitalize">
                  {exercise.type.replace('-', ' ')}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => playAudioWithNoise(exercise.text)}
              disabled={isPlaying}
              className={`w-full p-6 bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 ${
                isPlaying ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Play className="w-8 h-8 text-indigo-600" />
              <span className="text-lg font-semibold text-indigo-700">
                {isPlaying ? 'Playing...' : 'Play Audio'}
              </span>
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {exercise.question}
            </h3>

            {exercise.type === 'multiple-choice' && (
              <div className="grid gap-3">
                {exercise.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={answered}
                    className={`p-4 border-2 rounded-xl text-left transition-all ${renderOptionClass(idx)} ${answered ? 'cursor-default' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-gray-700">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {exercise.type === 'multi-step' && (
              <div className="grid gap-3">
                {exercise.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={answered}
                    className={`p-4 border-2 rounded-xl transition-all text-left ${renderOptionClass(idx)} ${answered ? 'cursor-default' : ''}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                        {idx + 1}
                      </span>
                      <span className="text-gray-800 font-semibold">Step Order</span>
                    </div>
                    <ol className="space-y-2">
                      {option.map((step, stepIdx) => (
                        <li key={stepIdx} className="flex items-start gap-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                            {stepIdx + 1}
                          </span>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </button>
                ))}
              </div>
            )}

            {exercise.type === 'true-false' && (
              <div className="grid grid-cols-2 gap-4">
                {[true, false].map((value, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(value)}
                    disabled={answered}
                    className={`p-4 border-2 rounded-xl transition-all font-semibold ${renderTrueFalseClass(value)} ${answered ? 'cursor-default' : ''}`}
                  >
                    {value ? 'True' : 'False'}
                  </button>
                ))}
              </div>
            )}

            {exercise.type === 'fill-blank' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAnswer(textInput);
                }}
                className="space-y-3"
              >
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  disabled={answered}
                  placeholder="Type the missing word or phrase"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent disabled:bg-gray-100"
                />
                <button
                  type="submit"
                  disabled={answered || textInput.trim() === ''}
                  className={`w-full px-4 py-3 rounded-xl font-semibold text-white transition-colors ${
                    answered || textInput.trim() === ''
                      ? 'bg-indigo-300 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  Submit Answer
                </button>
              </form>
            )}
          </div>

          {showFeedback && (
            <div
              className={`p-5 rounded-2xl border-2 ${
                lastCorrect
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                {lastCorrect ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <X className="w-6 h-6" />
                )}
                <span className="text-lg font-semibold">
                  {lastCorrect ? 'Great job! You got it right.' : 'Not quite. Let\'s review the phrase.'}
                </span>
              </div>
              <div className="bg-white/70 rounded-xl p-4 text-gray-800">
                <div className="text-sm uppercase tracking-wide text-gray-500 mb-1">Phrase heard</div>
                <p className="text-base font-medium">{exercise.text}</p>
              </div>
              {feedbackDescription() && (
                <p className="mt-3 text-sm font-medium">
                  {feedbackDescription()}
                </p>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row sm:justify-between gap-3">
            <button
              onClick={() => setShowVocab(true)}
              className="w-full sm:w-auto px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            >
              Manage Vocabulary
            </button>
            <button
              onClick={handleNext}
              disabled={!answered}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white transition-colors ${
                answered ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'
              }`}
            >
              {currentExercise === exercises.length - 1 ? 'Finish Session' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditoryTrainer;
