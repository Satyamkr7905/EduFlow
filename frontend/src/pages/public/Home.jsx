import { PageTransition } from '../../components/ui/Motion';
import Hero from '../../components/public/Hero';
import Programs from '../../components/public/Programs';
import About from '../../components/public/About';
import Contact from '../../components/public/Contact';

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <Programs />
      <About />
      <Contact />
    </PageTransition>
  );
}
