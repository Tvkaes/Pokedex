import React from 'react'
import { Typography,Grid,List, ListItemIcon } from "@mui/material";
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import { useQuery } from "@apollo/client";
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { GET_POKEMONS } from '../querys/pokemon';

function NameList({name,setSelected,getType}) {
  
  const {data:dataPoke}= useQuery(GET_POKEMONS);



 
    
  const renderList = (props)=>{

      return(
          <List >
              {dataPoke ? dataPoke.pokemon_v2_pokemon.map((value,index)=>(
                  <ListItem button key={value.name} onClick={(e)=>{setSelected(value.id); getType(value.pokemon_v2_pokemontypes)}}>
                      <ListItemIcon><CatchingPokemonIcon style={{color:'black'}}></CatchingPokemonIcon> </ListItemIcon>
                          <ListItemText primary={`${value.id} - ${value.name}`}    style={{color:'black',textTransform:'capitalize'}}></ListItemText>
                  </ListItem>
              )):""}
          </List>
      )
   }
  return (
    <div style={{overflow:'scroll',height:'15vw',width:'20vw'}}>
      {renderList()}
      </div>
  )
}

export default NameList