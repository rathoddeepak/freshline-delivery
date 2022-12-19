import React, {Component} from 'react';
import {
	View,
	Text,
	Image,
	Animated,
	Pressable,
	Dimensions,
	PanResponder
} from 'react-native';
import helper from 'assets/helper';
const {width} = Dimensions.get('window');
const greenColor = 'rgba(14, 189, 52, 1)';
export default class SingleSlider extends Component {
	constructor(props){
		super(props)
		this.state = {
			blockTouch:false
		}		
		this.panX = new Animated.Value(0)
		this.animation  = null
	}
	startAnim = () => {
		this.animation = Animated.timing(this.panX, {
			toValue:10,
			duration:2500,
			useNativeDriver:false
		});
		this.animation.start();
	}
	animEnd = () => {
		if(this.state.blockTouch){
			return
		}
		if(this.animation != null){
			this.animation.stop();
		}
		setTimeout(() => {
			Animated.timing(this.panX, {
				toValue:0,
				duration:400,
				useNativeDriver:false
			}).start();
		}, 100);		
	}
	hitAccept = () => {
	    this.props?.updating();
		this.setState({blockTouch:true})
	}	
	render () {
		const translateX = this.panX.interpolate({
			inputRange:[0, 10],
			outputRange:[-width, 0],
			extrapolate:'clamp'
		})
		const backgroundColor = this.panX.interpolate({
			inputRange:[0, 10],
			outputRange:['rgba(0, 0, 0, 1)', greenColor],
			extrapolate:'clamp'
		});
		const color = this.panX.interpolate({
			inputRange:[0, 10],
			outputRange:[helper.silver,helper.blk],
			extrapolate:'clamp'
		});	
		const {			
			busy,
			sts
		} = this.props;
		const {
			blockTouch
		} = this.state;
		const pointerEvents = busy ? undefined : 'none';		
		return (
			<Animated.View style={{height:70,width:'100%',backgroundColor}}>
		      <Pressable
		        onPressIn={this.startAnim}
		        onPressOut={this.animEnd}
		        onLongPress={this.hitAccept}
		        disabled={blockTouch}
		        delayLongPress={2500} style={{flex:1,justifyContent:'center',alignItems:'center'}}>
		       <Animated.Text style={{color,fontSize:15,fontWeight:'bold'}}>Accept Task</Animated.Text>
		      </Pressable>
		      <Animated.View style={{height:2,width,transform:[{translateX}],backgroundColor:helper.white,position:'absolute',top:0,left:0}} />
			</Animated.View>
		)
	}
}