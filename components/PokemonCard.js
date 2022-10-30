import React,{useState} from 'react'
import { Typography,Grid,Paper,Divider } from '@mui/material'
import Image from "next/image";
import { GET_POKEMON_BY_ID } from '../querys/pokemon';
import { useQuery } from '@apollo/client';
import styles from '../styles/pokedex.module.css'
import { POKEMON_TYPE } from "../helpers/typeIcon"; 
import {FaWeight} from 'react-icons/fa';
import {FaRulerVertical}  from 'react-icons/fa'
import ProgressBar from 'react-percent-bar';
import { TYPE_COLOR } from '../helpers/typeIcon';


function PokemonCard({id,type}) {

   const {data,loading,error}=useQuery(GET_POKEMON_BY_ID,{
    variables:{
      id:id
    }
   })
   const [color,setColor]= useState()
 


   function Percent(data) {
    var max = 255;
    var min = data;
    var maxPercent = 100;
    var totalPercent
    if(data){
     
       totalPercent = (min*maxPercent)/max
    }
    console.log(totalPercent)
    return totalPercent
 
   }

   function renderStats() {

    if(data){
     return data.pokemon_v2_pokemon.map(array=>{
       return array.pokemon_v2_pokemonstats.map(stats=>{
          return (
            <Grid item xs={12} lg={12} style={{display:'flex',justifyContent:'space-between'}} key={stats.pokemon_v2_pokemonstat ? stats.pokemon_v2_pokemonstat.name : '' }>
                <Typography style={{fontFamily:'DMSans-Regular',marginLeft:'.9vw'}}>{stats.pokemon_v2_stat ? stats.pokemon_v2_stat.name : '' }</Typography>
                <ProgressBar percent={Percent(stats.base_stat)} width="50%" fillColor= {getColor()}>40</ProgressBar>
              </Grid>
          )
        })
      })
    }
    
   }

   function getColor() {
    
    if(data){
     return data.pokemon_v2_pokemon.map(base=>{
      return TYPE_COLOR(base.pokemon_v2_pokemontypes[0].pokemon_v2_type.name)
      })
    }
   }



 
    
  return (
 
   <div className={styles.neo}>
        {/* Upp */}
          <div className={styles.containerUp} style={{backgroundColor:getColor()}}>
            <div style={{padding:15,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <Typography style={{fontFamily:'DMSans-Regular'}} >{data ? data.pokemon_v2_pokemon[0].name : '' }</Typography>
            <Typography style={{fontFamily:'DMSans-Regular',marginRight:'1vw'}} >{`#${id ? id : ''}`}</Typography>
            </div>
            <div align={'center'} > 
            {id ? 
           <Image 
           height='200' 
           width='200' 
           alt="sprite" 
           style={{zIndex:1}}
           src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}/>
          :
          null
          }
          </div>
          
          </div>
        {/* Down */}
          <div className={styles.containerDown} >
         <Grid container>
          <Grid item xs={12} lg={12} style={{padding:'1.5vw'}} >
          {type ? type.map(type=>{
             return POKEMON_TYPE(type.pokemon_v2_type.name)
            }):"Choose a pokemon to preview"}
          </Grid>
          <Grid item container lg={12} xs={12} style={{padding:'.5vw'}}>

           <Grid item xs={12} lg={12} >
           <Typography variant={'h6'} style={{fontFamily:'DMSans-Medium'}} >About</Typography>
           </Grid>

           <Grid item container xs={12} lg={12} style={{width:'100%'}}>
            <Grid item xs={6} lg={6} style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
              <FaWeight size={'1.5vw'} color={'rgba(0,0,0,.5)'} style={{marginRight:'.5vw'}}/>
              <Typography style={{fontFamily:'DMSans-Regular'}}>{data ? data.pokemon_v2_pokemon[0].weight/10 : ''} kg</Typography> 
            </Grid>

            <Divider orientation="vertical" flexItem style={{position:'relative'}} />

            <Grid item xs={5} lg={5} style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
              <FaRulerVertical size={'1.5vw'} color={'rgba(0,0,0,.5)'} style={{marginRight:'.5vw'}}/>
              <Typography style={{fontFamily:'DMSans-Regular'}}>{data ? data.pokemon_v2_pokemon[0].height/10 : ''} m</Typography> 
            </Grid>

            <Grid item xs={6} lg={6}>
              <Typography variant={'caption'} style={{fontFamily:'DMSans-Bold'}}>Weight</Typography>
            </Grid>
            <Grid item xs={6} lg={6}>
              <Typography variant={'caption'} style={{fontFamily:'DMSans-Bold'}}>Height</Typography>
            </Grid>
           </Grid>
          </Grid>
          <Grid item container xs={12} lg={12}>
            <Grid item xs={12} lg={12} style={{padding:'1vw'}}>
              <Typography variant='h6' style={{fontFamily:'DMSans-Medium'}} >Base Stats</Typography>
            </Grid>
            <Grid item container xs={12} lg={12}>
              {renderStats()}
            </Grid>
            
          </Grid>
         </Grid>

          </div> 
            {/* <Grid item container xs={12} lg={12}>
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
            </div> */}
        
        {/* </Grid> */}
    </div>

  )
}

export default PokemonCard