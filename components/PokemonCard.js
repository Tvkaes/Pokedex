import React,{useState} from 'react'
import { Typography,Grid,Paper,Divider } from '@mui/material'
import Image from "next/image";
import { GET_DESCRIPTION } from '../querys/pokemon';
import { useQuery } from '@apollo/client';
import styles from '../styles/pokedex.module.css'
import { POKEMON_TYPE } from "../helpers/typeIcon"; 
import {FaWeight} from 'react-icons/fa';
import {FaRulerVertical}  from 'react-icons/fa'
import ProgressBar from 'react-percent-bar';
import { TYPE_COLOR } from '../helpers/typeIcon';



function PokemonCard({id,type,getColors,info}) {


  const {data,error,loading}=useQuery(GET_DESCRIPTION,{
    variables:{
      id:id
    }
  })



   function Percent(info) {
    var max = 255;
    var min = info;
    var maxPercent = 100;
    var totalPercent
    if(info){
     
       totalPercent = (min*maxPercent)/max
    }
    
    return totalPercent
 
   }

   function renderStats() {
    if(info){
     return info.pokemon_v2_pokemon.map(array=>{
       return array.pokemon_v2_pokemonstats.map(stats=>{
          return (
            <Grid item xs={12} lg={12} style={{display:'flex',justifyContent:'space-between'}} key={stats.pokemon_v2_stat ? stats.pokemon_v2_stat.name : ''}>
                <Typography style={{fontFamily:'DMSans-Regular',marginLeft:'2vw'}}>{stats.pokemon_v2_stat ? stats.pokemon_v2_stat.name : '' }</Typography>
                <ProgressBar percent={Percent(stats.base_stat)} width="50%"  fillColor= {getColor()}></ProgressBar>
              </Grid>
          )
        })
      })
    }
    
   }

   function getColor() {
    
    if(type){
     return info.pokemon_v2_pokemon.map(base=>{
      getColors(base.pokemon_v2_pokemontypes[0].pokemon_v2_type.name)
      return TYPE_COLOR(base.pokemon_v2_pokemontypes[0].pokemon_v2_type.name)
     
      })
    }else{
      getColors("default")
      return TYPE_COLOR("default")
    }
   }




 
    
  return (
 
   <div className={styles.neo}>
        {/* Upp */}
          <div className={styles.containerUp} style={{backgroundColor:getColor()}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <Typography style={{fontFamily:'DMSans-Bold',marginLeft:'1vw',marginTop:'1vw'}} variant={'h6'} >{info ? info.pokemon_v2_pokemon ? info.pokemon_v2_pokemon[0].name : '' : '' }</Typography>
            <Typography style={{fontFamily:'DMSans-Bold',marginRight:'1vw',marginTop:'1vw'}} >{`#${id ? id : ''}`}</Typography>
            </div>
            <div align={'center'} > 
            {id ? 
           <Image 
           height='150vw' 
           width='150vw' 
           alt="sprite" 
           style={{zIndex:1}}
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}/>
          :
          <Image 
           height='130vw' 
           width='130vw' 
           alt="sprite" 
           style={{zIndex:1}}
          src={`https://static.wikia.nocookie.net/pokemon/images/8/87/Poké_Ball.png/revision/latest?cb=20200918005128`}/>
          }
          </div>
          
          </div>
        {/* Down */}
          <div className={styles.containerDown} >
         <Grid container>
          <Grid item xs={12} lg={12} style={{padding:'1vw'}} >
          {type ? type.map(type=>{
             return POKEMON_TYPE(type.pokemon_v2_type.name)
            }):"Type in the search bar to begin"}
          </Grid>
          <Grid item container lg={12} xs={12} style={{padding:'.1vw'}}>

           <Grid item xs={12} lg={12} >
           <Typography variant={'h6'} style={{fontFamily:'DMSans-Medium'}}>About</Typography>
           
           </Grid>

           <Grid item container xs={12} lg={12} style={{width:'100%'}}>
            <Grid item xs={6} lg={6} style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
              <FaWeight size={'1.5vw'} color={'rgba(0,0,0,.5)'} style={{marginRight:'.5vw'}}/>
              <Typography style={{fontFamily:'DMSans-Regular'}}>{info ? info.pokemon_v2_pokemon[0].weight/10 : ''} kg</Typography> 
            </Grid>

            <Divider orientation="vertical" flexItem style={{position:'relative'}} />

            <Grid item xs={5} lg={5} style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
              <FaRulerVertical size={'1.5vw'} color={'rgba(0,0,0,.5)'} style={{marginRight:'.5vw'}}/>
              <Typography style={{fontFamily:'DMSans-Regular'}}>{info ? info.pokemon_v2_pokemon[0].height/10 : ''} m</Typography> 
            </Grid>

            <Grid item xs={6} lg={6}>
              <Typography variant={'caption'} style={{fontFamily:'DMSans-Bold'}}>Weight</Typography>
            </Grid>
            <Grid item xs={6} lg={6}>
              <Typography variant={'caption'} style={{fontFamily:'DMSans-Bold'}}>Height</Typography>
            </Grid>
            <Typography variant='caption' style={{fontFamily:'DMSans-Regular',marginTop:'1vw'}}>
                {data ? 
                  data.pokemon_v2_pokemonspeciesflavortext ?
                  data.pokemon_v2_pokemonspeciesflavortext[0].flavor_text.replace(''," ") : '' : '' }
              </Typography>
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
           
    </div>

  )
}

export default PokemonCard