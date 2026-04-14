import InfoPageLayout from '../components/InfoPageLayout';

export default function Blog() {
  return (
    <InfoPageLayout
      title="Blog"
      intro="The ZENTIVORA blog shares practical ideas for improving project delivery, team coordination, and document control across construction operations."
      paragraphs={[
        'We publish guidance on topics such as task planning, digital workflows, project visibility, and better ways to organize information across multiple teams. The goal is to provide useful insight rather than generic software marketing.',
        'Our content is written for project leaders, operations teams, and business owners who want to improve how work is tracked and communicated. We focus on common operational friction points and how structured systems can reduce them.',
        'As the platform evolves, this space will also include product updates, implementation advice, and workflow examples that help teams get more value from modern project management tools.',
      ]}
    />
  );
}
