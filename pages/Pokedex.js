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
import PokemonCard from "../components/PokemonCard";






const Pokedex =()=>{

    const [selected,setSelected]=useState()
    const [type,getType] = useState()
    const [info,setInfo] =useState()

  


 
  
    return(

        <div>
            <Grid container>
                <Grid item container xs={12} lg={12} style={{flexDirection:'row',margin:15,display:'flex'}}>
                   
                    <Grid item   xs={6} lg={6} style={{flexDirection:'row'}}>
                      
                       <PokemonCard id={selected} type={type ? type : null}></PokemonCard>
                       
                   <Grid item xs={12} lg={12} align={'center'}>
                    
                   </Grid>
                    </Grid>
                    <Grid item xs={6} lg={6}>
                    <NameList setSelected={setSelected} getType={getType} setInfo={setInfo}></NameList> 
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

export default Pokedex;