import { useState, FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Hammer, Eye, EyeOff, Loader2 } from 'lucide-react';

import toast from 'react-hot-toast';
import { usePlan } from '../context/PlanContext';
import { authService, inviteStorage } from '../services/authService';
import { cachePlanSnapshot, getUserPlan, syncPendingPlanSelection } from '../services/planService';
import { clearPendingInviteToken } from '../services/inviteService';
import { isManagerRole } from '../utils/roleUtils';

export default function Login() {
  const navigate = useNavigate();
  const { refreshPlan } = usePlan();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get('inviteToken') || inviteStorage.get();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [errors, setErrors] = useState({
    email: '',
    general: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResendRequest, setShowResendRequest] = useState(false);
  const [isResendingRequest, setIsResendingRequest] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const getApiErrorMessage = (err: any, fallback: string) =>
    typeof err?.response?.data === 'string'
      ? err.response.data
      : err?.response?.data?.message || fallback;

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', general: '' };

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const isFormValid = formData.email && formData.password;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setErrors((prev) => ({ ...prev, general: '' }));
      setShowResendRequest(false);

      try {
        const loginResponse = await authService.loginUser(formData.email, formData.password);
        const loginPlanSnapshot = loginResponse.planDetails || null;
        const requiresApproval = Boolean(loginResponse.user?.requiresApproval);
        const approvalStatus = loginResponse.user?.approvalStatus;

        if (!requiresApproval && loginPlanSnapshot) {
          cachePlanSnapshot(loginPlanSnapshot);
        }

        if (inviteToken) {
          inviteStorage.save(inviteToken);
          await authService.acceptInvite(inviteToken, loginResponse.token);
          clearPendingInviteToken();
        }

        if (requiresApproval && approvalStatus === 'not_submitted') {
          toast.success('Select a plan and submit your details to start the approval review.');
          navigate('/pricing');
          return;
        }

        const pendingPlanSnapshot = await syncPendingPlanSelection(loginResponse.user.id);
        const currentPlanSnapshot =
          pendingPlanSnapshot ||
          (await refreshPlan().catch(() => null)) ||
          (await getUserPlan(loginResponse.user.id).catch(() => loginPlanSnapshot)) ||
          loginPlanSnapshot;
        toast.success('Logged in successfully!');
        navigate(currentPlanSnapshot?.plan || !isManagerRole(loginResponse.user.role) ? '/dashboard' : '/pricing');
      } catch (err: any) {
        let errorMessage = err.response?.data?.message || err.message || 'Login failed';
        
        if (err.message === 'NOT_VERIFIED') {
          errorMessage = 'Please verify your email before accessing the dashboard.';
        } else if (err.response?.data?.approvalStatus === 'pending') {
          errorMessage = 'Your account is under review. Please wait for approval.';
          setShowResendRequest(true);
        } else if (err.response?.data?.approvalStatus === 'rejected') {
          errorMessage = 'Your access request has been rejected.';
        } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
          errorMessage = 'Invalid email or password.';
        }
        
        setErrors((prev) => ({ ...prev, general: errorMessage }));
        toast.error(errorMessage);
        if (err.code || err.message) {
           authService.logout().catch(() => {});
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResendRequest = async () => {
    if (!formData.email.trim()) {
      setErrors((prev) => ({ ...prev, email: 'Email is required' }));
      return;
    }

    setIsResendingRequest(true);
    try {
      await authService.resendOnboardingRequest(formData.email.trim());
      toast.success('Request sent again successfully.');
    } catch (err: any) {
      toast.error(getApiErrorMessage(err, 'Failed to resend onboarding request'));
    } finally {
      setIsResendingRequest(false);
    }
  };

  const getInputStatusClass = (value: string, error: string) => {
    if (!value) return 'border-[#E5DED6] focus:border-[#2563EB] ring-[#2563EB]';
    if (error) return 'border-red-500 focus:border-red-500 ring-red-500';
    return 'border-green-500 focus:border-green-500 ring-green-500';
  };

  return (
    <div className="min-h-screen bg-[#F6F3EE] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center">
              <Hammer className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-[#1F2937] mb-2">
            Welcome back
          </h2>
          <p className="text-[#6B7280]">
            Sign in to your ZENTIVORA account to continue
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E5DED6] p-8 shadow-sm">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium">
              {errors.general}
            </div>
          )}

          {showResendRequest && (
            <div className="mb-6 rounded-lg border border-[#D7C7B3] bg-[#FFF7ED] p-4">
              <p className="text-sm font-medium text-[#6B7280]">
                If the approval email was missed, you can send it again to the admin.
              </p>
              <button
                type="button"
                onClick={handleResendRequest}
                disabled={isResendingRequest}
                className="mt-3 inline-flex items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-[#A5B4D4]"
              >
                {isResendingRequest ? 'Sending...' : 'Resend Request'}
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#1F2937] mb-2"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                onBlur={validateForm}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-colors ${getInputStatusClass(formData.email, errors.email)}`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#1F2937] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 pr-12 transition-colors ${formData.password ? 'border-green-500 focus:border-green-500 ring-green-500' : 'border-[#E5DED6] focus:border-[#2563EB] ring-[#2563EB]'}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1F2937] focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={formData.remember}
                  onChange={(e) =>
                    setFormData({ ...formData, remember: e.target.checked })
                  }
                  className="w-4 h-4 text-[#2563EB] border-[#E5DED6] rounded focus:ring-[#2563EB]"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-[#6B7280]"
                >
                  Remember me
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-[#1F2937] hover:text-[#2563EB] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                isLoading || !isFormValid ? 'bg-[#E5DED6] cursor-not-allowed text-[#6B7280]' : 'bg-[#2563EB] hover:bg-[#1D4ED8] shadow-sm'
              }`}
            >
              {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6B7280]">
              Don't have an account?{' '}
              <Link
                to={inviteToken ? `/signup?inviteToken=${encodeURIComponent(inviteToken)}` : '/signup'}
                className="font-medium text-[#1F2937] hover:text-[#2563EB] transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-[#6B7280] hover:text-[#1F2937] transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
