import React, {Component} from 'react';
import {
	View,
	Text
} from 'react-native';
import helper from 'assets/helper';
import Notch from './notch';

export default class DataNotch extends Component {
	constructor(props){
		super(props)
		this.state = {
			text:'/ODR: ₹40 | BNS: ₹20'
		}
	}
	render(){
		const {text} = this.state;
		return <Notch data={text} pos='top' />
	}
}