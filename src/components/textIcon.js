import React, { Component} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	StyleSheet
} from 'react-native';
import helper from 'assets/helper';
import Icon from './icon';
export default class TextIcon extends Component {
	render() {
		const {name,size,color,numberOfLines,text,style} = this.props;
		const sz = size + 2;
		return (
			<View style={{flexDirection: 'row'}}>
			  <Icon name={name} size={sz} color={color} style={{marginTop:2}}/>
			  <Text style={[{fontSize:size,color:color,marginLeft:5}, style]} numberOfLines={numberOfLines}>{text}</Text>
			</View>
		)
	}
}

TextIcon.propTypes = {
	name:PropTypes.string,
	numberOfLines:PropTypes.number,
	color:PropTypes.string,
	text:PropTypes.string,
	size:PropTypes.number,
	style:PropTypes.object
}

TextIcon.defaultProps = {
	name:'home',
	numberOfLines:3,
	color:"#8d8d8d",
	size:14,
	text:'',
	style:{}
}