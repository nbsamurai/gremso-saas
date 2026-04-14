import AppShell from '../components/AppShell';
import Notepad from '../components/Notepad';
import UpgradePrompt from '../components/UpgradePrompt';
import { usePlan } from '../context/PlanContext';
import { hasFeatureAccess } from '../utils/planUtils';
import { isManagerRole } from '../utils/roleUtils';

export default function PrivateNotes() {
    const { planSnapshot } = usePlan();
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
    const isManager = isManagerRole(user?.role);

    if (!hasFeatureAccess(planSnapshot, 'privateNotes')) {
        return (
            <AppShell contentClassName="p-4 sm:p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-[#1F2937] sm:text-3xl">Private Notes</h1>
                    <p className="text-sm text-[#6B7280] sm:text-base">Your secure, auto-saving notepad visible only to you.</p>
                </div>
                <UpgradePrompt
                    message={isManager ? 'Private notes are available on Professional and Premium Plus plans.' : 'Your manager needs to upgrade the team plan to unlock private notes.'}
                    showButton={isManager}
                />
            </AppShell>
        );
    }

    return (
        <AppShell contentClassName="p-4 sm:p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1F2937] sm:text-3xl">Private Notes</h1>
                <p className="text-sm text-[#6B7280] sm:text-base">Your secure, auto-saving notepad visible only to you.</p>
            </div>
            <div className="h-[70vh] min-h-[500px] w-full max-w-5xl">
                <Notepad />
            </div>
        </AppShell>
    );
}
