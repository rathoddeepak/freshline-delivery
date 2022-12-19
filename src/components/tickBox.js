import React, {Component} from 'react';
import {
	View
} from 'react-native';
import Icon from './icon';
import helper from 'assets/helper';
export default class TickBox extends Component {
	render () {
		const {
			active,
			size,
			activeColor,
			inactiveColor
		} = this.props;
		const c = active ? activeColor : inactiveColor;
		const s = size + 12;
		return (
			<View style={[style, {borderColor:c,width:s,height:s}]}>
		       <Icon name='check' color={c} size={size} />
		    </View>
		)
	}
}

TickBox.defaultProps = {
	active:false,
	size:16,
	activeColor:helper.green,
	inactiveColor:helper.grey1
}

const style = {justifyContent:'center',alignItems:'center',borderWidth:2,borderRadius:70};