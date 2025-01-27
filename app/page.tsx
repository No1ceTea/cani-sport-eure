import HeroSection from "./components/HeroSection"
import NavigationBar from "./components/NavigationBar"
import Présentation from "./components/Présentation"
import Footer from "./components/Footer"

export default function Home() {
  return (
    <main>
      <NavigationBar />
      <HeroSection />
      <Présentation />
      <Footer />
    </main>
  )
}
