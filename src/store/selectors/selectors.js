import { useSelector } from "react-redux"

export const useIsConnected = () => {
    debugger
    let connected = useSelector(state => state.system.Connected)
    return connected;
    //const count = useSelector(state => state.counter.count)
  }


export const getCurrentExpirienceName = (level) => {
  let expirienceName = "Никогда не играл в футбол";

  if (level == 0){
    expirienceName = "Никогда не играл в футбол";
  } 
  else if (level > 10 && level <= 20){
    expirienceName = "";
  }  
  else if (level > 20 && level <= 30){
    expirienceName = "";
  }  
  else if (level > 30 && level <= 40){
    expirienceName = "";
  }  
  else if (level > 40 && level <= 50){
    expirienceName = "";
  }  
  else if (level > 50 && level <= 60){
    expirienceName = "";
  }  
  else if (level > 60 && level <= 70){
    expirienceName = "";
  }  
  else if (level > 70 && level <= 80){
    expirienceName = "";
  }  
  else if (level > 80 && level <= 90){
    expirienceName = "";
  }  
  else if (level > 90 && level <= 95){
    expirienceName = "";
  }  
  else if (level > 95){
    expirienceName = "";
  }  

  return 
}