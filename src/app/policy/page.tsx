export default function PolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold serif-text text-primary mb-8">Editorial Policy</h1>
      <div className="prose prose-lg text-gray-700">
        <p>The Old Westbury Catalyst adheres to strict standards of journalistic integrity and academic honesty. Our mission is to provide a platform for student voices that is both representative of the diverse SUNY Old Westbury community and anchored in factual accuracy.</p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">Content Guidelines</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>All submissions must be original work.</li>
          <li>We prioritize objective reporting and well-reasoned, evidence-based opinion pieces.</li>
          <li>Hate speech, harassment, and misinformation are strictly prohibited.</li>
          <li>All research papers must cite sources in accordance with established academic formats (e.g., APA, MLA).</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Moderation</h2>
        <p>Student editors and faculty advisors review all submissions. We reserve the right to edit for clarity, style, and compliance with our editorial standards.</p>
      </div>
    </div>
  );
}
