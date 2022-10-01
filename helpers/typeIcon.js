import { Chip } from "@mui/material";
import styles from "../styles/Type.module.css"

export const POKEMON_TYPE = (type)=>{
   
   var _tag;
    switch (type) {
        case "bug":
            _tag = <Chip key={type}  label={type}  className={styles.bug}></Chip>
            break;
        case "dragon":
            _tag = <Chip  key={type} label={type}  className={styles.dragon}></Chip>
            
            break;
        case "fighting":
            _tag = <Chip  key={type}  label={type}  className={styles.fighting}></Chip>
            
            break;
        case "fire":
            _tag = <Chip  key={type}  label={type}  className={styles.fire}></Chip>
            
            break;
        case "ghost":
            _tag = <Chip  key={type}label={type}  className={styles.ghost}></Chip>
            
            break;
        case "grass":
            _tag =<Chip  key={type}label={type}  className={styles.grass}></Chip>
            
            break;
        case "ground":
            _tag = <Chip  key={type}label={type}  className={styles.ground}></Chip>
            break;
        case "ice":
            _tag = <Chip  key={type} label={type}  className={styles.ice}></Chip>
            break;
        case "normal":
            _tag = <Chip  key={type}label={type}  className={styles.normal}></Chip>
            break;
        case "poison":
            _tag = <Chip  key={type}label={type}  className={styles.poison}></Chip>
            break;
        case "psychic":
            _tag =<Chip  key={type}label={type}  className={styles.psychic}></Chip>
            break;
        case "rock":
            _tag = <Chip  key={type}label={type}  className={styles.rock}></Chip>
            break;
        case "water":
            _tag = <Chip  key={type}label={type}  className={styles.water}></Chip>
            break;
        case "electric":
            _tag = <Chip  key={type}label={type}  className={styles.electric}></Chip>
            break;
        case "flying":
            _tag = <Chip  key={type}label={type}  className={styles.flying}></Chip>
            break;
        case "fairy":
            _tag = <Chip  key={type}label={type}  className={styles.fairy}></Chip>
            break;
    
        default:
            break;
    }
    return <span>{_tag}</span>
}