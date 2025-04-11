import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { UserProgress } from '../types';
import { journalDays, weekIntros, weekEndMessages, getWeekNumber, isLastDayOfWeek, getFinalMessage } from '../data/journalContent';

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
  const weekNumber = getWeekNumber(currentDay);
  const weekIntro = weekNumber <= weekIntros.length ? weekIntros[weekNumber - 1] : null;

  const currentDayEntries = userProgress.journalEntries[currentDay] || {
    thinkAboutThisResponses: [],
    takeActionResponses: [],
    completed: false
  };

  if (!currentDayData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
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
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-8">
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
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white/80 backdrop-blur-sm rounded-lg p-4">
          <button
            onClick={() => setShowIntro(true)}
            className="text-indigo-600 hover:text-indigo-500"
          >
            ← Back to Introduction
          </button>
          <div className="flex space-x-4">
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
        </div>

        {currentDay === 1 || currentDay % 7 === 1 ? (
          weekIntro && (
            <div className="bg-white/95 backdrop-blur-sm shadow rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Week {weekNumber}: {weekIntro.theme}</h2>
              <div className="prose max-w-none">
                {weekIntro.introduction.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          )
        ) : null}

        <div className="bg-white/95 backdrop-blur-sm shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Day {currentDay}</h1>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-2">Scripture</h2>
              <p className="text-2xl font-medium text-gray-700 whitespace-pre-line">{currentDayData.scripture}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Let's Talk</h2>
              <div className="prose max-w-none">
                {currentDayData.letsTalk.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-6">Think About This</h2>
              <div className="space-y-10">
                {Array.isArray(currentDayData.thinkAboutThis) && currentDayData.thinkAboutThis.map((question, index) => (
                  <div key={index} className="mb-10">
                    <label className="block text-sm text-gray-700 mb-4 leading-snug w-fit max-w-full break-words">{question}</label>
                    <textarea
                      className="border rounded-md p-2 bg-white/90 w-full max-w-full"
                      rows={4}
                      onChange={(e) => handleResponseChange('thinkAboutThis', index, e.target.value)}
                      value=
                      
                      {currentDayEntries.thinkAboutThisResponses[index] || ''}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-6">Take Action</h2>
              <div className="space-y-10">
                {Array.isArray(currentDayData.takeAction) && currentDayData.takeAction.map((action, index) => (
                  <div key={index} className="mb-10">
                    <label className="block text-sm text-gray-700 mb-4 leading-snug w-fit max-w-full break-words">✅ {action}</label>
                    <textarea
                      className="border rounded-md p-2 bg-white/90 w-full max-w-full"
                      rows={4}
                      onChange={(e) => handleResponseChange('takeAction', index, e.target.value)}
                      value=
                      
                      {currentDayEntries.takeActionResponses[index] || ''}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Prayer</h2>
              <p className="text-xl italic font-medium text-gray-700">{currentDayData.prayer}</p>
            </div>
          </div>

          {isLastDayOfWeek(currentDay) && currentDay < journalDays.length && weekEndMessages[weekNumber] && (
            <div className="mt-8 p-6 bg-gray-50/90 backdrop-blur-sm rounded-lg">
              <div className="prose max-w-none">
                {weekEndMessages[weekNumber].split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {currentDay === journalDays.length && (
            <div className="mt-8 p-6 bg-gray-50/90 backdrop-blur-sm rounded-lg">
              <div className="prose max-w-none">
                {getFinalMessage().split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={markDayComplete}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={userProgress.journalEntries[currentDay]?.completed}
            >
              {userProgress.journalEntries[currentDay]?.completed 
                ? 'Day Completed'
                : 'Mark Day as Complete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
