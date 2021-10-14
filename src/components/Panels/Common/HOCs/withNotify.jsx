import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {pushToHistory, popFromHistory, goToPanel, setCurrentModalWindow} from '../../../../store/systemReducer'
import ModalCommon from '../../../Modals/ModalCommon/ModalCommon'


/*
isBack={false} - флаг возврата на предыдущую панель
toMenuName="viewcollect"  - куда переход (имя из id в View на главной странице в Epic на главной странице (также должно быть в mainMenuReducer в списке менюшек))
item = {itm} - объект, передаваемый в параметр handleClick
handleClick = {selectCollect} - функция, выполняемая по клику
*/


export const withNotify = (WrappedComponent) => {
    
    const mapStateToProps = state => ({
        history: state.system.history,
    })
    
    const mapDispatchToProps = {
        goToPanel, setCurrentModalWindow
    }

    class hocComponent extends React.Component{
        constructor(props){
            super(props);
            this.clickEvent = this.clickEvent.bind(this);
            this.AcceptAndClose = this.AcceptAndClose.bind(this);

        }

        AcceptAndClose(){
            this.props.Yes();
            this.props.setCurrentModalWindow(null);
        }

        clickEvent(evt){
            // тут выводим окошко с вопросом (уверен?), если да, то делаем действие, переданное в хэндлере
            if (this.props.handleClick != undefined && this.props.item != undefined)
                this.props.handleClick(this.props.item);
            else if (this.props.handleClick != undefined && this.props.item == undefined)
                this.props.handleClick();
                
            this.props.setCurrentModalWindow(<ModalCommon 
                modalName="AreYouSure" 
                //Message={this.props.Message} 
                data={{ message: this.props.Message }}
                Close={() => this.props.setCurrentModalWindow(null)}
                Accept={this.AcceptAndClose}
                ></ModalCommon>);
            //this.props.goToPanel(this.props.toMenuName, this.props.isBack);
        }

        componentDidUpdate(prevProps, prevState){
            
        }


        render(){
            
            return <WrappedComponent onClick={this.clickEvent} {...this.props}></WrappedComponent>
            
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(hocComponent)
}
