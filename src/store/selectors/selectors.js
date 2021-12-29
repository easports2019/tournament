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
    expirienceName = "Новичок. Никогда не играл ранее";
  } 
  else if (level > 10 && level <= 20){
    expirienceName = "Новичок. Только начинаю играть";
  }  
  else if (level > 20 && level <= 30){
    expirienceName = "Новичок. Не испорчу игру начинающим командам";
  }  
  else if (level > 30 && level <= 40){
    expirienceName = "Любитель. Выхожу на замену в матчах городских турниров";
  }  
  else if (level > 40 && level <= 50){
    expirienceName = "Любитель. Первые успехи, подаю надежды";
  }  
  else if (level > 50 && level <= 60){
    expirienceName = "Любитель. Востребован у команд региона";
  }  
  else if (level > 60 && level <= 70){
    expirienceName = "Любитель. Средний уровень игры для большинства команд региона";
  }  
  else if (level > 70 && level <= 80){
    expirienceName = "Любитель. Регулярный выход в основном составе большинства команд региона";
  }  
  else if (level > 80 && level <= 90){
    expirienceName = "Любитель. Регулярный выход в основном составе ТОП-команд региона";
  }  
  else if (level > 90 && level <= 95){
    expirienceName = "Полупрофессионал, опыт игр на межрегиональном уровне";
  }  
  else if (level > 95){
    expirienceName = "Профессиональный футболист с действующим контрактом";
  }  

  return expirienceName;
}