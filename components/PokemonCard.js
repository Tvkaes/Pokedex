import React from 'react'
import { Typography,Grid,Paper } from '@mui/material'
import Image from "next/image";
import { GET_POKEMON_BY_ID } from '../querys/pokemon';
import { useQuery } from '@apollo/client';

function PokemonCard({id}) {
   const {data,loading,error}=useQuery(GET_POKEMON_BY_ID,{
    variables:{
      id:id
    }
   })

   console.log(data?data:'')
    
  return (
 
   <Paper style={{height:250,width:250}}>
        <Grid container>
            <Grid item container xs={12} lg={12}>
            <Paper style={{height:30,width:100,margin:15}}>
               {data ? <Typography variant={'body1'}  style={{fontFamily:'PokeFont',marginLeft:5}}>{data.pokemon_v2_pokemon[0].name}</Typography> :''}
            </Paper>

            </Grid>
            <div>
           {id ? 
           <div style={{backgroundColor:'rgba(226,191,101,.34)',borderRadius:100}}>
           <Image 
           height='120' 
           width='120' 
           alt="sprite" 
           src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}/>
           </div>
          :
          <div style={{display:'flex',position:'relative',top:100,left:100}}>
            <Image height={'50'} width={'50'} alt={"pokeball"} src={"/poke-ball.png"} />
          </div>
          }
            </div>
        
        </Grid>
    </Paper>

  )
}

export default PokemonCard