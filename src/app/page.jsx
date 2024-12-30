

// Importing components
import Cursor from "@/components/cursor/Cursor";
import Hero from "@/components/home/Hero/hero";
import AboutGO from "@/components/home/aboutgo/aboutgo";
import BookNow from "@/components/home/booknow/booknow";
import Databanner from "@/components/home/databanner/databanner";
import Flags from "@/components/home/flags/flags";
import Students from "@/components/home/students/students";
import Footer from "@/components/layouts/footer/footer";
import Navbar from "@/components/layouts/navbar/navbar";

const Page = () => {
  
  return (
    <div>
      <Cursor/>
      <Navbar />
      <Hero />
      <AboutGO />
      <Students />
      <Flags />
      <Databanner />
      <BookNow />
      <Footer />
    </div>
  );
};

export default Page;
