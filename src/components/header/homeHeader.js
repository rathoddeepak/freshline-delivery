import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	Image,
	StyleSheet,
	Pressable
} from 'react-native';
import Icon from '../icon';
import helper from 'assets/helper';
import store from 'assets/store';
import lang from 'assets/lang';
export default class HomeHeader extends Component {
	render() {
		return (
			<View style={s.header}>
			 <View style={s.logoHolder}>
				 <Text style={s.tl}>Clufter</Text>
			 </View>

			 
	             <View style={s.textInput}>
	               <View style={s.icnH}>
	                 <Icon name={lang.srch} color={helper.silver} size={22} />
	               </View>
	               <View style={s.txH}>
	                  <Text	                    
	                    style={s.txI}                	                    
	                  >Search</Text>
	                </View>
	             </View>
	          

			 <View style={s.lastHold}>			
			  <Pressable>
			   <Icon name={lang.bskt} size={30} color={helper.grey} />
			  </Pressable>
			 </View>

			</View>
		)
	}
}

const s = StyleSheet.create({
	header:{
		height:55,
		width:'100%',
		backgroundColor:'#000',	
		elevation:10,
		justifyContent:'center'
	},
	tl:{
		fontFamily:'cursive',
	    color:helper.primaryColor,
	    fontSize:30,
	    fontWeight:'bold'
	},
	logoHolder:{
		height:'100%',
		justifyContent:'center',
		alignItems:'center',
		position:'absolute',
		marginLeft:8		
	},
	logo:{
		width:140,
		height:40,
		marginLeft:7
	},
	lastHold:{
		position:'absolute',
		right:0,
		width:50,
		height:'90%',
		justifyContent:'center',			
		alignItems:'center'
	},
	icon:{
		width:30,
		height:30
	},
	textInput:{
		backgroundColor:helper.grey4,
		borderRadius:10,
		height:34,
		width:'50%',
		right:60,		
		position:'absolute',
		top:12,
		alignSelf:'center',
		justifyContent:'center',
		flexDirection:'row'
	},
	icnH:{
		height:'100%',
		justifyContent:'center',
		alignItems:'center',
		width:'20%'		
	},
	txI:{color:helper.grey,height:'90%',padding:7,width:'100%',fontSize:14},
	txH:{
		height:'100%',
		justifyContent:'center',
		width:'80%'
	}	
})