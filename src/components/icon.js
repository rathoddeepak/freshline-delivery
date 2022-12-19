import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Image
} from 'react-native';
import helper from 'assets/helper';
import lang from 'assets/lang';
const loc = 'assets/icons/'
export default class Icon extends Component {
	render() {
		const {name,size,color,style,resizeMode} = this.props;
		switch (name){
			case 'history':
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'history.png')} tintColor={color} />);
			case 'close':
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'close.png')} tintColor={color} />);
			case 'notify':
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'notify.png')} tintColor={color} />);
			case 'user':
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'user.png')} tintColor={color} />);			

			case 'chv_up':
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'chv_up.png')} tintColor={color} />);
			case 'cash':			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'cash.png')} tintColor={color} />);
			case 'paytm':			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'paytm.png')} tintColor={color} />);
			case 'gpay':			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'gpay.png')} tintColor={color} />);
			case 'phonepe':			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'phonepe.png')} tintColor={color} />);

			case 'receipt':			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'receipt.png')} tintColor={color} />);
			case 'shutdown':			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'shutdown.png')} tintColor={color} />);
			case 'menu':			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'menu.png')} tintColor={color} />);
			case 'happy':			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'happy.png')} tintColor={color} />);
			case lang.home:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'home.png')} tintColor={color} />);
			case lang.srch:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'search.png')} tintColor={color} />);
			case lang.bskt:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'basket.png')} tintColor={color} />);
			case lang.table:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'table.png')} tintColor={color} />);
			case lang.ph:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'phone.png')} tintColor={color} />);
			case lang.lgt:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'logout.png')} tintColor={color} />);
			case lang.plate:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'plate.png')} tintColor={color} />);
			case lang.meal:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'meal.png')} tintColor={color} />);			
			case lang.rcnt:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'recent.png')} tintColor={color} />);
			case lang.trh:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'trash.png')} tintColor={color} />);
			case lang.drt:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'direction.png')} tintColor={color} />);
			case lang.stt:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'stat.png')} tintColor={color} />);
			
			case lang.user:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'user.png')} tintColor={color} />);
			case lang.clk:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'clock.png')} tintColor={color} />);
			case lang.bell:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'bell.png')} tintColor={color} />);
			case lang.pin:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'pin.png')} tintColor={color} />);
			case lang.vrfd:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'verified.png')} tintColor={color} />);
			case lang.str:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'star.png')} tintColor={color} />);
			case lang.chk:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'check.png')} tintColor={color} />);
			case lang.arwbck:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'left_arrow.png')} tintColor={color} />);
			case lang.arwfrw:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'right_arrow.png')} tintColor={color} />);
			case lang.rty:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'retry.png')} tintColor={color} />);
			case lang.fltr:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'filter.png')} tintColor={color} />);
			case lang.cvrgt:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'cvright.png')} tintColor={color} />);
			case lang.cvlft:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'cvleft.png')} tintColor={color} />);
			case lang.ms:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'mess.png')} tintColor={color} />);
			case lang.cvd:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'chv_dwn.png')} tintColor={color} />);
			case lang.pry:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'pray.png')} tintColor={color} />);
			default:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'home.png')} tintColor={color} />);
		}
	}
}

Icon.defaultProps = {
	name:'home',
	size:22,
	color:helper.white,
	style:{},
	resizeMode:'center'
}
Icon.propTypes = {
	name:PropTypes.string,
	size:PropTypes.number,
	color:PropTypes.string,
	style:PropTypes.object,
	resizeMode:PropTypes.string,
}