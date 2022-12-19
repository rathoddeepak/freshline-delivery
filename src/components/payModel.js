import React, {Component} from 'react';
import {
	View,
	Text,
	Modal,
	Image,
	StyleSheet,
	TouchableOpacity
} from 'react-native';
import helper from 'assets/helper';
import Icon from './icon';
export default class PayModel extends Component {
	constructor(props){
		super(props)
		this.state = {
			v:false,
			currentIdx:-1,
			payModes:[
			 {
			 	name:'Cash',
			 	icon:'cash',
			 	color:'default',
			 	code:helper.CASH,
			 	qr:false
			 }
			]
		}
		this.showCallback = null;
	}
	show = (callback) => {
		this.showCallback = callback;
		this.setState({v:true,currentIdx:-1});
	}
	handleSubmit(code){
		this.setState({v:false}, () => {
			if(this.showCallback != null){
				this.showCallback(code)
				this.showCallback = null;
			}
		})
	}
	render () {
		const {
			payModes,
			currentIdx,
			v
		} = this.state;
		return (
			<Modal transparent animationType="fade" onRequestClose={() => this.handleSubmit(-1)} visible={v}>
			 <View style={s.main}>
			  
			  <View style={s.holder}>
			   {payModes.map(({name, icon, color, qr, code}, idx) => {
			   	   return (
			   	    <>
				   	   <TouchableOpacity onPress={() => this.setState({currentIdx:idx})} style={s.btnHolder}>
					    <Icon name={icon} size={30} color={color} />
					    <Text style={s.textHolder}>{name}</Text>				    
					   </TouchableOpacity>
					   {currentIdx == idx ?
				    	<>
				    	 {qr ? <Image source={qr} style={{width:250,height:250}} /> : null}
				    	 <TouchableOpacity style={s.sBtn} onPress={() => this.handleSubmit(code)}>
				    	  <Text style={s.btnTxt}>Payment Done!</Text>
				    	 </TouchableOpacity>
				    	</>
				       : null}
				    </>
				  )
			   })}			   			  
			  </View>

			 </View>
			</Modal>
		)
	}
}

const s = StyleSheet.create({
	main:{
		height:'100%',
		width:'100%',
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:'#000000b4'
	},
	holder:{
		backgroundColor:helper.grey4,
		borderRadius:7,
		width:250
	},
	btnHolder:{
		width:230,
		alignSelf:'center',
		height:60,		
		marginVertical:5,
		flexDirection:'row',
		alignItems:'center'
	},
	sBtn:{
		backgroundColor:helper.green,
		width:250,
		alignSelf:'center',
		height:50,		
		justifyContent:'center',
		alignItems:'center'
	},
	btnTxt:{
		fontSize:20,
		color:helper.white,
		fontWeight:'bold'		
	},
	textHolder:{
		fontSize:20,
		color:helper.silver,
		fontWeight:'bold',
		marginLeft:10
	}
})