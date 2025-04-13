import { useState, useEffect } from 'react';
import type { UserProgress } from '../types';
import { journalDays } from '../data/journalContent';

export default function Journal() {
  const [currentDay, setCurrentDay] = useState(1);
  const [showIntro, setShowIntro] = useState(true);
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('journalProgress');
    return saved ? JSON.parse(saved) : {
      currentDay: 1,
      journalEntries: {}
    };
  });

  useEffect(() => {
    localStorage.setItem('journalProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  const handleResponseChange = (type: 'thinkAboutThis' | 'takeAction', index: number, value: string) => {
    setUserProgress(prev => {
      const dayEntries = prev.journalEntries[currentDay] || {
        thinkAboutThisResponses: [],
        takeActionResponses: [],
        completed: false
      };

      const updatedEntries = {
        ...dayEntries,
        [`${type}Responses`]: [...dayEntries[`${type}Responses`]]
      };
      updatedEntries[`${type}Responses`][index] = value;

      return {
        ...prev,
        journalEntries: {
          ...prev.journalEntries,
          [currentDay]: updatedEntries
        }
      };
    });
  };

  const handleCheckboxChange = (index: number, checked: boolean) => {
    setUserProgress(prev => {
      const dayEntries = prev.journalEntries[currentDay] || {
        thinkAboutThisResponses: [],
        takeActionResponses: [],
        completed: false
      };

      const updatedEntries = {
        ...dayEntries,
        completedActions: {
          ...dayEntries.completedActions,
          [index]: checked
        }
      };

      return {
        ...prev,
        journalEntries: {
          ...prev.journalEntries,
          [currentDay]: updatedEntries
        }
      };
    });
  };

  const markDayComplete = () => {
    setUserProgress(prev => ({
      ...prev,
      currentDay: Math.max(prev.currentDay, currentDay + 1),
      journalEntries: {
        ...prev.journalEntries,
        [currentDay]: {
          ...prev.journalEntries[currentDay],
          completed: true
        }
      }
    }));
  };

  const handleNextDay = () => {
    if (currentDay < journalDays.length) {
      setCurrentDay(day => day + 1);
    }
  };

  const handlePreviousDay = () => {
    if (currentDay > 1) {
      setCurrentDay(day => day - 1);
    }
  };

  const currentDayData = currentDay <= journalDays.length ? journalDays[currentDay - 1] : null;

  const currentDayEntries = userProgress.journalEntries[currentDay] || {
    thinkAboutThisResponses: [],
    takeActionResponses: [],
    completed: false,
    completedActions: {}
  };

  if (!currentDayData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full px-4 mx-auto">
          <div className="bg-white shadow rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-6">Error</h1>
            <p>Journal content for day {currentDay} is not available.</p>
            <button
              onClick={() => setCurrentDay(1)}
              className="mt-4 px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Return to Day 1
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full px-4 mx-auto bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-4">Welcome to the 30-Day Vision Journal</h1>
          <p className="mb-4">This journal is your guide to discovering and walking in God's vision for your life.</p>
          <p className="mb-4">Each day includes scripture, reflection prompts, action steps, and prayer. Take your time. Reflect. Be honest. Grow.</p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">How to Use This Journal</h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Start each day by reading the scripture and "Let's Talk" section.</li>
            <li>Spend time thinking deeply and answering the "Think About This" questions.</li>
            <li>Take a step of faith with the "Take Action" activity for the day.</li>
            <li>Finish your journaling time with the closing prayer.</li>
            <li>Click "Mark Day as Complete" to save your progress and unlock the next day.</li>
          </ul>
          <p className="mb-4">Don't rush the process. Go at your pace and invite God into every moment.</p>
          <button
            onClick={() => setShowIntro(false)}
            className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow hover:bg-indigo-700"
          >
            Start Journal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full px-4 mx-auto">
        <button
          onClick={() => setShowIntro(true)}
          className="text-indigo-600 hover:text-indigo-500 mb-6"
        >
          ← Back to Introduction
        </button>
        <h1 className="text-3xl font-bold mb-6">Day {currentDay}</h1>
        {currentDayData && (
          <>
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={handlePreviousDay}
                className="px-4 py-2 border rounded-md hover:bg-gray-50 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentDay === 1}
              >
                Previous Day
              </button>
              <button
                onClick={handleNextDay}
                className="px-4 py-2 border rounded-md hover:bg-gray-50 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentDay === journalDays.length}
              >
                Next Day
              </button>
            </div>

            <div className="mb-10">
              <h2 className="text-xl font-semibold">Scripture</h2>
              <p className="text-lg whitespace-pre-line mt-4">{currentDayData.scripture}</p>
            </div>

            <div className="mb-10">
              <h2 className="text-xl font-semibold">Let's Talk</h2>
              <div className="prose mt-4">
                {currentDayData.letsTalk.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-xl font-semibold">Think About This</h2>
              {currentDayData.thinkAboutThis.map((question, index) => (
                <div key={index} className="mt-10">
                  <div className="block text-gray-700 text-sm mb-6">{question}</div>
                  <textarea
                    className="border rounded-md p-4 bg-white/90 mt-4 resize"
                    style={{ width: '100%' }}
                    rows={4}
                    onChange={(e) => handleResponseChange('thinkAboutThis', index, e.target.value)}
                    value={currentDayEntries.thinkAboutThisResponses[index] || ''}
                  />
                </div>
              ))}
            </div>

            <div className="mb-10">
              <h2 className="text-xl font-semibold">Take Action</h2>
              {currentDayData.takeAction.map((action, index) => (
                <div key={index} className="mt-10">
                  <div className="flex items-center mb-6">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={!!currentDayEntries.completedActions?.[index]}
                      onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                    />
                    <span className="text-sm text-gray-700">{action}</span>
                  </div>
                  <textarea
                    className="border rounded-md p-4 bg-white/90 mt-4 resize"
                    style={{ width: '100%' }}
                    rows={4}
                    onChange={(e) => handleResponseChange('takeAction', index, e.target.value)}
                    value={currentDayEntries.takeActionResponses[index] || ''}
                  />
                </div>
              ))}
            </div>

            <div className="mb-10">
              <h2 className="text-xl font-semibold">Prayer</h2>
              <p className="text-lg italic text-gray-700 mt-4">{currentDayData.prayer}</p>
            </div>

            <button
              onClick={markDayComplete}
              className="mt-6 w-full bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={userProgress.journalEntries[currentDay]?.completed}
            >
              {userProgress.journalEntries[currentDay]?.completed
                ? 'Day Completed'
                : 'Mark Day as Complete'}
            </button>

            <div className="flex justify-between items-center mt-10">
              <button
                onClick={handlePreviousDay}
                className="px-4 py-2 border rounded-md hover:bg-gray-50 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentDay === 1}
              >
                Previous Day
              </button>
              <button
                onClick={handleNextDay}
                className="px-4 py-2 border rounded-md hover:bg-gray-50 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentDay === journalDays.length}
              >
                Next Day
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
