import React,{useState,useEffect}  from "react";
import { Typography,Grid,List, ListItemIcon } from "@mui/material";
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import { GET_ALL_POKEMONS } from "../querys/pokemon";
import { useQuery } from "@apollo/client";
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import NameList from "../components/NameList";
import Image from "next/image";
import { POKEMON_TYPE } from "../helpers/typeIcon"; 






const Pokedex =()=>{

    const [selected,setSelected]=useState()
    const [type,getType] = useState()

  


 
  
    return(

        <div >
            <Grid container>
                <Grid item container xs={12} lg={12} style={{flexDirection:'row',margin:15,display:'flex'}}>
                    <Grid item   xs={6} lg={6} style={{flexDirection:'row'}}>
                   {selected ? <Image height='150' width='150' alt="sprite" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selected}.png`}></Image> : ""}
                   <Grid item xs={12} lg={12} align={'center'}>
                    <div style={{textAlign:'center',justifyContent:'center',alignItems:'center'}} >
                  {type ? type.map(type=>{
                    return POKEMON_TYPE(type.pokemon_v2_type.name)
                  }):"Choose a pokemon to preview"}</div>
                  
                  {/* {POKEMON_TYPE(type)} */}
                   </Grid>
                    </Grid>
                    <Grid item xs={6} lg={6}>
                    <NameList setSelected={setSelected} getType={getType}></NameList> 
                    </Grid>
                </Grid>
            </Grid>


        </div>

    )
}

export default Pokedex;