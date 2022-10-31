import React,{useState,useEffect}  from "react";
import { Typography,Grid,List, ListItemIcon, TextField, InputBase } from "@mui/material";
import NameList from "../components/NameList";

 
import PokemonCard from "../components/PokemonCard";

import {FaSearch} from "react-icons/fa";
import { TYPE_COLOR } from "../helpers/typeIcon";







const Pokedex =()=>{

    const [selected,setSelected]=useState()
    const [type,getType] = useState()
    const [info,setInfo] =useState()
    const [ color,getColors] =useState()

   
  


 
  
    return(

        <div style={{height:'100vw',width:'100vw',zIndex:0}}>
           
            <Grid container style={{height:'100%',width:'100%'}}>
                <Grid item container xs={12} lg={12} >
                   
                    <Grid item xs={6} lg={6} >
                      <div style={{padding:'6vw',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <PokemonCard id={selected} type={type ? type : null} getColors={getColors}></PokemonCard>
                      </div>
                    </Grid>

                    <Grid item xs={6} lg={6}>
                        <div  style={{padding:'6.5vw',alignItems:'center',justifyContent:'center',}}>
                            <Grid item container xs={12} lg={12}>
                                <Grid item xs={12} lg={12} align='center'>
                                <Typography variant={'h3'} style={{fontFamily:'DMSans-Bold'}}>Welcome to PokemonDex</Typography>
                                <Typography variant={'caption'} style={{fontFamily:'DMSans-Regular'}}>You can search all the first generation of pokemons!</Typography>
                                </Grid>
                                <Grid item xs={12} lg={12} style={{marginTop:'2vw'}}>
                                    <div className={'neo'} style={{padding:5,border:2,borderStyle:'solid',borderColor:TYPE_COLOR(color),display:'flex',alignItems:'center'}} >
                                    <FaSearch style={{marginLeft:'1vw'}} color={'rgba(0,0,0,0.6)'}/>
                                    <InputBase  sx={{ ml: 1, flex: 1 }}></InputBase>
                                    </div>
                                    
                                </Grid>
                            </Grid>
                        <NameList setSelected={setSelected} getType={getType} setInfo={setInfo}></NameList> 
                        </div>
                    </Grid>

                </Grid>
            </Grid>
            
        </div>
    )
}

export default Pokedex;