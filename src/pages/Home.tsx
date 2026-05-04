import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import About from '../components/About';
import Pricing from '../components/Pricing';
import BlogSection from '../components/BlogSection';
import Booking from '../components/Booking';

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <About />
      <Pricing />
      <BlogSection />
      <Booking />
    </main>
  );
}
