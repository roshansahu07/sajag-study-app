```react
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  Bell, 
  User, 
  PlusCircle, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Pause, 
  RotateCcw, 
  TrendingUp, 
  Sparkles,
  Calendar,
  BookMarked,
  Award,
  Brain,
  Info,
  ChevronRight,
  TrendingDown
} from 'lucide-react';

// --- Gemini v2.5 Flash API Configuration ---
const apiKey = ""; // Runtime automatically injected by the platform

export default function App() {
  // --- स्टेट मैनेजमेंट (State Management) ---
  const [user, setUser] = useState({
    name: 'राहुल कुमार',
    category: 'प्रतियोगी परीक्षा (Competitive Exams)',
    availableHours: 6,
    streak: 5, // लगातार 5 दिनों से सक्रिय
    points: 350
  });

  // 4-स्टेज वैज्ञानिक रिवीजन डेटा मॉडल (Spaced Repetition Database)
  const [studyLogs, setStudyLogs] = useState([
    {
      id: 1,
      subject: 'भौतिक विज्ञान (Physics)',
      topic: 'घर्षण और गति के नियम (Friction & Laws of Motion)',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // कल पढ़ा था
      difficulty: 'कठिन (Hard)',
      timeSpent: 2,
      currentStage: 1, // Stage 1 revision is due today
      stages: [
        { name: 'R1 (24h)', due: new Date(Date.now()).toISOString().split('T')[0], completed: false },
        { name: 'R2 (3d)', due: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
        { name: 'R3 (7d)', due: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
        { name: 'Test (15d)', due: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false }
      ]
    },
    {
      id: 2,
      subject: 'इतिहास (History)',
      topic: 'सिंधु घाटी सभ्यता (Indus Valley Civilization)',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 दिन पहले पढ़ा था
      difficulty: 'मध्यम (Medium)',
      timeSpent: 1.5,
      currentStage: 2, // Stage 2 revision due today
      stages: [
        { name: 'R1 (24h)', due: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: true },
        { name: 'R2 (3d)', due: new Date(Date.now()).toISOString().split('T')[0], completed: false },
        { name: 'R3 (7d)', due: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
        { name: 'Test (15d)', due: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false }
      ]
    }
  ]);

  // नया स्टडी इनपुट स्टेट
  const [newLog, setNewLog] = useState({
    subject: '',
    customSubject: '',
    topic: '',
    difficulty: 'मध्यम (Medium)',
    timeSpent: 2
  });

  // टाइमर स्टेट (Pomodoro Timer)
  const [timer, setTimer] = useState({
    minutes: 25,
    seconds: 0,
    isActive: false,
    mode: 'Focus' // Focus या Break
  });

  // एक्टिव स्क्रीन टैब
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // कस्टम अलर्ट/टोस्ट संदेश स्टेट
  const [alertMsg, setAlertMsg] = useState(null);

  // --- AI मॉक टेस्ट स्टेट ---
  const [selectedTopicForTest, setSelectedTopicForTest] = useState(null);
  const [aiQuiz, setAiQuiz] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // --- नोटिफिकेशन/सुझाव स्टेट (स्वचालित विश्लेषण) ---
  const [notifications, setNotifications] = useState([]);

  // टोस्ट अलर्ट दिखाने के लिए फंक्शन
  const showAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(null), 4000);
  };

  // --- स्मार्ट सुझाव विश्लेषक (Smart Suggestions Analyzer) ---
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const generatedAlerts = [];

    // 1. वैज्ञानिक अंतराल विश्लेषण (Spaced Repetition Alerts)
    studyLogs.forEach(log => {
      const activeStage = log.stages.find(s => !s.completed);
      if (activeStage && activeStage.due === todayStr) {
        generatedAlerts.push({
          id: `alert-${log.id}`,
          title: `स्मार्ट रिवीजन अलर्ट: ${log.subject} 💡`,
          text: `आपने पूर्व में "${log.topic}" पढ़ा था। आज वैज्ञानिक अंतराल के अनुसार "${activeStage.name}" का समय है। स्मरण शक्ति बनाए रखने के लिए तुरंत 10 मिनट दोहराएं!`,
          type: 'urgent',
          actionTopic: log
        });
      }
    });

    // 2. संतुलन सुझाव (Subject Balancing Suggestions)
    if (studyLogs.length > 0) {
      const subjectsCount = studyLogs.reduce((acc, curr) => {
        acc[curr.subject] = (acc[curr.subject] || 0) + 1;
        return acc;
      }, {});
      
      const uniqueSubjects = Object.keys(subjectsCount);
      if (uniqueSubjects.length < 2 && studyLogs.length >= 3) {
        generatedAlerts.push({
          id: 'balance-tip',
          title: 'विषय संतुलन चेतावनी ⚖️',
          text: 'आप केवल एक ही विषय पर अधिक ध्यान दे रहे हैं। अन्य विषयों का संतुलन बनाए रखने के लिए आज नया विषय शुरू करें।',
          type: 'tip'
        });
      }
    }

    // 3. सामान्य पोमोडोरो टिप
    generatedAlerts.push({
      id: 'focus-tip-1',
      title: 'एकाग्रता सुधार गाइड ⚡',
      text: 'लगातार 45 मिनट से अधिक न पढ़ें। हमारे "फोकस टाइमर" टैब में जाकर 25 मिनट का एक सेशन अभी चालू करें!',
      type: 'tip'
    });

    setNotifications(generatedAlerts);
  }, [studyLogs]);

  // --- Exponential Backoff के साथ Gemini API कॉल ---
  const callGeminiWithBackoff = async (payload, retries = 5, delay = 1000) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        if (i === retries - 1) throw err;
      }
      await new Promise(res => setTimeout(res, delay));
      delay *= 2; 
    }
    throw new Error("सभी रीट्राय विफल रहे।");
  };

  // --- AI टेस्ट जेनरेटर (Active Recall MCQ Generation) ---
  const handleGenerateQuiz = async (log) => {
    setSelectedTopicForTest(log);
    setAiQuiz(null);
    setUserAnswers({});
    setQuizSubmitted(false);
    setLoadingQuiz(true);
    setActiveTab('test-arena');

    const systemPrompt = "You are an expert Indian tutor designing interactive active recall quizzes for competitive exam students.";
    const userPrompt = `Create a 3-question multiple choice test in Hindi based on Subject: "${log.subject}" and Topic: "${log.topic}". 
    The questions must assess conceptual clarity.
    Format the response strictly as a JSON object inside your reply containing a 'questions' array. Each question must have:
    - 'question' (string in Hindi)
    - 'options' (array of exactly 4 strings in Hindi)
    - 'correctIndex' (integer from 0 to 3)
    - 'explanation' (string in Hindi explaining why the option is correct)
    
    Do not wrap in markdown or backticks. Return raw JSON text only.`;

    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            questions: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  question: { type: "STRING" },
                  options: { type: "ARRAY", items: { type: "STRING" } },
                  correctIndex: { type: "INTEGER" },
                  explanation: { type: "STRING" }
                },
                required: ["question", "options", "correctIndex", "explanation"]
              }
            }
          },
          required: ["questions"]
        }
      }
    };

    try {
      const data = await callGeminiWithBackoff(payload);
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textResponse) {
        const parsedQuiz = JSON.parse(textResponse);
        setAiQuiz(parsedQuiz.questions);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error(error);
      showAlert("⚠️ AI टेस्ट बनाने में समस्या हुई। कृपया दोबारा प्रयास करें।");
      setActiveTab('dashboard');
    } finally {
      setLoadingQuiz(false);
    }
  };

  // --- क्विज़ सबमिशन हैंडलर ---
  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    let correctCount = 0;
    aiQuiz.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const pointsWon = correctCount * 20;
    setUser(prev => ({ 
      ...prev, 
      points: prev.points + pointsWon,
      streak: prev.streak + 1 
    }));

    showAlert(`🎉 टेस्ट समाप्त! आपका स्कोर: ${correctCount}/3. आपको मिले +${pointsWon} XP पॉइंट्स!`);
    
    if (correctCount >= 2 && selectedTopicForTest) {
      promoteRevisionStage(selectedTopicForTest.id);
    }
  };

  // --- रिवीजन स्टेज प्रमोटर ---
  const promoteRevisionStage = (logId) => {
    setStudyLogs(prev => prev.map(log => {
      if (log.id === logId) {
        const nextStage = log.currentStage + 1;
        const updatedStages = log.stages.map((stage, sIdx) => {
          if (sIdx === log.currentStage - 1) {
            return { ...stage, completed: true };
          }
          return stage;
        });

        return {
          ...log,
          currentStage: nextStage > 4 ? 4 : nextStage,
          stages: updatedStages
        };
      }
      return log;
    }));
  };

  // --- साधारण मैन्युअल रिवीजन पूर्ण मार्क करना ---
  const handleMarkStageCompleted = (logId, stageIndex) => {
    setStudyLogs(prev => prev.map(log => {
      if (log.id === logId) {
        const updatedStages = [...log.stages];
        updatedStages[stageIndex].completed = true;
        
        const nextIdx = stageIndex + 1;
        const nextStage = nextIdx + 1;

        return {
          ...log,
          currentStage: nextStage > 4 ? 4 : nextStage,
          stages: updatedStages
        };
      }
      return log;
    }));
    setUser(prev => ({ ...prev, points: prev.points + 15 }));
    showAlert('✅ रिवीजन रिकॉर्ड दर्ज हो गया! आपको मिले +15 XP पॉइंट्स।');
  };

  // --- दैनिक समय उपयोगिता बजट गणना ---
  const todayTotalAllocated = studyLogs.reduce((acc, log) => acc + (parseFloat(log.timeSpent) || 0), 0);
  const remainingTime = Math.max(0, user.availableHours - todayTotalAllocated);

  // --- नया टॉपिक जोड़ने का हैंडलर ---
  const handleAddLog = (e) => {
    e.preventDefault();
    const finalSubject = newLog.subject === 'अन्य (Custom)' ? newLog.customSubject : newLog.subject;

    if (!finalSubject || !newLog.topic) {
      showAlert('⚠️ कृपया विषय और मुख्य टॉपिक का नाम दर्ज करें!');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    
    // वैज्ञानिक अंतराल के आधार पर अगली तारीखें सेट करना
    let d1 = new Date(); d1.setDate(d1.getDate() + 1); // 1 दिन बाद
    let d2 = new Date(); d2.setDate(d2.getDate() + 3); // 3 दिन बाद
    let d3 = new Date(); d3.setDate(d3.getDate() + 7); // 7 दिन बाद
    let d4 = new Date(); d4.setDate(d4.getDate() + 15); // 15 दिन बाद (टेस्ट चरण)

    const newEntry = {
      id: Date.now(),
      subject: finalSubject,
      topic: newLog.topic,
      date: todayStr,
      difficulty: newLog.difficulty,
      timeSpent: parseFloat(newLog.timeSpent) || 1,
      currentStage: 1,
      stages: [
        { name: 'R1 (24h)', due: d1.toISOString().split('T')[0], completed: false },
        { name: 'R2 (3d)', due: d2.toISOString().split('T')[0], completed: false },
        { name: 'R3 (7d)', due: d3.toISOString().split('T')[0], completed: false },
        { name: 'Test (15d)', due: d4.toISOString().split('T')[0], completed: false }
      ]
    };

    setStudyLogs([newEntry, ...studyLogs]);
    setUser(prev => ({ ...prev, points: prev.points + 50 }));
    showAlert('🚀 शानदार! पढ़ाई का ब्यौरा दर्ज हो गया। आपको मिले +50 XP!');
    setNewLog({
      subject: '',
      customSubject: '',
      topic: '',
      difficulty: 'मध्यम (Medium)',
      timeSpent: 2
    });
    setActiveTab('dashboard');
  };

  // --- फोकस टाइमर एनिमेटर ---
  useEffect(() => {
    let interval = null;
    if (timer.isActive) {
      interval = setInterval(() => {
        if (timer.seconds > 0) {
          setTimer(prev => ({ ...prev, seconds: prev.seconds - 1 }));
        } else if (timer.seconds === 0 && timer.minutes > 0) {
          setTimer(prev => ({ ...prev, minutes: prev.minutes - 1, seconds: 59 }));
        } else {
          clearInterval(interval);
          const nextMode = timer.mode === 'Focus' ? 'Break' : 'Focus';
          const nextMins = nextMode === 'Focus' ? 25 : 5;
          setTimer({ minutes: nextMins, seconds: 0, isActive: false, mode: nextMode });
          showAlert(`🔔 ${timer.mode === 'Focus' ? 'फोकस सत्र समाप्त! एक छोटा ब्रेक लें।' : 'ब्रेक समाप्त! वापस काम पर लगें।'}`);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer.isActive, timer.seconds, timer.minutes]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between items-center p-2 sm:p-4">
      
      {/* ऊपरी हेडर */}
      <header className="w-full max-w-md text-center py-2">
        <h1 className="text-xl sm:text-2xl font-black text-indigo-400 flex items-center justify-center gap-2">
          <Brain className="w-6 h-6 text-indigo-500 animate-pulse" /> सजग छात्र <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-[9px] text-white px-2 py-0.5 rounded-full font-bold">ULTIMATE v2.5</span>
        </h1>
        <p className="text-[10px] text-slate-400 mt-1">वैज्ञानिक 4-स्टेज रिवीजन ट्रैकर, AI टेस्ट और सुझाव प्रणाली</p>
      </header>

      {/* स्मार्टफोन स्क्रीन फ्रेम */}
      <div className="w-full max-w-md bg-slate-900 rounded-[32px] border-4 border-slate-800 shadow-2xl relative flex flex-col overflow-hidden h-[84vh] max-h-[790px]">
        
        {/* फोन का फ्रंट कैमरा नॉच */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-4 w-32 bg-slate-800 rounded-b-xl z-20 flex justify-center items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 mr-2"></div>
          <div className="w-10 h-1 rounded-full bg-slate-950"></div>
        </div>

        {/* सुंदर कस्टम अलर्ट टोस्टर */}
        {alertMsg && (
          <div className="absolute top-8 left-4 right-4 bg-indigo-600 text-white p-3.5 rounded-xl shadow-xl z-50 text-xs flex items-center gap-2 border border-indigo-400 animate-fadeIn">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">{alertMsg}</span>
          </div>
        )}

        {/* स्टेटस बार */}
        <div className="bg-slate-950 text-[10px] px-6 pt-5 pb-2 text-slate-400 flex justify-between items-center z-10 border-b border-slate-800/40">
          <div>09:30 AM</div>
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <span className="bg-indigo-900/40 border border-indigo-700/50 text-[9px] px-1.5 py-0.5 rounded text-indigo-300">
              🔥 {user.streak} दिन स्ट्रीक
            </span>
            <span>⭐ {user.points} XP</span>
          </div>
        </div>

        {/* मुख्य स्क्रॉल करने योग्य भाग */}
        <main className="flex-1 overflow-y-auto p-4 pb-16">

          {/* टैब 1: डैशबोर्ड */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              
              {/* समय बजट और उपयोग प्रगति */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-4 rounded-2xl border border-indigo-900/40 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xs text-indigo-300 font-bold uppercase tracking-wide">दैनिक अध्ययन समय बजट</h2>
                    <h3 className="text-lg font-black text-white mt-1">
                      {todayTotalAllocated} / {user.availableHours} घंटे बुक हैं
                    </h3>
                  </div>
                  <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] py-1 px-2 rounded-lg font-bold">
                    {remainingTime > 0 ? `${remainingTime}h उपलब्ध` : 'समय सीमा पूर्ण!'}
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (todayTotalAllocated / user.availableHours) * 100)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    विषय संतुलन: {studyLogs.length} सक्रिय सब्जेक्ट्स
                  </span>
                  <span>आज का कोटा</span>
                </div>
              </div>

              {/* आज का 4-स्टेज वैज्ञानिक रिवीजन ग्रिड */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  सक्रिय मेमोरी ट्रैकर (Spaced Repetition)
                </h3>

                <div className="space-y-3">
                  {studyLogs.map(log => {
                    const activeStageIndex = log.stages.findIndex(s => !s.completed);
                    const currentStageObj = log.stages[activeStageIndex] || null;
                    const isOverdue = currentStageObj ? new Date(currentStageObj.due) <= new Date() : false;

                    return (
                      <div key={log.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] bg-indigo-950 border border-indigo-800 text-indigo-300 px-1.5 py-0.5 rounded font-bold uppercase">
                              {log.subject}
                            </span>
                            <h4 className="text-xs font-bold text-white mt-1.5">{log.topic}</h4>
                            <p className="text-[9px] text-slate-400 mt-0.5">अध्ययन प्रारंभ: {log.date}</p>
                          </div>

                          {/* एक्टिव रिकॉल एआई टेस्ट बटन */}
                          <button 
                            onClick={() => handleGenerateQuiz(log)}
                            className="bg-slate-900 hover:bg-slate-800 border border-indigo-500/40 hover:border-indigo-500 text-indigo-400 p-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition"
                          >
                            <Brain className="w-3.5 h-3.5" />
                            <span>AI टेस्ट</span>
                          </button>
                        </div>

                        {/* 4-स्टेज माइलस्टोन बार */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[9px] text-slate-400">
                            <span>मेमोरी रिटेंशन टाइमलाइन</span>
                            <span className="text-indigo-400 font-bold">स्टेज {log.currentStage}/4</span>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-1.5">
                            {log.stages.map((stage, sIdx) => {
                              let statusColor = "bg-slate-800 text-slate-500 border-slate-700";
                              if (stage.completed) {
                                statusColor = "bg-emerald-950 border-emerald-500 text-emerald-400";
                              } else if (sIdx === activeStageIndex) {
                                statusColor = isOverdue 
                                  ? "bg-rose-950/40 border-rose-600 text-rose-400 animate-pulse font-bold" 
                                  : "bg-indigo-950/40 border-indigo-500 text-indigo-300 font-bold";
                              }

                              return (
                                <button
                                  key={sIdx}
                                  disabled={stage.completed || sIdx !== activeStageIndex}
                                  onClick={() => handleMarkStageCompleted(log.id, sIdx)}
                                  className={`border text-[9px] py-1 rounded text-center transition ${statusColor} flex flex-col items-center justify-center`}
                                >
                                  <span>{stage.name}</span>
                                  {stage.completed ? (
                                    <span className="text-[7px]">✔ पूर्ण</span>
                                  ) : (
                                    <span className="text-[7px] text-[8px] scale-90">{stage.due.split('-').slice(1).join('/')}</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* टैब 2: पढ़ाई दर्ज करें */}
          {activeTab === 'log' && (
            <div className="space-y-4">
              <div className="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-900/50">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-indigo-400" />
                  आज जो पढ़ा, उसे दर्ज करें
                </h3>
                <p className="text-[11px] text-slate-300 mt-1">यहाँ अपनी पढ़ाई दर्ज करें। सिस्टम स्वचालित रूप से स्पैस्ड रिपीटीशन और AI अभ्यास शेड्यूलर बना देगा।</p>
              </div>

              <form onSubmit={handleAddLog} className="space-y-4 text-xs">
                
                {/* विषय चयन */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">विषय (Subject):</label>
                  <select 
                    value={newLog.subject}
                    onChange={(e) => setNewLog({ ...newLog, subject: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">-- विषय का चयन करें --</option>
                    <option value="भौतिक विज्ञान (Physics)">भौतिक विज्ञान (Physics)</option>
                    <option value="रसायन विज्ञान (Chemistry)">रसायन विज्ञान (Chemistry)</option>
                    <option value="गणित (Maths)">गणित (Maths)</option>
                    <option value="जीव विज्ञान (Biology)">जीव विज्ञान (Biology)</option>
                    <option value="इतिहास (History)">इतिहास (History)</option>
                    <option value="भूगोल (Geography)">भूगोल (Geography)</option>
                    <option value="राजनीति शास्त्र (Polity)">राजनीति शास्त्र (Polity)</option>
                    <option value="सामान्य ज्ञान (General Knowledge)">सामान्य ज्ञान (General Knowledge)</option>
                    <option value="अन्य (Custom)">अन्य (कोई नया विषय दर्ज करें)</option>
                  </select>
                </div>

                {newLog.subject === 'अन्य (Custom)' && (
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">नया विषय दर्ज करें:</label>
                    <input 
                      type="text" 
                      placeholder="विषय का नाम"
                      value={newLog.customSubject}
                      onChange={(e) => setNewLog({ ...newLog, customSubject: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                    />
                  </div>
                )}

                {/* टॉपिक */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">पढ़ा गया टॉपिक (Topic Name):</label>
                  <input 
                    type="text" 
                    placeholder="जैसे: प्रकाश संश्लेषण, मुगल साम्राज्य"
                    value={newLog.topic}
                    onChange={(e) => setNewLog({ ...newLog, topic: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                  />
                </div>

                {/* समय और कठिनाई */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">पढ़ाई का समय (घंटे):</label>
                    <input 
                      type="number" 
                      step="0.5" 
                      min="0.5" 
                      max="8"
                      value={newLog.timeSpent}
                      onChange={(e) => setNewLog({ ...newLog, timeSpent: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">कठिनाई (Difficulty):</label>
                    <select 
                      value={newLog.difficulty}
                      onChange={(e) => setNewLog({ ...newLog, difficulty: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                    >
                      <option value="आसान (Easy)">आसान (Easy)</option>
                      <option value="मध्यम (Medium)">मध्यम (Medium)</option>
                      <option value="कठिन (Hard)">कठिन (Hard)</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition text-xs flex items-center justify-center gap-1"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>सिस्टम में सुरक्षित करें (+50 XP)</span>
                </button>
              </form>
            </div>
          )}

          {/* टैब 3: एआई टेस्ट एरिना (AI Test Arena Screen Overlay) */}
          {activeTab === 'test-arena' && (
            <div className="space-y-4">
              
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/60 text-center">
                <span className="text-[9px] bg-indigo-900 text-indigo-300 px-2 py-0.5 rounded font-black uppercase">
                  {selectedTopicForTest?.subject}
                </span>
                <h3 className="text-sm font-bold text-white mt-1.5">{selectedTopicForTest?.topic}</h3>
                <p className="text-[10px] text-slate-400 mt-1">Gemini AI द्वारा तैयार किया गया रीयल-टाइम मॉक टेस्ट</p>
              </div>

              {loadingQuiz ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-slate-400">Gemini AI आपके लिए टेस्ट तैयार कर रहा है...</p>
                </div>
              ) : aiQuiz ? (
                <div className="space-y-5 text-xs">
                  {aiQuiz.map((q, qIdx) => (
                    <div key={qIdx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                      <h4 className="font-bold text-slate-200 leading-relaxed">
                        प्रश्न {qIdx + 1}: {q.question}
                      </h4>
                      
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => {
                          let optClass = "border-slate-800 hover:border-slate-700 text-slate-300";
                          if (userAnswers[qIdx] === oIdx) {
                            optClass = "border-indigo-500 bg-indigo-950/20 text-indigo-300 font-semibold";
                          }
                          if (quizSubmitted) {
                            if (oIdx === q.correctIndex) {
                              optClass = "border-emerald-500 bg-emerald-950/30 text-emerald-400 font-bold";
                            } else if (userAnswers[qIdx] === oIdx) {
                              optClass = "border-rose-500 bg-rose-950/30 text-rose-400";
                            } else {
                              optClass = "border-slate-800 text-slate-600 opacity-60";
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={quizSubmitted}
                              onClick={() => setUserAnswers({ ...userAnswers, [qIdx]: oIdx })}
                              className={`w-full text-left p-2.5 rounded-xl border text-[11px] transition ${optClass}`}
                            >
                              {oIdx + 1}. {opt}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-[10px] text-slate-400 leading-normal animate-fadeIn">
                          <strong className="text-indigo-400 block mb-0.5">व्याख्या (Explanation):</strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}

                  {!quizSubmitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(userAnswers).length < aiQuiz.length}
                      className="w-full bg-emerald-600 disabled:opacity-40 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition shadow-lg text-xs"
                    >
                      टेस्ट सबमिट करें
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl transition text-xs"
                    >
                      डैशबोर्ड पर वापस जाएं
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-xs text-slate-400">टेस्ट शुरू करने में असमर्थ। कृपया पुनः प्रयास करें।</p>
                </div>
              )}

            </div>
          )}

          {/* टैब 4: फोकस टाइमर */}
          {activeTab === 'timer' && (
            <div className="space-y-6 flex flex-col items-center justify-center min-h-[440px]">
              
              <div className="text-center max-w-xs">
                <h3 className="text-sm font-bold text-white flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-4 h-4 text-indigo-400 animate-pulse" />
                  पोमोडोरो कंटीन्यूअस फोकस
                </h3>
                <p className="text-[10px] text-slate-400">
                  ध्यान भटकाए बिना पढ़ाई करने की वैज्ञानिक विधि। 25 मिनट पढ़ाई, फिर 5 मिनट का ब्रेक।
                </p>
              </div>

              {/* सर्कुलर टाइमर */}
              <div className="relative w-44 h-44 rounded-full border-4 border-indigo-500/20 flex flex-col items-center justify-center bg-slate-900 shadow-inner">
                <div className="absolute inset-0 rounded-full border-2 border-indigo-500 border-dashed animate-spin-slow opacity-40"></div>
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">{timer.mode}</span>
                <span className="text-4xl font-black text-white my-1 font-mono">
                  {String(timer.minutes).padStart(2, '0')}:{String(timer.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-slate-500">डेली लक्ष्य: 4 चक्र</span>
              </div>

              {/* टाइमर कंट्रोल */}
              <div className="flex gap-3 text-xs">
                <button 
                  onClick={() => setTimer(prev => ({ ...prev, isActive: !prev.isActive }))}
                  className={`px-6 py-2 rounded-full font-bold transition flex items-center gap-1.5 ${
                    timer.isActive ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {timer.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{timer.isActive ? 'रोकें' : 'शुरू करें'}</span>
                </button>

                <button 
                  onClick={() => setTimer({ minutes: timer.mode === 'Focus' ? 25 : 5, seconds: 0, isActive: false, mode: timer.mode })}
                  className="bg-slate-800 border border-slate-700 text-slate-300 px-5 py-2 rounded-full font-bold transition"
                >
                  रीसेट
                </button>
              </div>

            </div>
          )}

          {/* टैब 5: स्मार्ट सुझाव और नोटिफिकेशन्स (वापस एकीकृत किया गया!) */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/60">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                  <Bell className="w-4 h-4 text-indigo-400" />
                  स्मार्ट सुझाव केंद्र
                </h3>
                <p className="text-[11px] text-slate-400">
                  आपके वर्तमान अध्ययन पैटर्न, विषयों के समय आवंटन और सीखने की गति का विश्लेषण कर बनाए गए सुझाव।
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {notifications.length === 0 ? (
                  <p className="text-slate-500 italic text-center py-6">अभी कोई नया सुझाव उपलब्ध नहीं है।</p>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-4 rounded-xl border flex gap-3 transition ${
                        notif.type === 'urgent' 
                          ? 'bg-rose-950/20 border-rose-900/40 text-rose-300' 
                          : 'bg-indigo-950/25 border-indigo-900/40 text-indigo-300'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {notif.type === 'urgent' ? (
                          <AlertCircle className="w-5 h-5 text-rose-400" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-indigo-400" />
                        )}
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <h4 className="font-bold text-white text-xs">{notif.title}</h4>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{notif.text}</p>
                        
                        {notif.actionTopic && (
                          <button 
                            onClick={() => {
                              handleGenerateQuiz(notif.actionTopic);
                            }}
                            className="mt-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
                          >
                            <Brain className="w-3 h-3" />
                            <span>अभी अभ्यास टेस्ट लें</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* टैब 6: प्रोफाइल */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="text-center py-4 bg-slate-950 rounded-2xl border border-slate-800/60">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 border-2 border-indigo-500 flex items-center justify-center mx-auto mb-2">
                  <User className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-sm font-bold text-white">{user.name}</h3>
                <p className="text-[10px] text-slate-400">{user.category}</p>
                
                {/* अचीवमेंट बैज */}
                <div className="flex justify-center gap-2 mt-3">
                  <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] py-0.5 px-2 rounded-full font-bold flex items-center gap-0.5">
                    <Award className="w-3 h-3" /> निरंतरता चैंपियन
                  </span>
                  <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] py-0.5 px-2 rounded-full font-bold flex items-center gap-0.5">
                    <Brain className="w-3 h-3" /> AI विश्लेषक
                  </span>
                </div>
              </div>

              {/* सेटिंग्स बॉक्स */}
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/60 space-y-3 text-xs">
                <h4 className="text-[10px] font-bold text-indigo-400 uppercase">प्रोफाइल विन्यास (Configure Profile)</h4>
                
                <div>
                  <label className="block text-slate-400 mb-1">विद्यार्थी का नाम:</label>
                  <input 
                    type="text" 
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">दैनिक समय उपलब्धता (घंटे):</label>
                  <input 
                    type="number" 
                    value={user.availableHours}
                    onChange={(e) => setUser({ ...user, availableHours: parseInt(e.target.value) || 6 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-200"
                  />
                </div>
              </div>
            </div>
          )}

        </main>

        {/* मोबाइल बॉटम नेविगेशन बार (5-बटन संतुलित नेविगेशन) */}
        <nav className="absolute bottom-0 left-0 right-0 h-14 bg-slate-950 border-t border-slate-800 flex justify-around items-center px-1 z-20">
          
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition ${activeTab === 'dashboard' ? 'text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <BookOpen className="w-4.5 h-4.5" />
            <span className="text-[8px] mt-0.5">मेमोरी ट्रैक</span>
          </button>

          <button 
            onClick={() => setActiveTab('log')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition ${activeTab === 'log' ? 'text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <PlusCircle className="w-4.5 h-4.5" />
            <span className="text-[8px] mt-0.5">पढ़ाई दर्ज करें</span>
          </button>

          <button 
            onClick={() => setActiveTab('timer')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition ${activeTab === 'timer' ? 'text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Clock className="w-4.5 h-4.5" />
            <span className="text-[8px] mt-0.5">फोकस</span>
          </button>

          <button 
            onClick={() => setActiveTab('notifications')}
            className={`flex flex-col items-center justify-center flex-1 py-1 relative transition ${activeTab === 'notifications' ? 'text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Bell className="w-4.5 h-4.5" />
            {notifications.filter(n => n.type === 'urgent').length > 0 && (
              <span className="absolute top-1.5 right-4 bg-rose-500 w-2 h-2 rounded-full animate-ping"></span>
            )}
            <span className="text-[8px] mt-0.5">स्मार्ट सुझाव</span>
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition ${activeTab === 'profile' ? 'text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <User className="w-4.5 h-4.5" />
            <span className="text-[8px] mt-0.5">प्रोफाइल</span>
          </button>
          
        </nav>

      </div>

      <footer className="w-full max-w-md text-center py-2 text-[9px] text-slate-500">
        सजग छात्र v2.5 Ultimate - ऑल इन वन कंपेनियन
      </footer>

    </div>
  );
}

```
