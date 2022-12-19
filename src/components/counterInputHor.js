import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	StyleSheet,
	Animated,
	Easing,
	ScrollView
} from 'react-native';
import {
  PanGestureHandler,
  TapGestureHandler,
  State
} from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import helper from 'assets/helper';
import Icon from 'components/icon';
import lang from 'assets/lang';
const tgCW = 100;
const tgItW = 50;
const tgcH = 25;
const rMx = 50;
const lMx = -50;
export default class CounterInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			panX:new Animated.Value(0),
			hasChange:false,
			list:helper.numList,
			value:0
		}
	}	
    _onPanGestureEvent = ({nativeEvent}) => {    	
    	 if(this.state.hasChange)return;
    	 if(nativeEvent.translationX > rMx){    	 
    	 	this.triggerI();
    	 	return;
    	 }
    	 if(nativeEvent.translationX < lMx){    	 
    	 	this.triggerD();
    	 	return;
    	 }    	 
    	 this.state.panX.setValue(nativeEvent.translationX);    	 
    }    
    normal = () => {    
    	Animated.timing(this.state.panX, {
				    toValue:0,
				    easing:Easing.elastic(1),
				    duration:500,
			        useNativeDriver:false
		}).start();
    }
    triggerI = () => {
    	this.normal();    
    	this.setState({
    		hasChange:true
    	});
    	let v = this.state.value;
    	let x = v == 0 ? 1 : (v + 1);
    	let len = this.state.list.length;
    	if((v + 2) == len){
    		let list = this.state.list;
    		for(let i = len; i < (len + 9); i++ )list.push(i);    		
    		this.setState({list});
    	}
    	x = tgItW * x;
    	v++;
    	if(v == this.props.maxLimit){
    		this.props.onMax();
    		return
    	}
    	this.setState({value:v}, () => {
    		this.props.onChange(v);
    	});
    	this.counterScroll.scrollTo({x, y:0, animated:true});
    }
    triggerD = () => {
    	this.normal();
    	this.setState({hasChange:true})
    	let v = this.state.value;    	
    	if(v == 0)return;v--;
    	let x = (tgItW * v);  	
    	this.setState({value:v}, () => {
    		this.props.onChange(v);
    	})
    	this.counterScroll.scrollTo({x:x, y:0, animated:true})
    }
	_onHandlerStateChange = ({nativeEvent}) => {
		if(nativeEvent.state == State.BEGAN){
			this.setState({hasChange:false})
		}else if(nativeEvent.state === State.END && !this.state.hasChange){
			this.normal();
		}
	}
	render() {
		const translateX = this.state.panX.interpolate({
			inputRange:[lMx, 0, rMx],
			outputRange:[0, 25, 50],
			extrapolate: 'clamp',
			useNativeDriver:true
		})
		const {
			style
		} = this.props;
		return (
			<View style={style}>
			<PanGestureHandler onGestureEvent={this._onPanGestureEvent} onHandlerStateChange={this._onHandlerStateChange}>
				 <View style={{width:tgCW,height:tgcH}}>
				  <Animated.View style={{width:tgItW, height:tgcH,elevation:10,backgroundColor:helper.primaryColor,borderRadius:10,transform:[
					  {translateX}
				  ]}}>	
				  <ScrollView scrollEnabled={false} horizontal snapToInterval={tgItW} gestureEnabled={false} ref={ref => this.counterScroll = ref}>
			       {this.state.list.map((item, index) => {
			       	return (
			       		<View key={index} style={{width:tgItW,height:'100%',justifyContent:'center',alignItems:'center'}}>
					        <Text style={{fontSize:16,color:'#fff',fontWeight:'bold'}}>{item}</Text>
					    </View>
			       	)
			       })}
			      </ScrollView>
				  </Animated.View>

				  <View style={{height:'100%',position:'absolute',justifyContent:'center',right:0}}>
				   <Icon name={lang.cvrgt} color={helper.primaryColor + 'b4'} size={18} />
				  </View>

				  <View style={{height:'100%',position:'absolute',justifyContent:'center',left:0}}>
				   <Icon name={lang.cvlft} color={helper.primaryColor + 'b4'} size={18} />
				  </View>

				 </View>
			</PanGestureHandler>			
			</View>
		)
	}
}

CounterInput.propTypes = {
	style:PropTypes.object,
	maxLimit:PropTypes.number
}

CounterInput.defaultProps = {
	style:{},
	maxLimit:50
}