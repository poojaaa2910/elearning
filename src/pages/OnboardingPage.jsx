import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useAdaptiveStore } from '../stores/useAdaptiveStore';
import { 
  CheckIcon, 
  EyeIcon, 
  BookOpenIcon, 
  AcademicCapIcon, 
  SwatchIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const applyUserSettings = useAdaptiveStore((state) => state.applyUserSettings);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    visionDifficulty: 'none',
    readingSpeed: 'medium',
    preferredLearning: 'text',
    colorBlindMode: false,
    cognitiveMode: false
  });

  useEffect(() => {
    if (user) {
      setFormData({
        visionDifficulty: user.visionDifficulty || 'none',
        readingSpeed: user.readingSpeed || 'medium',
        preferredLearning: user.preferredLearning || 'text',
        colorBlindMode: user.colorBlindMode ?? false,
        cognitiveMode: user.cognitiveMode ?? false
      });
    }
  }, [user]);

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { authService } = await import('../services/authService');
      await authService.updateUserProfile(user.uid, {
        ...formData,
        onboardingCompleted: true
      });
      
      useAuthStore.getState().updateUser({
        ...user,
        ...formData,
        onboardingCompleted: true
      });
      
      applyUserSettings(formData);
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepContent
            title="Vision"
            subtitle="This helps us adjust text size and contrast for better readability."
            icon={<EyeIcon className="w-6 h-6" />}
          >
            <div className="space-y-4">
              {[
                { value: 'none', label: 'No vision difficulties', icon: <EyeIcon className="w-6 h-6" />, desc: 'I have normal vision' },
                { value: 'mild', label: 'Mild vision difficulties', icon: <EyeIcon className="w-6 h-6" />, desc: 'Some difficulty seeing clearly' },
                { value: 'high', label: 'Significant vision difficulties', icon: <EyeIcon className="w-6 h-6" />, desc: 'Need larger text and high contrast' }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 group ${
                    formData.visionDifficulty === option.value
                      ? 'border-[#189D91] bg-[#189D91]/10 dark:bg-[#189D91]/20 shadow-lg shadow-[#189D91]/20 scale-[1.02]'
                      : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 hover:scale-[1.01]'
                  }`}
                >
                  <input
                    type="radio"
                    name="visionDifficulty"
                    value={option.value}
                    checked={formData.visionDifficulty === option.value}
                    onChange={(e) => updateField('visionDifficulty', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`mr-4 p-2 rounded-lg transition-colors ${
                    formData.visionDifficulty === option.value
                      ? 'bg-[#189D91] text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-slate-600'
                  }`}>
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900 dark:text-white block">{option.label}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-300">{option.desc}</span>
                  </div>
                  {formData.visionDifficulty === option.value && (
                    <CheckIcon className="w-6 h-6 text-[#189D91] flex-shrink-0" />
                  )}
                </label>
              ))}
            </div>
          </StepContent>
        );
      
      case 2:
        return (
          <StepContent
            title="Reading Speed"
            subtitle="This helps us provide content at a comfortable pace for you."
            icon={<BookOpenIcon className="w-6 h-6" />}
          >
            <div className="space-y-4">
              {[
                { value: 'slow', label: 'Slow', icon: <SparklesIcon className="w-6 h-6" />, desc: 'I prefer more time to read and process information' },
                { value: 'medium', label: 'Medium', icon: <BookOpenIcon className="w-6 h-6" />, desc: 'I read at a normal pace' },
                { value: 'fast', label: 'Fast', icon: <AcademicCapIcon className="w-6 h-6" />, desc: 'I read quickly and want more content' }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 group ${
                    formData.readingSpeed === option.value
                      ? 'border-[#189D91] bg-[#189D91]/10 dark:bg-[#189D91]/20 shadow-lg shadow-[#189D91]/20 scale-[1.02]'
                      : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 hover:scale-[1.01]'
                  }`}
                >
                  <input
                    type="radio"
                    name="readingSpeed"
                    value={option.value}
                    checked={formData.readingSpeed === option.value}
                    onChange={(e) => updateField('readingSpeed', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`mr-4 p-2 rounded-lg transition-colors ${
                    formData.readingSpeed === option.value
                      ? 'bg-[#189D91] text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-slate-600'
                  }`}>
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900 dark:text-white block">{option.label}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-300">{option.desc}</span>
                  </div>
                  {formData.readingSpeed === option.value && (
                    <CheckIcon className="w-6 h-6 text-[#189D91] flex-shrink-0" />
                  )}
                </label>
              ))}
            </div>
          </StepContent>
        );
      
      case 3:
        return (
          <StepContent
            title="Learning Preference"
            subtitle="This helps us prioritize content in your preferred format."
            icon={<AcademicCapIcon className="w-6 h-6" />}
          >
            <div className="space-y-4">
              {[
                { value: 'text', label: 'Text', icon: <BookOpenIcon className="w-6 h-6" />, desc: 'I prefer reading articles and documents' },
                { value: 'audio', label: 'Audio', icon: <AcademicCapIcon className="w-6 h-6" />, desc: 'I prefer listening to content' },
                { value: 'video', label: 'Video', icon: <AcademicCapIcon className="w-6 h-6" />, desc: 'I prefer watching videos' }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 group ${
                    formData.preferredLearning === option.value
                      ? 'border-[#189D91] bg-[#189D91]/10 dark:bg-[#189D91]/20 shadow-lg shadow-[#189D91]/20 scale-[1.02]'
                      : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 hover:scale-[1.01]'
                  }`}
                >
                  <input
                    type="radio"
                    name="preferredLearning"
                    value={option.value}
                    checked={formData.preferredLearning === option.value}
                    onChange={(e) => updateField('preferredLearning', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`mr-4 p-2 rounded-lg transition-colors ${
                    formData.preferredLearning === option.value
                      ? 'bg-[#189D91] text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-slate-600'
                  }`}>
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900 dark:text-white block">{option.label}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-300">{option.desc}</span>
                  </div>
                  {formData.preferredLearning === option.value && (
                    <CheckIcon className="w-6 h-6 text-[#189D91] flex-shrink-0" />
                  )}
                </label>
              ))}
            </div>
          </StepContent>
        );
      
      case 4:
        return (
          <StepContent
            title="Color Vision"
            subtitle="This helps us use colors that are easier to distinguish."
            icon={<SwatchIcon className="w-6 h-6" />}
          >
            <div className="space-y-4">
              <label
                className={`flex items-start p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 group ${
                  formData.colorBlindMode === false
                    ? 'border-[#189D91] bg-[#189D91]/10 dark:bg-[#189D91]/20 shadow-lg shadow-[#189D91]/20 scale-[1.02]'
                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 hover:scale-[1.01]'
                }`}
              >
                <input
                  type="radio"
                  name="colorBlindMode"
                  checked={formData.colorBlindMode === false}
                  onChange={() => updateField('colorBlindMode', false)}
                  className="sr-only"
                />
                <div className={`mr-4 p-2 rounded-lg transition-colors ${
                  formData.colorBlindMode === false
                    ? 'bg-[#189D91] text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-slate-600'
                }`}>
                  <CheckIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 dark:text-white block">No color vision difficulties</span>
                  <span className="text-sm text-gray-500 dark:text-gray-300">I can distinguish colors normally</span>
                </div>
                {formData.colorBlindMode === false && (
                  <CheckIcon className="w-6 h-6 text-[#189D91] flex-shrink-0" />
                )}
              </label>
              
              <label
                className={`flex items-start p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 group ${
                  formData.colorBlindMode === true
                    ? 'border-[#189D91] bg-[#189D91]/10 dark:bg-[#189D91]/20 shadow-lg shadow-[#189D91]/20 scale-[1.02]'
                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 hover:scale-[1.01]'
                }`}
              >
                <input
                  type="radio"
                  name="colorBlindMode"
                  checked={formData.colorBlindMode === true}
                  onChange={() => updateField('colorBlindMode', true)}
                  className="sr-only"
                />
                <div className={`mr-4 p-2 rounded-lg transition-colors ${
                  formData.colorBlindMode === true
                    ? 'bg-[#189D91] text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-slate-600'
                }`}>
                  <SwatchIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 dark:text-white block">Color vision difficulties</span>
                  <span className="text-sm text-gray-500 dark:text-gray-300">I have difficulty distinguishing certain colors</span>
                </div>
                {formData.colorBlindMode === true && (
                  <CheckIcon className="w-6 h-6 text-[#189D91] flex-shrink-0" />
                )}
              </label>
            </div>
          </StepContent>
        );
      
      case 5:
        return (
          <StepContent
            title="Content Simplification"
            subtitle="This helps us present information in a way that's easier to process."
            icon={<SparklesIcon className="w-6 h-6" />}
          >
            <div className="space-y-4">
              <label
                className={`flex items-start p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 group ${
                  formData.cognitiveMode === false
                    ? 'border-[#189D91] bg-[#189D91]/10 dark:bg-[#189D91]/20 shadow-lg shadow-[#189D91]/20 scale-[1.02]'
                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 hover:scale-[1.01]'
                }`}
              >
                <input
                  type="radio"
                  name="cognitiveMode"
                  checked={formData.cognitiveMode === false}
                  onChange={() => updateField('cognitiveMode', false)}
                  className="sr-only"
                />
                <div className={`mr-4 p-2 rounded-lg transition-colors ${
                  formData.cognitiveMode === false
                    ? 'bg-[#189D91] text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-slate-600'
                }`}>
                  <BookOpenIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 dark:text-white block">Standard content</span>
                  <span className="text-sm text-gray-500 dark:text-gray-300">I'm comfortable with regular content complexity</span>
                </div>
                {formData.cognitiveMode === false && (
                  <CheckIcon className="w-6 h-6 text-[#189D91] flex-shrink-0" />
                )}
              </label>
              
              <label
                className={`flex items-start p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 group ${
                  formData.cognitiveMode === true
                    ? 'border-[#189D91] bg-[#189D91]/10 dark:bg-[#189D91]/20 shadow-lg shadow-[#189D91]/20 scale-[1.02]'
                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 hover:scale-[1.01]'
                }`}
              >
                <input
                  type="radio"
                  name="cognitiveMode"
                  checked={formData.cognitiveMode === true}
                  onChange={() => updateField('cognitiveMode', true)}
                  className="sr-only"
                />
                <div className={`mr-4 p-2 rounded-lg transition-colors ${
                  formData.cognitiveMode === true
                    ? 'bg-[#189D91] text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-slate-600'
                }`}>
                  <SparklesIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 dark:text-white block">Simplified content</span>
                  <span className="text-sm text-gray-500 dark:text-gray-300">I prefer shorter, simpler explanations</span>
                </div>
                {formData.cognitiveMode === true && (
                  <CheckIcon className="w-6 h-6 text-[#189D91] flex-shrink-0" />
                )}
              </label>
            </div>
          </StepContent>
        );
      
      default:
        return null;
    }
  };

  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#537A5A] rounded-2xl shadow-lg mb-4">
            <SparklesIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to AdaptiveLearn!</h1>
          <p className="text-gray-600 dark:text-gray-300">Let's personalize your learning experience</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm font-medium text-[#537A5A]">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#537A5A] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {['Vision', 'Reading', 'Learning', 'Colors', 'Simplify'].map((step, idx) => (
              <span 
                key={step}
                className={`text-xs ${
                  idx + 1 <= currentStep 
                    ? 'text-[#189D91] font-medium' 
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-6">
          {renderStep()}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              currentStep === 1
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            ← Back
          </button>
          
          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-[#537A5A] text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-[#537A5A] text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Complete Setup ✓'}
            </button>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          All settings can be adjusted later in your profile
        </p>
      </div>
    </div>
  );
};

const StepContent = ({ title, subtitle, icon, children }) => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-[#189D91]/10 rounded-xl text-[#189D91]">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-300">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

export default OnboardingPage;
