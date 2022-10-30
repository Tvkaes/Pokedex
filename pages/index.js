
import styles from '../styles/Home.module.css'
import Pokedex from './Pokedex'
import Navbar from '../components/menuBar';

function Home() {


  return (
    <div className={styles.container}>
     <Pokedex></Pokedex>
    </div>
  )
}
export default Home;
Home.Layout = Navbar
