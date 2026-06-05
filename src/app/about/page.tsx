import { Shield, Users, BookOpen, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold serif-text text-primary mb-6">About the Catalyst</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          The Old Westbury Catalyst is the digital publishing ecosystem for SUNY Old Westbury, fostering student journalism, multimedia storytelling, and scholarly excellence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div className="space-y-4">
          <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Users className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold serif-text">Student-Led</h2>
          <p className="text-gray-600 leading-relaxed">
            All content on the Catalyst is produced by SUNY Old Westbury students. We offer a professional environment for students to advance their expertise in media, journalism, and research.
          </p>
        </div>

        <div className="space-y-4">
          <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold serif-text">Editorial Integrity</h2>
          <p className="text-gray-600 leading-relaxed">
            We maintain high standards of accuracy and ethical reporting. Our student editors and faculty advisors ensure that every publication meets our community guidelines.
          </p>
        </div>

        <div className="space-y-4">
          <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <BookOpen className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold serif-text">Academic Hub</h2>
          <p className="text-gray-600 leading-relaxed">
            Beyond news, the Catalyst serves as a repository for academic journals and research papers, showcasing the scholarly achievements of our campus community.
          </p>
        </div>

        <div className="space-y-4">
          <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Globe className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold serif-text">Community Driven</h2>
          <p className="text-gray-600 leading-relaxed">
            Engagement is at our core. We allow public discussion through our guest identity system, fostering a safe and accountable space for campus dialogue.
          </p>
        </div>
      </div>

      <div className="bg-primary rounded-[32px] p-12 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.oldwestbury.edu/sites/default/files/styles/hero_image/public/2021-08/campus-shot.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold serif-text mb-6">Campus Location</h2>
          <p className="text-xl text-white/80 mb-8 font-light">
            SUNY Old Westbury <br />
            223 Store Hill Road <br />
            Old Westbury, NY 11568
          </p>
          <div className="text-6xl animate-pulse">🐾</div>
          <p className="mt-4 italic text-white/60">Owen is always watching! Go Panthers!</p>
        </div>
      </div>
    </div>
  );
}
