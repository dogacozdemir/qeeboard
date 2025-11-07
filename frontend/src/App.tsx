import './styles.css'
import { Header, Footer } from './components/Layout'
import { Hero } from './components/Hero'
import { WizardSection, EaseSection, DeliverySection } from './components/Sections'

function App() {
  return (
    <>
      <Header />
      <Hero />
      <WizardSection />
      <EaseSection />
      <DeliverySection />
      <Footer />
    </>
  )
}

export default App
