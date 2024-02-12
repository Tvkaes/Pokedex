
import { styles } from '../styles'
import { useEffect,useState } from 'react'
import getPokemons from '../utils/getPokemon';
import { useExtractColor } from "react-extract-colors";
import { TYPE_COLOR } from '../utils/getPokemonColor';
import { Pokemon } from '../utils/getPokemon';
import { fadeIn } from '../utils/motion';
import { motion, AnimatePresence } from 'framer-motion';






const HeroPokedex = ()=>{
    
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [pkmnDefault,setRandomPokemon] = useState<any>()
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [randomNumber, setRandomNumber] = useState<number>(0);
   
    
    


	useEffect(()=>{

      async function fetchData(){
            const fetchedPokemons = await getPokemons();
            setPokemons(fetchedPokemons);
            
              
              const randomIndex = Math.floor(Math.random() * fetchedPokemons.length);
              
              setRandomPokemon(fetchedPokemons[randomIndex]);
              setCurrentIndex(randomIndex);

      }
		fetchData();

    var audio  = document.getElementById("cryVolume") as HTMLAudioElement | null
    
    if(audio){
      audio.volume = 0.3
    }else{
      console.log("No Funciona esta madre")
    }


  },[]);

  useEffect(() => {
    generateRandomNumber();

  }, [pkmnDefault]); // Se ejecutará cada vez que cambie randomPokemon


  const navigatePokemon = (direction: 'prev' | 'next') => {
    if (pokemons.length === 0 || currentIndex === null) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % pokemons.length;
    } else {
      newIndex = (currentIndex - 1 + pokemons.length) % pokemons.length;
    }

    setRandomPokemon(pokemons[newIndex]);
    setCurrentIndex(newIndex);
   
   
  };

  const generateRandomNumber = () => {
    const newRandomNumber = Math.floor(Math.random() * 100) + 1;

    setRandomNumber(newRandomNumber)
    

  };

  
  const handleColorsBackground = (image:string)=>{

    const {
      colors,dominantColor} = useExtractColor(image,{
      maxColors: 6,
      format: "rgb",
      maxSize: 200,
    });
    
    document.documentElement.style.setProperty('--color-bg2',dominantColor );
    document.documentElement.style.setProperty('--color1',quitarPrefijoRGB(colors[2]) );
    document.documentElement.style.setProperty('--color2',quitarPrefijoRGB(colors[1]) );
    document.documentElement.style.setProperty('--color3',quitarPrefijoRGB(colors[3]) );
    document.documentElement.style.setProperty('--color4',quitarPrefijoRGB(colors[0]) );
    document.documentElement.style.setProperty('--color5',quitarPrefijoRGB(colors[5]) );
    document.documentElement.style.setProperty('--color-interactive',quitarPrefijoRGB(colors[4]) );  
  }

  handleColorsBackground(randomNumber === 1 ? pkmnDefault && pkmnDefault.shiny : pkmnDefault&&pkmnDefault.image)

  function quitarPrefijoRGB(color: string): string {
    try {
      const numeros: string | null = color.match(/\((.*?)\)/)?.[1] || '';
      return numeros;
    } catch (error) {
      return ''
      
    }  
  }



  console.log(pkmnDefault)


    return(
        <>
        <section id='hero' className='relative w-full h-screen mx-auto flex flex-wrap '>

        <div className={`${styles.paddingX} absolute inset-0 top-[200px] max-w-7xl mx-auto  `}>
        
          <div  className='absolute -top-36 right-28 '>
            <AnimatePresence mode='sync'>
                <motion.img variants={fadeIn("left","spring",0.1,1)} src={
                    randomNumber === 1 ? pkmnDefault&& pkmnDefault.shiny : pkmnDefault &&pkmnDefault.image
                }/>
            </AnimatePresence>
            
          </div>

          {randomNumber === 1 && <audio  autoPlay src={'/1554.wav'} />}
            
           
          <audio id='cryVolume'  autoPlay src={`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pkmnDefault&&pkmnDefault.id}.ogg`} />
            
         

          <div className='absolute bottom-16 left-0 '>
            <div className='flex justify-start gap-16 items-center'>
           
              <div className='  flex items-center justify-center'>
                <img className='flex justify-center items-center mb-6' src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${pkmnDefault && pkmnDefault.id-1 === 0 ? 386 :pkmnDefault && pkmnDefault.id-1}.png`}/>
                <p className='drop-shadow-md !text-black'>{pkmnDefault && pkmnDefault.id-1 === 0 ? 386 :pkmnDefault && pkmnDefault.id-1}</p>
              </div>

              <div className='h-px w-6 bg-black drop-shadow-sm shadow-sm shadow-black'></div>

              <div className='  flex items-center justify-center'>
                <img className='flex justify-center items-center mb-6' src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${pkmnDefault && pkmnDefault.id+1 === 387 ? 1 :pkmnDefault && pkmnDefault.id+1 }.png`}/>
                <p className='drop-shadow-md !text-black'>{pkmnDefault && pkmnDefault.id+1 === 387 ? 1 : pkmnDefault && pkmnDefault.id+1}</p>
              </div>
              
            </div>

            <p style={{color:`${TYPE_COLOR({type:pkmnDefault?pkmnDefault.types[0].name:""})}`}} className={`${styles.PokedexHeadText} drop-shadow-lg uppercase  shadow-white`}>{pkmnDefault && pkmnDefault.name}</p>

            <div className='grid grid-cols-2 '>
              {pkmnDefault && pkmnDefault.types.map((type:{name:string})=>(
                <div key={type.name}>
                  <p className='drop-shadow uppercase !text-black'>{`type ${type.name}`}</p>
                </div>
              )
                
              )}
              
            </div>

            <div className='grid grid-cols-2'>
              <div className=' '>
               <button onClick={()=>{navigatePokemon("prev")}} className='btn h-full btn-ghost hover:bg-transparent'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="6em" height="6em" viewBox="0 0 24 24"><path fill="black" className='drop-shadow-md shadow-xs shadow-black' d="M12.29 8.71L9.7 11.3a.996.996 0 0 0 0 1.41l2.59 2.59c.63.63 1.71.18 1.71-.71V9.41c0-.89-1.08-1.33-1.71-.7"></path></svg>
               </button>
              </div>

              <div>
                <button onClick={()=>{navigatePokemon("next")}} className='btn h-full btn-ghost hover:bg-transparent'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="6em" height="6em" viewBox="0 0 24 24"><path fill="black" className='drop-shadow-md shadow-xs shadow-black' d="m11.71 15.29l2.59-2.59a.996.996 0 0 0 0-1.41L11.71 8.7c-.63-.62-1.71-.18-1.71.71v5.17c0 .9 1.08 1.34 1.71.71"></path></svg>  
                </button>

              </div>

            </div>
            
          </div>

   
        </div>

      </section>
        </>
    )
}


// export default SectionWrapper(Hero,'hero');
export default HeroPokedex