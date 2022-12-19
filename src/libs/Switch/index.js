import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {requireNativeComponent, NativeEventEmitter, View} from 'react-native';
import helper from 'assets/helper';
const BubbleSwitch = requireNativeComponent('BubbleSwitch');

export default class RippleSwitch extends Component {
	constructor(props){
		super(props)
		this.state = {
			checked:false,
			current:false,
			visible:false
		}
	}

	isChecked = () => {
		return this.state.current;
	}

	checked = (checked) => {		
		this.setState({checked,current:checked,visible:true})
	}

	_onChecked = () => {		
		let current = !this.state.current;
		this.setState({current}, () => {
			this.props.onChange(current)
		})
	}

	render(){
		const {
			activeColor,
			inactiveColor,
			style
		} = this.props;
		if(this.state.visible == false){
			return (<View />)
		}else{
			return (
				<BubbleSwitch
				 activeColor={activeColor}
				 inactiveColor={inactiveColor}
				 style={style}
				 onChecked={this._onChecked}
				 checked={this.state.checked}
				/>
			)
		}		
	}
}

RippleSwitch.defaultProps = {
	activeColor:helper.primaryColor,
	inactiveColor:helper.grey,
	checked:false
}

RippleSwitch.propTypes = {
	activeColor:PropTypes.string,
	inactiveColor:PropTypes.string,
	checked:PropTypes.bool
}
