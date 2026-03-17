
import About from '../components/Landingpage/About';
import Contact from '../components/Landingpage/Contact';
import Footer from '../components/Landingpage/Footer';
import Heropage from '../components/Landingpage/Heropage';
import Navbar from '../components/Landingpage/Navbar';

export default function IndexPage() {
    // Redirect to login as the default entry point for pages
    return (
  <>
      <Navbar/>
      <main>
         <Heropage/>
         <About/>
         <Contact/>
      </main>
      <Footer/>
  </>
    )
}