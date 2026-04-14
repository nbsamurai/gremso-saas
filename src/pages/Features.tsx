import InfoPageLayout from '../components/InfoPageLayout';

export default function Features() {
  return (
    <InfoPageLayout
      title="Features"
      intro="ZENTIVORA is built for construction teams that need one dependable place to manage projects, documents, meetings, and operational updates."
      paragraphs={[
        'Our workspace combines project tracking, document control, meeting coordination, and team collaboration into a single organized system. Site managers can keep schedules, safety records, and project files aligned without switching between disconnected tools.',
        'Built-in task workflows help teams assign responsibilities, follow deadlines, and maintain accountability from planning through handover. This makes it easier to monitor progress across active jobs while keeping communication clear for office and field staff.',
        'ZENTIVORA also supports secure document handling, structured team access, and workspace-level organization so growing companies can scale their delivery process without losing visibility or control.',
      ]}
    />
  );
}
