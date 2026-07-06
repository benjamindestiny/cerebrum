import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-5xl mx-auto glass-card p-4 md:p-6 border border-white/10 shadow-2xl shadow-[#6C2BD9]/10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="p-2 bg-[#6C2BD9]/20 rounded-full">
                  <Cookie className="w-6 h-6 text-[#6C2BD9]" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm md:text-base">
                  🍪 We Value Your Privacy
                </h3>
                <p className="text-gray-400 text-xs md:text-sm mt-1">
                  We use cookies to enhance your experience, analyze site traffic, and serve personalized content. 
                  By clicking "Accept All", you consent to our use of cookies.
                </p>
                <div className="flex flex-wrap gap-3 mt-2">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-xs text-[#6C2BD9] hover:text-[#8B5CF6] transition-colors flex items-center gap-1"
                  >
                    <Settings className="w-3 h-3" />
                    {showSettings ? 'Hide Settings' : 'Customize Settings'}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={acceptNecessary}
                  className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white border border-white/10 rounded-lg transition-colors"
                >
                  Decline
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={acceptAll}
                  className="px-5 py-2 text-xs font-medium bg-[#6C2BD9] text-white rounded-lg hover:bg-[#5A1BB8] transition-colors shadow-lg shadow-[#6C2BD9]/30"
                >
                  Accept All
                </motion.button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-2 text-gray-500 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-white/10"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white text-sm font-medium">Necessary Cookies</div>
                        <div className="text-gray-500 text-xs">Required for the website to function</div>
                      </div>
                      <div className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">Always Active</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white text-sm font-medium">Functional Cookies</div>
                        <div className="text-gray-500 text-xs">Remember your preferences</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.functional}
                          onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-600 peer-focus:ring-2 peer-focus:ring-[#6C2BD9] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6C2BD9]"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white text-sm font-medium">Analytics Cookies</div>
                        <div className="text-gray-500 text-xs">Help us improve our platform</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-600 peer-focus:ring-2 peer-focus:ring-[#6C2BD9] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6C2BD9]"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white text-sm font-medium">Marketing Cookies</div>
                        <div className="text-gray-500 text-xs">Deliver targeted content</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.marketing}
                          onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-600 peer-focus:ring-2 peer-focus:ring-[#6C2BD9] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6C2BD9]"></div>
                      </label>
                    </div>
                    <div className="flex justify-end pt-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={savePreferences}
                        className="px-5 py-2 text-xs font-medium bg-[#6C2BD9] text-white rounded-lg hover:bg-[#5A1BB8] transition-colors flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Save Preferences
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Learn More Link */}
            <div className="mt-3 text-center">
              <a href="/privacy" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
                Learn more about our Privacy Policy
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
