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

export const TYPE_COLOR = (type) => {
    var _tag;
    switch (type) {
        case "bug":
            _tag = "#A6B91A"
            
            break;
        case "dragon":
            _tag = "#6F35FC "
            
            break;
        case "fighting":
            _tag = "#C22E28"
            
            break;
        case "fire":
            _tag = "#EE8130"
            
            break;
        case "ghost":
            _tag = "#735797"
            
            break;
        case "grass":
            _tag = "#7AC74C"
            
            break;
        case "ground":
            _tag = "#E2BF65"
            break;
        case "ice":
            _tag = "#96D9D6"
            break;
        case "normal":
            _tag = "#A8A77A"
            break;
        case "poison":
            _tag = "#A33EA1"
            break;
        case "psychic":
            _tag = "#F95587"
            break;
        case "rock":
            _tag = "#B6A136"
            break;
        case "water":
            _tag = "#6390F0"
            break;
        case "electric":
            _tag = "#F7D02C"
            break;
        case "flying":
            _tag = "#A98FF3"
            break;
        case "fairy":
            _tag = "#D685AD"
            break;
    
        default:
            break;
    }
    return _tag
}
