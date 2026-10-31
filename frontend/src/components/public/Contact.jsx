import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Motion';
import { CONTACT } from '../../utils/constants';

const DETAILS = [
  { icon: Mail, label: 'Email', value: CONTACT.email, href: CONTACT.emailHref },
  { icon: Phone, label: 'Phone', value: CONTACT.phoneDisplay, href: CONTACT.phoneHref },
  { icon: MapPin, label: 'Visit', value: 'Koramangala, Bengaluru, India' },
];

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="grid gap-8 rounded-xl4 border border-line bg-white p-8 shadow-soft sm:p-12 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-sm font-medium text-coral">Contact</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold text-ink sm:text-4xl">
                Have a question? We&apos;d love to hear from you.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
                The fastest way to reach us is the inquiry form — it goes straight to our team&apos;s
                dashboard and you&apos;ll hear back soon.
              </p>
              <Link to="/inquire" className="mt-8 inline-block">
                <Button size="lg" iconRight={ArrowUpRight}>
                  Submit an Inquiry
                </Button>
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-1">
              {DETAILS.map((item) => {
                const Icon = item.icon;
                const Inner = (
                  <div className="flex items-center gap-4 rounded-xl3 bg-cream p-5 transition hover:bg-sand/60">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-ink shadow-soft">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted">{item.label}</p>
                      <p className="font-medium text-ink">{item.value}</p>
                    </div>
                  </div>
                );
                return item.href ? (
                  <a key={item.label} href={item.href}>
                    {Inner}
                  </a>
                ) : (
                  <div key={item.label}>{Inner}</div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
