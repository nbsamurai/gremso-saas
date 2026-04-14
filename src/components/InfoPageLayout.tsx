import Navbar from './Navbar';
import Footer from './Footer';

type InfoPageLayoutProps = {
  title: string;
  intro: string;
  paragraphs: string[];
};

export default function InfoPageLayout({
  title,
  intro,
  paragraphs,
}: InfoPageLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
          <h1 className="mb-4 text-3xl font-bold text-[#1F2937] sm:text-4xl">
            {title}
          </h1>
          <p className="mb-6 text-lg leading-relaxed text-[#6B7280]">{intro}</p>
          <div className="space-y-5 text-base leading-relaxed text-[#4B5563] sm:text-lg">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
