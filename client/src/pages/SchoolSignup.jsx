import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  School, Mail, Lock, User, Building2, 
  BookOpen, Users, Award, ArrowLeft,
  CheckCircle, AlertCircle, Loader2,
  Globe, Phone, MapPin, Calendar
} from 'lucide-react';
import { toast } from 'react-toastify';

const SchoolSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // School Details
    schoolName: '',
    schoolType: '', // primary, secondary, high, university, college
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    phone: '',
    website: '',
    
    // Admin Account
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: '',
    adminRole: '',
    
    // School Stats
    studentCount: '',
    teacherCount: '',
    gradeLevels: [],
    
    // Preferences
    subscriptionPlan: 'basic', // basic, premium, enterprise
    features: [],
  });

  const [errors, setErrors] = useState({});

  const schoolTypes = [
    { value: 'primary', label: 'Primary School' },
    { value: 'secondary', label: 'Secondary School' },
    { value: 'high', label: 'High School' },
    { value: 'college', label: 'College' },
    { value: 'university', label: 'University' },
  ];

  const gradeLevels = [
    'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
    'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
    'Grade 11', 'Grade 12', 'Freshman', 'Sophomore', 'Junior', 'Senior',
    'Graduate', 'Postgraduate'
  ];

  const plans = [
    { 
      id: 'basic', 
      name: 'Basic',
      price: 'Free',
      features: ['100 questions/month', '5 teachers', 'Basic analytics'],
      color: 'border-gray-500'
    },
    { 
      id: 'premium', 
      name: 'Premium',
      price: '$29/mo',
      features: ['500 questions/month', '20 teachers', 'Advanced analytics', 'Custom quizzes'],
      color: 'border-blue-500',
      popular: true
    },
    { 
      id: 'enterprise', 
      name: 'Enterprise',
      price: 'Custom',
      features: ['Unlimited questions', 'Unlimited teachers', 'Full analytics', 'Custom branding', 'API access'],
      color: 'border-teal-400'
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      gradeLevels: checked 
        ? [...prev.gradeLevels, value]
        : prev.gradeLevels.filter(g => g !== value)
    }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.schoolName) newErrors.schoolName = 'School name is required';
    if (!formData.schoolType) newErrors.schoolType = 'School type is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.country) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.adminName) newErrors.adminName = 'Admin name is required';
    if (!formData.adminEmail) {
      newErrors.adminEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) {
      newErrors.adminEmail = 'Email is invalid';
    }
    if (!formData.adminPassword) {
      newErrors.adminPassword = 'Password is required';
    } else if (formData.adminPassword.length < 6) {
      newErrors.adminPassword = 'Password must be at least 6 characters';
    }
    if (formData.adminPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    
    if (step < 3) {
      setStep(prev => prev + 1);
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // toast.'🎉 School account created successfully!');
      navigate('/dashboard');
    }, 2000);
  };

  const renderStep1 = () => {
    return (
      <div className="space-y-4  text-white border-[#2A2A4A]">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1  text-white border-[#2A2A4A]">
            School Name <span className="text-red-400  text-white border-[#2A2A4A]">*</span>
          </label>
          <div className="relative  text-white border-[#2A2A4A]">
            <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-500  text-white border-[#2A2A4A]" />
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              placeholder="Enter school name"
              className={`w-full pl-10 pr-4 py-3 bg-[#262626] rounded-lg border ${
                errors.schoolName ? 'border-red-500' : 'border-white/10'
              } text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none`}
            />
          </div>
          {errors.schoolName && (
            <p className="text-red-400 text-xs mt-1  text-white border-[#2A2A4A]">{errors.schoolName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1  text-white border-[#2A2A4A]">
            School Type <span className="text-red-400  text-white border-[#2A2A4A]">*</span>
          </label>
          <select
            name="schoolType"
            value={formData.schoolType}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#262626] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none  text-white border-[#2A2A4A]"
          >
            <option value="">Select school type</option>
            {schoolTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          {errors.schoolType && (
            <p className="text-red-400 text-xs mt-1  text-white border-[#2A2A4A]">{errors.schoolType}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4  text-white border-[#2A2A4A]">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1  text-white border-[#2A2A4A]">
              City <span className="text-red-400  text-white border-[#2A2A4A]">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className={`w-full px-4 py-3 bg-[#262626] rounded-lg border ${
                errors.city ? 'border-red-500' : 'border-white/10'
              } text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1  text-white border-[#2A2A4A]">
              State <span className="text-red-400  text-white border-[#2A2A4A]">*</span>
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              className={`w-full px-4 py-3 bg-[#262626] rounded-lg border ${
                errors.state ? 'border-red-500' : 'border-white/10'
              } text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1  text-white border-[#2A2A4A]">
            Country <span className="text-red-400  text-white border-[#2A2A4A]">*</span>
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            className={`w-full px-4 py-3 bg-[#262626] rounded-lg border ${
              errors.country ? 'border-red-500' : 'border-white/10'
            } text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none`}
          />
          {errors.country && (
            <p className="text-red-400 text-xs mt-1  text-white border-[#2A2A4A]">{errors.country}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4  text-white border-[#2A2A4A]">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1  text-white border-[#2A2A4A]">
              Phone Number
            </label>
            <div className="relative  text-white border-[#2A2A4A]">
              <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-500  text-white border-[#2A2A4A]" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full pl-10 pr-4 py-3 bg-[#262626] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none  text-white border-[#2A2A4A]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1  text-white border-[#2A2A4A]">
              Website
            </label>
            <div className="relative  text-white border-[#2A2A4A]">
              <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-500  text-white border-[#2A2A4A]" />
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="School website"
                className="w-full pl-10 pr-4 py-3 bg-[#262626] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none  text-white border-[#2A2A4A]"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep2 = () => {
    return (
      <div className="space-y-4  text-white border-[#2A2A4A]">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1  text-white border-[#2A2A4A]">
            Admin Name <span className="text-red-400  text-white border-[#2A2A4A]">*</span>
          </label>
          <div className="relative  text-white border-[#2A2A4A]">
            <User className="absolute left-3 top-3 w-5 h-5 text-gray-500  text-white border-[#2A2A4A]" />
            <input
              type="text"
              name="adminName"
              value={formData.adminName}
              onChange={handleChange}
              placeholder="Full name"
              className={`w-full pl-10 pr-4 py-3 bg-[#262626] rounded-lg border ${
                errors.adminName ? 'border-red-500' : 'border-white/10'
              } text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none`}
            />
          </div>
          {errors.adminName && (
            <p className="text-red-400 text-xs mt-1  text-white border-[#2A2A4A]">{errors.adminName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1  text-white border-[#2A2A4A]">
            Admin Email <span className="text-red-400  text-white border-[#2A2A4A]">*</span>
          </label>
          <div className="relative  text-white border-[#2A2A4A]">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500  text-white border-[#2A2A4A]" />
            <input
              type="email"
              name="adminEmail"
              value={formData.adminEmail}
              onChange={handleChange}
              placeholder="Email address"
              className={`w-full pl-10 pr-4 py-3 bg-[#262626] rounded-lg border ${
                errors.adminEmail ? 'border-red-500' : 'border-white/10'
              } text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none`}
            />
          </div>
          {errors.adminEmail && (
            <p className="text-red-400 text-xs mt-1  text-white border-[#2A2A4A]">{errors.adminEmail}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1  text-white border-[#2A2A4A]">
            Password <span className="text-red-400  text-white border-[#2A2A4A]">*</span>
          </label>
          <div className="relative  text-white border-[#2A2A4A]">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500  text-white border-[#2A2A4A]" />
            <input
              type="password"
              name="adminPassword"
              value={formData.adminPassword}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              className={`w-full pl-10 pr-4 py-3 bg-[#262626] rounded-lg border ${
                errors.adminPassword ? 'border-red-500' : 'border-white/10'
              } text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none`}
            />
          </div>
          {errors.adminPassword && (
            <p className="text-red-400 text-xs mt-1  text-white border-[#2A2A4A]">{errors.adminPassword}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1  text-white border-[#2A2A4A]">
            Confirm Password <span className="text-red-400  text-white border-[#2A2A4A]">*</span>
          </label>
          <div className="relative  text-white border-[#2A2A4A]">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500  text-white border-[#2A2A4A]" />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className={`w-full pl-10 pr-4 py-3 bg-[#262626] rounded-lg border ${
                errors.confirmPassword ? 'border-red-500' : 'border-white/10'
              } text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1  text-white border-[#2A2A4A]">{errors.confirmPassword}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1  text-white border-[#2A2A4A]">
            Admin Role
          </label>
          <select
            name="adminRole"
            value={formData.adminRole}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#262626] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none  text-white border-[#2A2A4A]"
          >
            <option value="">Select role</option>
            <option value="principal">Principal</option>
            <option value="vice-principal">Vice Principal</option>
            <option value="administrator">Administrator</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    return (
      <div className="space-y-6  text-white border-[#2A2A4A]">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-3  text-white border-[#2A2A4A]">
            Grade Levels Offered
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto  text-white border-[#2A2A4A]">
            {gradeLevels.map(grade => (
              <label key={grade} className="flex items-center gap-2 p-2 rounded-lg /5 cursor-pointer  text-white border-[#2A2A4A]">
                <input
                  type="checkbox"
                  value={grade}
                  checked={formData.gradeLevels.includes(grade)}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 accent-[#3B82F6]  text-white border-[#2A2A4A]"
                />
                <span className="text-sm text-gray-300  text-white border-[#2A2A4A]">{grade}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4  text-white border-[#2A2A4A]">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1  text-white border-[#2A2A4A]">
              Number of Students
            </label>
            <input
              type="number"
              name="studentCount"
              value={formData.studentCount}
              onChange={handleChange}
              placeholder="e.g., 500"
              className="w-full px-4 py-3 bg-[#262626] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none  text-white border-[#2A2A4A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1  text-white border-[#2A2A4A]">
              Number of Teachers
            </label>
            <input
              type="number"
              name="teacherCount"
              value={formData.teacherCount}
              onChange={handleChange}
              placeholder="e.g., 30"
              className="w-full px-4 py-3 bg-[#262626] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none  text-white border-[#2A2A4A]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-3  text-white border-[#2A2A4A]">
            Choose a Plan
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3  text-white border-[#2A2A4A]">
            {plans.map(plan => (
              <button
                key={plan.id}
                onClick={() => setFormData(prev => ({ ...prev, subscriptionPlan: plan.id }))}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  formData.subscriptionPlan === plan.id
                    ? `border-blue-500 `
                    : `border-white/10 hover:border-white/30`
                }`}
              >
                {plan.popular && (
                  <span className="text-xs bg-teal-400/20 text-teal-400 px-2 py-0.5 rounded-full  text-white border-[#2A2A4A]">
                    Popular
                  </span>
                )}
                <div className="text-lg font-bold text-white mt-1  text-white border-[#2A2A4A]">{plan.name}</div>
                <div className="text-2xl font-bold text-[#2A1535]  text-white border-[#2A2A4A]">{plan.price}</div>
                <ul className="mt-2 space-y-1  text-white border-[#2A2A4A]">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-xs text-gray-400 flex items-center gap-1  text-white border-[#2A2A4A]">
                      <CheckCircle className="w-3 h-3 text-[#00C9A7]  text-white border-[#2A2A4A]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A1A] p-4  text-white border-[#2A2A4A]">
      <div className="glass-card p-8 max-w-2xl w-full  text-white border-[#2A2A4A]">
        {/* Header */}
        <div className="text-center mb-8  text-white border-[#2A2A4A]">
          <div className="flex items-center justify-center gap-3 mb-3  text-white border-[#2A2A4A]">
            <School className="w-12 h-12 text-[#2A1535]  text-white border-[#2A2A4A]" />
            <h1 className="text-2xl font-bold text-white  text-white border-[#2A2A4A]">School Sign Up</h1>
          </div>
          <p className="text-gray-400 text-sm  text-white border-[#2A2A4A]">
            Create your school account to manage quizzes and track student progress
          </p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-8  text-white border-[#2A2A4A]">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center  text-white border-[#2A2A4A]">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                s === step ? 'bg-blue-500 text-white' :
                s < step ? 'bg-[#00C9A7] text-white' :
                'bg-white/10 text-gray-500'
              }`}>
                {s < step ? <CheckCircle className="w-5 h-5  text-white border-[#2A2A4A]" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-0.5 ${s < step ? 'bg-[#00C9A7]' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          <div className="flex gap-3 mt-8  text-white border-[#2A2A4A]">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(prev => prev - 1)}
                className="flex-1 btn-secondary flex items-center justify-center gap-2  text-white border-[#2A2A4A]"
              >
                <ArrowLeft className="w-4 h-4  text-white border-[#2A2A4A]" /> Back
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 btn-primary flex items-center justify-center gap-2 ${
                step === 1 ? 'w-full' : ''
              }`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin  text-white border-[#2A2A4A]" />
              ) : step === 3 ? (
                <><CheckCircle className="w-4 h-4  text-white border-[#2A2A4A]" /> Create Account</>
              ) : (
                <>Continue <ArrowRight className="w-4 h-4  text-white border-[#2A2A4A]" /></>
              )}
            </button>
          </div>
        </form>

        {/* Back to login */}
        <div className="mt-6 text-center  text-white border-[#2A2A4A]">
          <button
            onClick={() => navigate('/auth')}
            className="text-sm text-gray-400  transition-colors  text-white border-[#2A2A4A]"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolSignup;
