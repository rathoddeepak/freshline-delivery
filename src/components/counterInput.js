import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	StyleSheet,
	Animated,
	Easing	
} from 'react-native';
import {
  ScrollView,
  PanGestureHandler,
  TapGestureHandler,
  State
} from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import helper from 'assets/helper';
import Icon from 'components/icon';
import lang from 'assets/lang';
const tgCW = 50;
const tgItW = 25;
const tgIX = 30;
const tgcH = 30;

const rMx = 25;
const lMx = -25;
export default class CounterInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			panX:new Animated.Value(0),
			hasChange:false,
			list:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			value:0
		}
	}	
    _onPanGestureEvent = ({nativeEvent}) => {    	
    	 if(this.state.hasChange)return;
    	 if(nativeEvent.translationY > rMx){    	 
    	 	this.triggerI();
    	 	return;
    	 }
    	 if(nativeEvent.translationY < lMx){    	 
    	 	this.triggerD();
    	 	return;
    	 }    	 
    	 this.state.panX.setValue(nativeEvent.translationY);    	 
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
    	x = tgIX * x;
    	v++;
    	if(v == this.props.maxLimit){
    		this.props.onMax();
    		return
    	}
    	this.setState({value:v}, () => {
    		this.props.onChange(v, 1);
    	});
    	this.counterScroll.scrollTo({x:0, y:x, animated:true});
    }
    directI = (v) => {    	
        this.setState({v});    	
    	let len = this.state.list.length;    	
    	if((v + 2) == len){
    		let list = this.state.list;
    		for(let i = len; i < (len + 9); i++ )list.push(i);    		
    		this.setState({list});
    	}
    	setTimeout(() => {
    		this.setState({value:v})
    		this.counterScroll.scrollTo({x:0, y:tgIX * v, animated:false});
    	})
    }
    triggerD = () => {
    	this.normal();
    	this.setState({hasChange:true})
    	let v = this.state.value;    	
    	if(v == 0)return;v--;
    	let x = (tgIX * v);  	
    	this.setState({value:v}, () => {
    		this.props.onChange(v, -1);
    	})
    	this.counterScroll.scrollTo({x:0, y:x, animated:true})
    }
	_onHandlerStateChange = ({nativeEvent}) => {
		if(nativeEvent.state == State.BEGAN){
			this.setState({hasChange:false})
		}else if(nativeEvent.state === State.END && !this.state.hasChange){
			this.normal();
		}
	}
	render() {
		const translateY = this.state.panX.interpolate({
			inputRange:[lMx, 0, rMx],
			outputRange:[-5, 10, 20],
			extrapolate: 'clamp',
			useNativeDriver:true
		})	
		const {
			style
		} = this.props;
		return (
			<View style={style}>
			<PanGestureHandler onGestureEvent={this._onPanGestureEvent} onHandlerStateChange={this._onHandlerStateChange}>
				 <View style={{width:25,height:50}}>
				  <Animated.View style={{width:tgItW, height:tgcH,elevation:10,backgroundColor:helper.primaryColor,borderRadius:10,transform:[
					  {translateY}
				  ]}}>	
				  <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={false} snapToInterval={tgIX} ref={ref => this.counterScroll = ref}>
			       {this.state.list.map((item, index) => {
			       	return (
			       		<View key={index} style={{width:'100%',height:tgIX,justifyContent:'center',alignItems:'center'}}>
					        <Text style={{fontSize:16,color:'#fff',fontWeight:'bold'}}>{item}</Text>
					    </View>
			       	)
			       })}
			      </ScrollView>
				  </Animated.View>

				  <View style={{width:'100%',position:'absolute',justifyContent:'center',top:-10,transform:[
				   {rotate:'-90deg'}
				  ]}}>
				   <Icon name={lang.cvrgt} color={helper.primaryColor + 'b4'} size={18} />
				  </View>

				  <View style={{width:'100%',position:'absolute',justifyContent:'center',bottom:-10,transform:[
				   {rotate:'90deg'}
				  ]}}>
				   <Icon name={lang.cvrgt} color={helper.primaryColor + 'b4'} size={18} />
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