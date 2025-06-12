import TestimonialCard from "../../components/home/TestimonialCard";
import Hero from "../../components/home/HomeHero";
import OfferApproach from "../../components/home/OfferApproach";
import DemoSession from '../../components/home/DemoSession';

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
