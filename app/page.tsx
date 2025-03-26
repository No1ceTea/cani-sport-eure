import Title from "./components/homepage/TitleSection";
import Presentation from "./components/homepage/PresentationSection";
import Sponsor from "./components/homepage/SponsorSection";
import LatestEvents from "./components/LastestEvents";
import LastestArticles from "./components/LastestArticles";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <main className="bg-cover bg-center">
      <Title />
      <Presentation />
      <Sponsor />

      <LatestEvents />

      <LastestArticles />

      <Sidebar />
      <Footer />
    </main>
  );
}
