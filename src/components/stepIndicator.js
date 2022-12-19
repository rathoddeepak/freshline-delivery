import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	Animated,
	StyleSheet
} from 'react-native';
import helper from 'assets/helper';
const stepWidth = 100;
export default class StepIndicator extends Component {
	constructor(props) {
		super(props);
		this.state = {
			stepAnim:new Animated.Value(this.props.step - 1)
		}
	}
	componentDidMount() {
	  Animated.timing(this.state.stepAnim, {
	  	toValue:this.props.step,
	  	duration:400,
	  	useNativeDriver:false
	  }).start();
	}
	render() {
		const {
			stepAnim
		} = this.state;
		const translateX0 = stepAnim.interpolate({
			inputRange:[1, 2],
			outputRange:[-100, 0],
			extrapolate:'clamp'
		});
		const translateX1 = stepAnim.interpolate({
			inputRange:[2, 3],
			outputRange:[-100, 0],
			extrapolate:'clamp'
		});

		const c1 = stepAnim.interpolate({
			inputRange:[0, 1],
			outputRange:[helper.grey2, helper.primaryColor],
			extrapolate: 'clamp'
		});
		const c2 = stepAnim.interpolate({
			inputRange:[0, 1, 2],
			outputRange:[helper.grey2, helper.grey2, helper.primaryColor],
			extrapolate: 'clamp'
		});
		const c3 = stepAnim.interpolate({
			inputRange:[0, 2, 3],
			outputRange:[helper.grey2, helper.grey2, helper.primaryColor],
			extrapolate: 'clamp'
		});
		return (
			<View style={{width:'100%',alignItems:'center'}}>
				<View style={s.cont}>

				 <Animated.View style={[s.crc, {backgroundColor:c1,zIndex:10}]}><Text style={s.txt}>1</Text></Animated.View>

				 <View style={s.line}>
				  <Animated.View style={[s.line, {backgroundColor:helper.primaryColor,transform:[{
				  	translateX:translateX0
				  }]}]} />
				 </View>

				 <Animated.View style={[s.crc, {backgroundColor:c2,zIndex:10}]}><Text style={s.txt}>2</Text></Animated.View>
				 
				 <View style={s.line}>
				  <Animated.View style={[s.line, {backgroundColor:helper.primaryColor,transform:[{
				  	translateX:translateX1
				  }]}]} />
				 </View>

				 <Animated.View style={[s.crc, {backgroundColor:c3}]}><Text style={s.txt}>3</Text></Animated.View>

				</View>
			</View>
		)
	}
}

const s = StyleSheet.create({
	cont:{flexDirection:'row',alignItems:'center',marginVertical:20,overflow:'hidden'},
	crc:{width:40,height:40,borderRadius:80,justifyContent:'center',alignItems:'center'},
	line:{height:3,backgroundColor:helper.grey2,width:100,overflow:'hidden'},
	txt:{fontWeight:'bold',fontSize:16,color:'#fff'},
})