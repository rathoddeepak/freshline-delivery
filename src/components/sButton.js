import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Pressable
} from 'react-native';
import PropTypes from 'prop-types';
import helper from 'assets/helper';
import Animated, {Easing} from 'react-native-reanimated';
const MX = 1.8;
export default class SButton extends Component {
	constructor(props) {
		super(props);
		this.state = {
			scale:new Animated.Value(0),
			selected:false
		}
	}
	onPress = () => {
		var s = this.state.selected ? 0 : MX;
		if(this.props.toggle == false && s == 0)return;		
		this.setState({
			selected:!this.state.selected
		});
		Animated.timing(this.state.scale, {
			toValue:s,
			duration:300,
			easing:Easing.inOut(Easing.ease)
		}).start();
		this.props.onPress(s != 0)
	}
	act = (select) => {		
		if(select == this.state.selected)return;
		let s = select ? MX : 0;
		Animated.timing(this.state.scale, {
			toValue:s,
			duration:300,
			easing:Easing.inOut(Easing.ease)
		}).start();
		this.setState({
			selected:!this.state.selected
		})
	}	
	render() {
	  const scale = this.state.scale;
	  const {
	  	text,
	  	style,
	  	minWidth,
		maxWidth,
		height
	  } = this.props;
	  return (
	  	<Pressable style={[s.button, style, {
	  		minWidth,
			maxWidth,
			height
	  	}]} onPress={this.onPress}>
	  	 <Text numberOfLines={1} style={s.text}>{text}</Text>
	  	 <Animated.View style={[s.bg, {
	  	 	transform:[
	  	 	 {scale}
	  	 	]
	  	 }]} />
	  	</Pressable>
	  )
	}
}
SButton.defaultProps = {
	text:'',
	style:{},
	minWidth:90,
	maxWidth:140,
	height:34
}
SButton.propTypes = {
	text:PropTypes.style,
	style:PropTypes.object,
	minWidth:PropTypes.number,
	maxWidth:PropTypes.number,
	height:PropTypes.number
}
const s = StyleSheet.create({
	button: {		
		justifyContent: 'center',
		borderWidth:1,
		borderColor:helper.primaryColor,
		borderRadius:5,
		overflow:'hidden'
	},
	bg:{
	 width:70,
	 height:22,
	 borderRadius:100,
	 backgroundColor:'white',
	 position:'absolute'
	},
	text:{
		fontWeight:'bold',
		fontSize:16,
		textAlign:'center',
		zIndex:1000,
		marginHorizontal:5,
		color:helper.primaryColor
	}
})