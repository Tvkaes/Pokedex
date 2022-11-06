import React,{useState,useEffect}  from "react";
import { Typography,Grid,List, ListItemIcon, TextField, InputBase, Button } from "@mui/material";
import NameList from "../components/NameList";
import PokemonCard from "../components/PokemonCard";
import { GET_POKEMON_BY_NAME } from "../querys/pokemon";
import {FaSearch} from "react-icons/fa";
import { TYPE_COLOR } from "../helpers/typeIcon";
import { useLazyQuery} from "@apollo/client";
import { Hint } from 'react-autocomplete-hint';






const Pokedex =()=>{

    const [selected,setSelected]=useState()
    const [type,getType] = useState()
    const [info,setInfo] =useState()
    const [ color,getColors] =useState()
    const [id,setID]=useState()
   
    
    
    var Pokemon=new Array("Bulbasaur","Ivysaur","Venusaur","Charmander","Charmeleon","Charizard","Squirtle","Wartortle","Blastoise","Caterpie","Metapod","Butterfree","Weedle","Kakuna","Beedrill","Pidgey","Pidgeotto","Pidgeot","Rattata","Raticate","Spearow","Fearow","Ekans","Arbok","Pikachu","Raichu","Sandshrew","Sandslash","Nidoran","Nidorina","Nidoqueen","Nidoran","Nidorino","Nidoking","Clefairy","Clefable","Vulpix","Ninetales","Jigglypuff","Wigglytuff","Zubat","Golbat","Oddish","Gloom","Vileplume","Paras","Parasect","Venonat","Venomoth","Diglett","Dugtrio","Meowth","Persian","Psyduck","Golduck","Mankey","Primeape","Growlithe","Arcanine","Poliwag","Poliwhirl","Poliwrath","Abra","Kadabra","Alakazam","Machop","Machoke","Machamp","Bellsprout","Weepinbell","Victreebel","Tentacool","Tentacruel","Geodude","Graveler","Golem","Ponyta","Rapidash","Slowpoke","Slowbro","Magnemite","Magneton","Farfetch'd","Doduo","Dodrio","Seel","Dewgong","Grimer","Muk","Shellder","Cloyster","Gastly","Haunter","Gengar","Onix","Drowzee","Hypno","Krabby","Kingler","Voltorb","Electrode","Exeggcute","Exeggutor","Cubone","Marowak","Hitmonlee","Hitmonchan","Lickitung","Koffing","Weezing","Rhyhorn","Rhydon","Chansey","Tangela","Kangaskhan","Horsea","Seadra","Goldeen","Seaking","Staryu","Starmie","Mr. Mime","Scyther","Jynx","Electabuzz","Magmar","Pinsir","Tauros","Magikarp","Gyarados","Lapras","Ditto","Eevee","Vaporeon","Jolteon","Flareon","Porygon","Omanyte","Omastar","Kabuto","Kabutops","Aerodactyl","Snorlax","Articuno","Zapdos","Moltres","Dratini","Dragonair","Dragonite","Mewtwo","Mew");
    const [getPokemon,{data,error,loading}] =useLazyQuery(GET_POKEMON_BY_NAME)
   



    const handleSearch = ()=>{
        getPokemon({
            variables:{
                name: selected
            }
        }).then((res)=>{
           
            if( res.data.pokemon_v2_pokemon.length > 0 ){
                setInfo(res.data)
                setID(res.data.pokemon_v2_pokemon[0].id)
                getType(res.data.pokemon_v2_pokemon[0].pokemon_v2_pokemontypes)
            }
           
        }).catch((err)=>{
           
        })
    }
    
    const hex2rgba = (hex,alpha)=>{
       if(hex){
        const [r,g,b]= hex.match(/\w\w/g).map(x=> parseInt(x,16));
        return `rgba(${r},${g},${b},${alpha})`
       }
    }
  
  
   
    return(

        <div style={{height:'100vw',width:'100vw',zIndex:0, height:' 100vw',width: '100vw',background:`linear-gradient(105deg,${hex2rgba(TYPE_COLOR(color),.4)} 50%, transparent 0%)`}}>
           
            <Grid container style={{height:'100%',width:'100%'}}>
                <Grid item container xs={12} lg={12} >
                   
                    <Grid item xs={6} lg={6} >
                      <div style={{padding:'6vw',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <PokemonCard id={id} type={type} getColors={getColors} info={info} ></PokemonCard>
                      </div>
                    </Grid>

                    <Grid item xs={6} lg={6}>
                        <div  style={{padding:'6.5vw',alignItems:'center',justifyContent:'center',}}>
                            <Grid item container xs={12} lg={12}>
                                <Grid item xs={12} lg={12} align='center' style={{marginTop:'10vw'}}>
                                <Typography variant={'h3'} style={{fontFamily:'DMSans-Bold'}}>Welcome to PokemonDex</Typography>
                                <Typography variant={'caption'} style={{fontFamily:'DMSans-Regular'}}>You can search all the first generation of pokemons!</Typography>
                                </Grid>
                               <Grid item xs={12} lg={12} style={{marginTop:'3vw'}}>
                                 <div className={'neo'} style={{padding:5,border:2,borderStyle:'solid',borderColor:TYPE_COLOR(color),display:'flex',alignItems:'center'}} >
                                  <FaSearch style={{marginLeft:'1vw'}} color={'rgba(0,0,0,0.6)'}/>
                                  <Hint options={Pokemon} >
                                  <input className="input-with-hint" onBlur={(e)=>{setSelected(e.target.value)}}/>
                                  </Hint>
                                  </div>
                                </Grid>
                               <Grid item xs={12} lg={12} align={'center'} style={{marginTop:'2vw'}}>
                               <Button variant={"contained"} style={{backgroundColor:TYPE_COLOR(color),fontFamily:'DMSans-Medium'}} onClick={()=> handleSearch()}>search</Button>
                               </Grid>
                            </Grid>
                        </div>
                    </Grid>

                </Grid>
            </Grid>
            
        </div>
    )
}

export default Pokedex;