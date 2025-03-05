import TestimonialCard from "./TestimonialCard";
import Hero from "./HomeHero";
import OfferApproach from "./OfferApproach";
import DemoSession from './DemoSession';

export default async function Home() {

  return (
    <>
      <Hero/>
      <TestimonialCard/>
      <OfferApproach/>
      <DemoSession></DemoSession>
    </>
  );
}
