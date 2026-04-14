import InfoPageLayout from '../components/InfoPageLayout';

export default function HelpCenter() {
  return (
    <InfoPageLayout
      title="Help Center"
      intro="The Help Center is here to support teams as they set up their workspace, invite users, and manage day-to-day activity inside ZENTIVORA."
      paragraphs={[
        'Most support topics focus on practical onboarding steps such as creating projects, uploading documents, assigning tasks, and keeping team members aligned across active work. We aim to make the platform straightforward for both managers and collaborators.',
        'We also provide guidance for account access, workspace organization, notification handling, and general platform usage. This helps teams resolve common questions quickly without interrupting delivery work on live projects.',
        'As the product expands, the Help Center will continue to grow with clearer walkthroughs, usage tips, and support resources so teams can adopt new features with confidence.',
      ]}
    />
  );
}
