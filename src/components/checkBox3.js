import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Pressable,
	View,
	Animated
} from 'react-native';
import Icon from './icon';
import lang from 'assets/lang';
import helper from 'assets/helper';
export default class Checkbox3 extends Component {	
	constructor(props){
		super(props);
		this.state = {			
			checked:false
		}		
	}
	componentDidMount() {
		let checked = this.props.checked;
		this.setState({checked})
	}
	onChange = () => {
		let checked = !this.state.checked;
		this.setState({checked}, () => {
			this.props.onChange(checked);
		})		
	}
	render() {
		const {
			size,			
			iconSize,
			activeColor,
			inactiveColor
		} = this.props;		
		const checked = this.state.checked;
		const color = checked ? activeColor : inactiveColor;
		return (
			<Pressable onPress={this.onChange}><Animated.View style={{width:size,height:size,borderWidth:2,justifyContent:'center',alignItems:'center',borderRadius:4,borderColor:color}}>
			 {checked ? <Icon size={iconSize} name={lang.chk} color={color} /> : null}
			</Animated.View></Pressable>
		)
	}
}

Checkbox3.defaultProps = {
	size:28,
	iconSize:23,
	checked:false,
	activeColor:helper.primaryColor,
	inactiveColor:helper.grey1
}