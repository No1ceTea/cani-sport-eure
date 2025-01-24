import "./globals.css"
import HeroSection from "./components/HeroSection"
import NavigationBar from "./components/NavigationBar"

export default function Home() {
  return (
    <main>
      <NavigationBar />
      <HeroSection />
    </main>
  )
}
