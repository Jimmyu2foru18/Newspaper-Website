import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
      <h1 className="text-4xl font-bold serif-text text-primary mb-8">Contact Us</h1>
      <p className="text-xl text-gray-600 mb-12">
        Have questions, feedback, or a story to pitch? We'd love to hear from you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <div className="p-6 border rounded-xl bg-gray-50 flex items-start gap-4">
          <Mail className="h-6 w-6 text-primary flex-shrink-0" />
          <div>
            <h3 className="font-bold">Editorial Inquiries</h3>
            <p className="text-sm text-gray-600">editor@catalyst.oldwestbury.edu</p>
          </div>
        </div>

        <div className="p-6 border rounded-xl bg-gray-50 flex items-start gap-4">
          <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
          <div>
            <h3 className="font-bold">Mailing Address</h3>
            <p className="text-sm text-gray-600">
              SUNY Old Westbury <br />
              223 Store Hill Road, Old Westbury, NY 11568
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
