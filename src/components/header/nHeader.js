import React, { Component } from 'react';
import {
	View,
	Text
} from 'react-native';
import PropTypes from 'prop-types';
import HeuButton from '../HeuButton/';
import Icon from '../icon';
import helper from 'assets/helper';
import lang from 'assets/lang';
export default class NHeader extends Component {	
	render() {
		const {
			title,
			color,
			fontSize,
			onPressBack
		} = this.props;
		return (
			<View style={{flexDirection: 'row',height:50,width:'100%',backgroundColor:'black',elevation:10}}>
			 <HeuButton onPress={onPressBack} style={{height:50,width:50,justifyContent:'center',alignItems:'center'}}>
			  <Icon name={lang.arwbck} color={color} size={28} />
			 </HeuButton>
			 <View style={{height:50,justifyContent:'center',maxWidth:250}}>
			  <Text numberOfLines={1} style={{fontSize,fontWeight:'bold',color}}>{title}</Text>
			 </View>
			</View>
		)
	}
}

NHeader.defaultProps = {
	color:helper.primaryColor,
	fontSize:18
}

NHeader.propTypes = {
	color:PropTypes.string,
	fontSize:PropTypes.number
}