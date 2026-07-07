import React from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  const { user } = useAuth();

  const content = (
    <div className="max-w-4xl mx-auto p-8 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-300 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
          <p className="text-xs text-slate-500 mt-1">Last Updated: July 2026</p>
        </div>
        {!user && (
          <Link to="/login" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all">
            Back to Login
          </Link>
        )}
      </div>

      <p className="text-sm leading-relaxed">
        At PrepBoat AI, accessible from <span className="text-indigo-400">prepboat-ai.vercel.app</span>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by PrepBoat AI and how we use it.
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">1. Information We Collect</h2>
        <p className="text-sm leading-relaxed text-slate-400">
          The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
        </p>
        <ul className="list-disc pl-5 text-sm space-y-2 text-slate-450">
          <li><strong>Account Details:</strong> When you register for an Account, we may ask for your contact information, including items such as name, email address, college, branch, and cgpa.</li>
          <li><strong>Practice and Submission History:</strong> We store your answers, solving histories, and time spent on aptitude and coding questions to track progress metrics.</li>
          <li><strong>Resume Builder Data:</strong> Any information inputted into the AI Resume Builder is used temporarily to compile and optimize your resume.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">2. How We Use Your Information</h2>
        <p className="text-sm leading-relaxed text-slate-400">
          We use the information we collect in various ways, including to:
        </p>
        <ul className="list-disc pl-5 text-sm space-y-1 text-slate-450">
          <li>Provide, operate, and maintain our website dashboard</li>
          <li>Improve, personalize, and expand our coding exercises</li>
          <li>Understand and analyze how you use our platform</li>
          <li>Communicate with you for security, authentication, and password resets</li>
          <li>Deliver resume optimization insights using secure LLM models</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">3. Google DoubleClick DART Cookie</h2>
        <p className="text-sm leading-relaxed text-slate-400">
          Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. Visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">4. Advertising Partners Privacy Policies</h2>
        <p className="text-sm leading-relaxed text-slate-400">
          Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on PrepBoat AI, which are sent directly to users' browsers. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">5. Security</h2>
        <p className="text-sm leading-relaxed text-slate-400">
          We use industry-standard security measures, including bcrypt hashing for passwords and JWT encryption for API token routing, to protect user accounts and prevent unauthorized access.
        </p>
      </section>
    </div>
  );

  if (user) {
    return <Layout>{content}</Layout>;
  }

  return (
    <div className="min-h-screen bg-[#020617] p-8 flex flex-col justify-between items-center">
      <div className="w-full flex-grow flex items-center justify-center py-8">
        {content}
      </div>
      <div className="text-xs text-slate-600 mt-4 pb-4">
        &copy; {new Date().getFullYear()} PrepBoat AI. All rights reserved.
      </div>
    </div>
  );
};

export default PrivacyPolicy;
