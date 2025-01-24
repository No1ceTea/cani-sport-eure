import HeroSection from "./components/HeroSection"
import NavigationBar from "./components/NavigationBar"
import Présentation from "./components/Présentation"

export default function Home() {
  return (
    <main>
      <NavigationBar />
      <HeroSection />
      <Présentation />
    </main>
  )
}
