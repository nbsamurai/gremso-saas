import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { authService } from '../services/authService';
import { clearPendingInviteToken, savePendingInviteToken, validateInviteToken } from '../services/inviteService';

export default function Invite() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invite, setInvite] = useState<any>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('Invitation token is missing.');
      setLoading(false);
      return;
    }

    const run = async () => {
      try {
        const inviteData = await validateInviteToken(token);
        setInvite(inviteData);
        savePendingInviteToken(token);

        const authToken = localStorage.getItem('token');
        const userJson = localStorage.getItem('user');

        if (authToken && userJson) {
          try {
            await authService.acceptInvite(token, authToken);
            clearPendingInviteToken();
            toast.success('Invitation accepted successfully');
            navigate('/dashboard', { replace: true });
            return;
          } catch (acceptError: any) {
            setError(acceptError.response?.data?.message || 'Unable to accept this invite with the current account.');
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'This invitation is invalid or expired.');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-[#F6F3EE]">
      <Navbar />
      <main className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#E5DED6] bg-white p-8 shadow-sm sm:p-10">
          {loading ? (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-[#1F2937]">Checking your invitation...</h1>
              <p className="mt-4 text-[#6B7280]">Please wait while we verify your team invite.</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-[#1F2937]">Invitation unavailable</h1>
              <p className="mt-4 text-[#6B7280]">{error}</p>
              <Link
                to="/login"
                className="mt-6 inline-flex rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-medium text-white"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-[#1F2937]">You&apos;re invited to join a team</h1>
              <p className="mt-4 text-[#6B7280]">
                {invite?.managerName} invited <span className="font-semibold text-[#1F2937]">{invite?.email}</span> to join{' '}
                <span className="font-semibold text-[#1F2937]">{invite?.teamName}</span>.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to={`/login?inviteToken=${encodeURIComponent(searchParams.get('token') || '')}`}
                  className="inline-flex rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-medium text-white"
                >
                  Log In
                </Link>
                <Link
                  to={`/signup?inviteToken=${encodeURIComponent(searchParams.get('token') || '')}`}
                  className="inline-flex rounded-lg border border-[#E5DED6] px-5 py-3 text-sm font-medium text-[#1F2937]"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
