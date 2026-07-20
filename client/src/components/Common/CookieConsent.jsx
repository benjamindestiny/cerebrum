import React, { useState, useEffect } from 'react';
import { Cookie, X, Settings, CheckCircle } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const acceptAll = () => {
    setPreferences({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    });
    saveConsent({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    });
    setIsVisible(false);
  };

  const acceptNecessary = () => {
    saveConsent({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
    setIsVisible(false);
  };

  const saveConsent = (prefs) => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      ...prefs,
      timestamp: new Date().toISOString(),
    }));
    // You could also send this to your analytics service
  };

  const savePreferences = () => {
    saveConsent(preferences);
    setIsVisible(false);
    setShowSettings(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {isVisible && (
        <div
          
          
          
          
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6  text-white border-[#2A2A4A]"
        >
          <div className="max-w-5xl mx-auto glass-card p-4 md:p-6 border border-white/10 shadow-2xl shadow-blue-500/10  text-white border-[#2A2A4A]">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4  text-white border-[#2A2A4A]">
              {/* Icon */}
              <div className="flex-shrink-0  text-white border-[#2A2A4A]">
                <div className="p-2  rounded-full  text-white border-[#2A2A4A]">
                  <Cookie className="w-6 h-6 text-[#2A1535]  text-white border-[#2A2A4A]" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0  text-white border-[#2A2A4A]">
                <h3 className="text-white font-semibold text-sm md:text-base  text-white border-[#2A2A4A]">
                  🍪 We Value Your Privacy
                </h3>
                <p className="text-gray-400 text-xs md:text-sm mt-1  text-white border-[#2A2A4A]">
                  We use cookies to enhance your experience, analyze site traffic, and serve personalized content. 
                  By clicking "Accept All", you consent to our use of cookies.
                </p>
                <div className="flex flex-wrap gap-3 mt-2  text-white border-[#2A2A4A]">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-xs text-[#2A1535] hover:text-[#8B5CF6] transition-colors flex items-center gap-1  text-white border-[#2A2A4A]"
                  >
                    <Settings className="w-3 h-3  text-white border-[#2A2A4A]" />
                    {showSettings ? 'Hide Settings' : 'Customize Settings'}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 flex-shrink-0  text-white border-[#2A2A4A]">
                <button
                  
                  
                  onClick={acceptNecessary}
                  className="px-4 py-2 text-xs font-medium text-gray-400  border border-white/10 rounded-lg transition-colors  text-white border-[#2A2A4A]"
                >
                  Decline
                </button>
                <button
                  
                  
                  onClick={acceptAll}
                  className="px-5 py-2 text-xs font-medium bg-blue-500 text-white rounded-lg  transition-colors shadow-lg shadow-blue-500/30  text-white border-[#2A2A4A]"
                >
                  Accept All
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-2 text-gray-500  transition-colors  text-white border-[#2A2A4A]"
                  aria-label="Close"
                >
                  <X className="w-4 h-4  text-white border-[#2A2A4A]" />
                </button>
              </div>
            </div>

            {/* Settings Panel */}
            <>
              {showSettings && (
                <div
                  
                  
                  
                  
                  className="mt-4 pt-4 border-t border-white/10  text-white border-[#2A2A4A]"
                >
                  <div className="space-y-3  text-white border-[#2A2A4A]">
                    <div className="flex items-center justify-between  text-white border-[#2A2A4A]">
                      <div>
                        <div className="text-white text-sm font-medium  text-white border-[#2A2A4A]">Necessary Cookies</div>
                        <div className="text-gray-500 text-xs  text-white border-[#2A2A4A]">Required for the website to function</div>
                      </div>
                      <div className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded  text-white border-[#2A2A4A]">Always Active</div>
                    </div>
                    <div className="flex items-center justify-between  text-white border-[#2A2A4A]">
                      <div>
                        <div className="text-white text-sm font-medium  text-white border-[#2A2A4A]">Functional Cookies</div>
                        <div className="text-gray-500 text-xs  text-white border-[#2A2A4A]">Remember your preferences</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer  text-white border-[#2A2A4A]">
                        <input
                          type="checkbox"
                          checked={preferences.functional}
                          onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                          className="sr-only peer  text-white border-[#2A2A4A]"
                        />
                        <div className="w-9 h-5 bg-gray-600 peer-focus:ring-2 peer-focus:ring-[#3B82F6] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500  text-white border-[#2A2A4A]"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between  text-white border-[#2A2A4A]">
                      <div>
                        <div className="text-white text-sm font-medium  text-white border-[#2A2A4A]">Analytics Cookies</div>
                        <div className="text-gray-500 text-xs  text-white border-[#2A2A4A]">Help us improve our platform</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer  text-white border-[#2A2A4A]">
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                          className="sr-only peer  text-white border-[#2A2A4A]"
                        />
                        <div className="w-9 h-5 bg-gray-600 peer-focus:ring-2 peer-focus:ring-[#3B82F6] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500  text-white border-[#2A2A4A]"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between  text-white border-[#2A2A4A]">
                      <div>
                        <div className="text-white text-sm font-medium  text-white border-[#2A2A4A]">Marketing Cookies</div>
                        <div className="text-gray-500 text-xs  text-white border-[#2A2A4A]">Deliver targeted content</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer  text-white border-[#2A2A4A]">
                        <input
                          type="checkbox"
                          checked={preferences.marketing}
                          onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                          className="sr-only peer  text-white border-[#2A2A4A]"
                        />
                        <div className="w-9 h-5 bg-gray-600 peer-focus:ring-2 peer-focus:ring-[#3B82F6] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500  text-white border-[#2A2A4A]"></div>
                      </label>
                    </div>
                    <div className="flex justify-end pt-3  text-white border-[#2A2A4A]">
                      <button
                        
                        
                        onClick={savePreferences}
                        className="px-5 py-2 text-xs font-medium bg-blue-500 text-white rounded-lg  transition-colors flex items-center gap-2  text-white border-[#2A2A4A]"
                      >
                        <CheckCircle className="w-4 h-4  text-white border-[#2A2A4A]" />
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>

            {/* Learn More Link */}
            <div className="mt-3 text-center  text-white border-[#2A2A4A]">
              <a href="/privacy" className="text-xs text-gray-500 hover:text-gray-400 transition-colors  text-white border-[#2A2A4A]">
                Learn more about our Privacy Policy
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
