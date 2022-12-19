import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View
} from 'react-native';

export default class FoodNot extends Component {
	render() {
		const {
			size,
			veg,
			top,
			left,
			right,
			bottom,
			position
		} = this.props;
		const extra = {};
		if(top > 0){extra['top'] = top}
		if(left > 0){extra['left'] = left}
		if(right > 0){extra['right'] = right}
		if(bottom > 0){extra['bottom'] = bottom}
		const color = parseInt(veg) == 0 ? '#007c01' : '#cd0000';
	    const size2 = size - 8;
		return (
			<View style={[{width:size,position,borderRadius:2,justifyContent:'center',alignItems:'center',height:size, backgroundColor:'white', borderWidth:2.4,borderColor:color}, extra]}>
			 <View style={{borderRadius:100,width:size2,height:size2,backgroundColor:color}} />
			</View>
		)
	}
}

FoodNot.propTypes = {
	size:PropTypes.number,
	veg:PropTypes.any,
	position:PropTypes.string,
	top:PropTypes.number,
	left:PropTypes.number,
	right:PropTypes.number,
	bottom:PropTypes.number
}

FoodNot.defaultProps = {
	size:20,
	veg:0,
	top:0,
	position:'absolute',
	left:0,
	right:0,
	bottom:0
}