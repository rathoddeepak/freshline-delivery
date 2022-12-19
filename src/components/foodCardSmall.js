import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,	
	ScrollView
} from 'react-native';
import PropTypes from 'prop-types';
import helper from 'assets/helper';
import Icon from './icon';
import Image from './image';
import FoodRating from './foodRating'
import CounterInput from './counterInput';
export default class FoodCardSmall extends Component {
	render() {
		 const {
		   data,
		   onPress,
		   width,
		   imgSize,
		   fontSize,
		   hasRating,
		   backgroundColor,
		   cStyle
		} = this.props;	
		let sF = fontSize + 1;
		let nM = hasRating ? 1 : 2;
		return (			
			<View style={[s.item, cStyle, {width,backgroundColor}]}>
			  <View style={s.cntr}>
			   <Image
			    sty={{width:imgSize,height:imgSize,marginHorizontal:7}}
			    imgSty={{width:'100%',height:'100%'}}
			    borderRadius={100}
			    hash={data.hash}
			    source={{uri:helper.site_url + data.image}}
			   />			   
			   <View style={{width:'67%'}}>
			    <Text style={[s.tt, {fontSize:sF}]} numberOfLines={nM}>{data.name}</Text>
			     {hasRating ? <FoodRating 
				   verified={data.verified} 
				   rating={data.rating}		
				   fontSize={13}	   
				   style={{backgroundColor:'transparent',borderRadius:0,marginVertical:5,marginLeft:0}}
				 /> : null}
			    <Text style={[s.pr, {fontSize}]} numberOfLines={3}>{data.per_price} x {data.quantity} = ₹{data.price}</Text>
			   </View>
			  </View>
			  <Text style={[s.qq, {backgroundColor}]}>Quantity {data.quantity}</Text>
			</View>
		)
	}
}
FoodCardSmall.defaultProps = {
	width:"95%",
	imgSize:65,
	fontSize:13,
	hasRating:true,
	cStyle:{},
	backgroundColor:"#505050"
}
FoodCardSmall.propTypes = {
	width:PropTypes.any,
	cStyle:PropTypes.object,
	imgSize:PropTypes.number,
	fontSize:PropTypes.number,
	hasRating:PropTypes.bool,
	backgroundColor:PropTypes.string,
}
const s = StyleSheet.create({
	item:{alignSelf:"center",marginTop:15,borderRadius:10},		
	tt:{fontWeight:'bold',color:helper.silver,width:'80%'},	
	pr:{color:helper.silver,width:'95%'},
	qq:{paddingVertical:3,paddingHorizontal:5,color:helper.white,fontSize:12,fontWeight:'bold',position:'absolute',top:-14,right:5,borderTopLeftRadius:6,borderTopRightRadius:6},
	old:{textDecorationLine: 'line-through',color:helper.grey},
	cntr:{flexDirection: 'row',paddingVertical:5}
})