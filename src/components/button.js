import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Text,TouchableOpacity} from 'react-native';
import helper from 'assets/helper';
import HeuButton from './HeuButton/';
export default class Button extends Component {
	render(){
		const {onPress,size,style,vr,hr,br,bgColor,color} = this.props;
		return (
			<HeuButton onPress={onPress} style={[{paddingVertical:vr,paddingHorizontal:hr,borderRadius:br,backgroundColor:bgColor}, style]}>
			 <Text numberOfLines={1} style={{fontSize:size,color,fontWeight:'bold'}}>{this.props.text}</Text>
			</HeuButton>
		)
	}
}

Button.defaultProps = {
	size:14,
	style:{},
	vr:4,
	br:7,
	hr:7,
	bgColor:helper.primaryColor,
	color:helper.white
}

Button.propTypes = {
	size:PropTypes.number,
	vr:PropTypes.number,
	hr:PropTypes.number,
	br:PropTypes.number,
	style:PropTypes.object,
	bgColor:PropTypes.string,
	color:PropTypes.string
}
