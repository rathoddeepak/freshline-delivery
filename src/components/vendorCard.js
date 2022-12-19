import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	StyleSheet
} from 'react-native';
import helper from 'assets/helper';
import Image from './image';
import HeuButton from './HeuButton/';
import RstrntRating from './rstrntRating';
export default class VendorCard extends Component {
	render() {
		const {
			item,
			onPress
		} = this.props;
		return (
			<View style={{width:'100%'}}>
			<HeuButton style={s.rsntChip} onPress={onPress}>
				<View style={{width:'30%',justifyContent:'center',height:100,alignItems:'center'}}>
					<Image 
					 sty={{width:80,height:80}}
					 borderRadius={100}
					 imgSty={{width:80,height:80}}
					 source={{uri:item.cover}} />
					</View>
					<View style={{width:'70%',padding:10}}>
					<Text numberOfLines={2} style={s.tt2}>{item.name}</Text>
					{item.about?.length ? <Text numberOfLines={2} style={{fontSize:12,color:helper.grey,width:'90%'}}>{item.about}</Text> : null}
					<Text style={{fontSize:12,color:helper.grey}}>{item.dr} km Away From You</Text>
				</View>
			    <RstrntRating verified={item.verified} rating={item.rating} style={{position: 'absolute',top:5,right:5}}/>
			</HeuButton>
			</View>
		)
	}
}

const s = StyleSheet.create({
	tt2:{fontSize:14,color:helper.silver,fontWeight:'bold',marginVertical:3,width:"60%"},
	rsntChip:{width:"97%",alignSelf:"center",marginVertical:5,padding:2,backgroundColor:helper.grey4,borderRadius:5,flexDirection:"row"}
})