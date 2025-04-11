import { Link } from 'react-router-dom';

export default function Introduction() {
  return (
    <div className="min-h-screen bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
          30-Day Vision Builders Journal
        </h1>
        
        <div className="bg-white shadow rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Dear Vision Builder,</h2>
          <p className="mb-4">
            You are not here by accident. You may not have all the answers right now, 
            and maybe you're struggling to figure out what your life is supposed to look like. 
            I get it—life can be confusing. But hear me when I say this:
          </p>
          <p className="text-xl font-semibold mb-4 text-center">
            God has a vision for you.
          </p>
          <p className="mb-4">
            You were made for something greater than just getting through each day. 
            You have purpose, you have a calling, and there is a reason for everything 
            you are experiencing right now. But here's the truth: You won't discover it by accident.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">How to Use This Journal:</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Start each day with scripture. Let God's Word guide your steps.</li>
            <li>Answer the reflection questions. Be honest, be real—this is for YOU.</li>
            <li>Take the action steps. Faith requires movement.</li>
            <li>Pray. God is with you in every step.</li>
          </ul>
          <p className="mt-4">
            You don't have to figure everything out at once. Just commit to showing up, 
            day by day, trusting that God will lead you where you're meant to go.
          </p>
        </div>

        <div className="text-center">
          <Link
            to="/journal"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-indigo-700 transition-colors"
          >
            Start Your Journey
          </Link>
        </div>
      </div>
    </div>
  );
}