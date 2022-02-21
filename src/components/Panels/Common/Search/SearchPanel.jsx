import { Button, Cell, Footer, Group, PanelHeader, RichCell, Search } from '@vkontakte/vkui';
import React, { useState , useEffect } from 'react'
import { setSelectedTeam } from '../../../../store/teamsReducer';


  let SimpleSearch = (props) => {
    let [searchWord, setSearchWord] = useState("")
    let [resultArray, setResultArray] = useState([])

    useEffect(() => {
        setResultArray(props.List);
    },[props.List])
  
    let onChange = (e) => {
      setSearchWord( e.target.value );

      let search = e.target.value.toLowerCase();
      setResultArray(
          props.List.filter(
              (team) => team.Name.toLowerCase().indexOf(search) > -1
              )
      );
    }

    
  

      return (
        <>
          <>
            <Search
              value={searchWord}
              onChange={onChange}
              after={null}
            />
            {resultArray.length > 0 &&
              resultArray.map((item) => (
                <RichCell after={<Button onClick={() => props.ActionOnSelect(item.Id)}>Выбрать</Button>}>{item.Name}</RichCell>
              ))}
            {resultArray.length === 0 && <Footer>Ничего не найдено</Footer>}
          </>
        </>
      );
    
  }
  
  
//   const AdaptivitySearch = withPlatform(
//     withAdaptivity(SearchExample, { sizeX: true })
//   );
  
export default SimpleSearch