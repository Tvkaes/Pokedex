import React,{useState,useEffect}  from "react";
import { Typography,Grid,List, ListItemIcon, TextField, InputBase, Button } from "@mui/material";
import NameList from "../components/NameList";
import PokemonCard from "../components/PokemonCard";
import { GET_POKEMON_BY_NAME } from "../querys/pokemon";
import {FaSearch} from "react-icons/fa";
import { TYPE_COLOR } from "../helpers/typeIcon";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_DESCRIPTION } from "../querys/pokemon";


const Pokedex =()=>{

    const [selected,setSelected]=useState()
    const [type,getType] = useState()
    const [info,setInfo] =useState()
    const [ color,getColors] =useState()
    const [id,setID]=useState()
    const [description,setDescription]= useState()

    const [getPokemon,{data,error,loading}] =useLazyQuery(GET_POKEMON_BY_NAME)
   
    console.log(description)
    console.log(data ? data : "")


    const handleSearch = ()=>{
        getPokemon({
            variables:{
                name: selected
            }
        }).then((res)=>{
            if(res.data != undefined){
                setInfo(res.data)
                setID(res.data.pokemon_v2_pokemon[0].id)
                getType(res.data.pokemon_v2_pokemon[0].pokemon_v2_pokemontypes)
            }
           
        })
    }
   
    return(

        <div style={{height:'100vw',width:'100vw',zIndex:0}}>
           
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
                                  <InputBase fullWidth  sx={{ ml: 1, flex: 1 }} onBlur={(e)=>{setSelected(e.target.value)}}></InputBase>
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