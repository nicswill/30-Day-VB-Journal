import { useState, useEffect } from 'react';
import type { UserProgress } from '../types';
import { journalDays, weekIntros, weekEndMessages, getWeekNumber, isLastDayOfWeek, getFinalMessage } from '../data/journalContent';
import coverImg from '../assets/cover.jpg';

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
        completed: false,
        completedActions: {}
      };

      const updatedResponses = [...(dayEntries[`${type}Responses`] || [])];
      updatedResponses[index] = value;

      return {
        ...prev,
        journalEntries: {
          ...prev.journalEntries,
          [currentDay]: {
            ...dayEntries,
            [`${type}Responses`]: updatedResponses
          }
        }
      };
    });
  };

  const handleCheckboxChange = (index: number, checked: boolean) => {
    setUserProgress(prev => {
      const dayEntries = prev.journalEntries[currentDay] || {
        thinkAboutThisResponses: [],
        takeActionResponses: [],
        completed: false,
        completedActions: {}
      };

      const updatedCompletedActions = {
        ...dayEntries.completedActions,
        [index]: checked
      };

      return {
        ...prev,
        journalEntries: {
          ...prev.journalEntries,
          [currentDay]: {
            ...dayEntries,
            completedActions: updatedCompletedActions
          }
        }
      };
    });
  };

  const markDayComplete = () => {
    const { thinkAboutThisResponses = [], takeActionResponses = [] } = userProgress.journalEntries[currentDay] || {};
    const hasResponse = thinkAboutThisResponses.some(r => r.trim() !== '') || takeActionResponses.some(r => r.trim() !== '');
    if (!hasResponse) {
      alert('Please answer at least one prompt before marking the day as complete.');
      return;
    }

    setUserProgress(prev => {
      const currentEntries = prev.journalEntries[currentDay] || {
        thinkAboutThisResponses: [],
        takeActionResponses: [],
        completed: false,
        completedActions: {}
      };

      return {
        ...prev,
        currentDay: Math.max(prev.currentDay, currentDay + 1),
        journalEntries: {
          ...prev.journalEntries,
          [currentDay]: {
            ...currentEntries,
            completed: true
          }
        }
      };
    });
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
          <img
            src={coverImg}
            alt="Journal Cover"
            className="w-full mb-8 rounded-lg shadow"
          />
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
            className="mt-6 px-8 py-6 bg-indigo-700 text-white text-xl font-bold rounded-xl shadow hover:bg-indigo-800"
          >
            Start Journal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full px-4 mx-auto max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-8">Day {currentDay}</h1>

          {(currentDay === 1 || currentDay % 7 === 1) && weekIntro && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Week {weekNumber}: {weekIntro.theme}</h2>
              <p className="text-gray-700 whitespace-pre-line">{weekIntro.introduction}</p>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Scripture</h2>
            <p className="text-lg text-gray-700 whitespace-pre-line">{currentDayData.scripture}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Let's Talk</h2>
            <div className="text-gray-800 space-y-3">
              {currentDayData.letsTalk.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Think About This</h2>
            {currentDayData.thinkAboutThis.map((question, index) => (
              <div key={index} className="mb-12">
                <label className="block text-sm font-medium text-gray-700 mb-4">{question}</label>
                <textarea
                  className="w-full border rounded-md p-4"
                  rows={4}
                  value={currentDayEntries.thinkAboutThisResponses[index] || ''}
                  onChange={(e) => handleResponseChange('thinkAboutThis', index, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Take Action</h2>
            {currentDayData.takeAction.map((task, index) => (
              <div key={index} className="mb-12">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={currentDayEntries.completedActions[index] || false}
                    onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                  />
                  {task}
                </label>
                <textarea
                  className="w-full border rounded-md p-4"
                  rows={3}
                  value={currentDayEntries.takeActionResponses[index] || ''}
                  onChange={(e) => handleResponseChange('takeAction', index, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-2">Prayer</h2>
            <p className="italic text-gray-700">{currentDayData.prayer}</p>
          </div>

          {(currentDay % 7 === 0 && weekEndMessages[weekNumber]) && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-2">End of Week Reflection</h2>
              <p className="text-gray-700 whitespace-pre-line">{weekEndMessages[weekNumber]}</p>
            </div>
          )}

          {currentDay === journalDays.length && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-2">Final Encouragement</h2>
              <p className="text-gray-700 whitespace-pre-line">{getFinalMessage()}</p>
            </div>
          )}

          <div className="flex flex-wrap justify-between items-center mt-10 gap-4">
            <button
              onClick={handlePreviousDay}
              className="px-8 py-5 text-lg bg-gray-200 text-gray-700 font-semibold rounded hover:bg-gray-300 disabled:opacity-50"
              disabled={currentDay === 1}
            >
              ← Previous Day
            </button>

            <button
              onClick={markDayComplete}
              className="px-8 py-5 text-lg bg-green-600 text-white font-bold rounded hover:bg-green-700"
              disabled={userProgress.journalEntries[currentDay]?.completed}
            >
              {userProgress.journalEntries[currentDay]?.completed ? 'Day Completed' : 'Mark Day as Complete'}
            </button>

            <button
              onClick={handleNextDay}
              className="px-8 py-5 text-lg bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 disabled:opacity-50"
              disabled={currentDay === journalDays.length}
            >
              Next Day →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
