import React, {Component} from 'react';
import {
	View,
	Text
} from 'react-native';
import helper from 'assets/helper';

export default class Notch extends Component {
	render () {
		const {
			pos,
			data
		} = this.props;
		const radius = pos == 'top' ? {
			borderBottomLeftRadius:8,
			borderBottomRightRadius:8,
		} : {
			borderTopLeftRadius:8,
			borderTopRightRadius:8,
		};
		return (
			<View style={[radius, {padding:6,alignSelf:'center',backgroundColor:helper.primaryColor}]}>
			 <Text style={{fontWeight:'bold',color:helper.blk,fontSize:15}}>{data}</Text>
			</View>
		)
	}
}