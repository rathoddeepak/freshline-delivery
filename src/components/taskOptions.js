import React, {Component} from 'react';
import {
	View,
	Text,
	Modal,
	TextInput,
	TouchableOpacity
} from 'react-native';
import helper from 'assets/helper';
import lang from 'assets/lang';
import Icon from './icon';
export default class TaskOptions extends Component {
	constructor(props){
		super(props)
		this.state = {
			v:false,
			selectedIdx:0,
			amtList:[10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
		}
	}
	show = () => {
		this.setState({v:true})
	}
	selectIdx = (selectedIdx) => {
		this.setState({selectedIdx})
	}
	closeModal = () => {
		this.setState({
			v:false
		})
	}
	submitAction = () => {
		this.closeModal();
	}
	render(){
		const {
			v,
			amtList,
			selectedIdx
		} = this.state;
		return (
			<Modal visible={v} transparent animationType='slide' onRequestClose={this.closeModal}>
				  <View style={style.body}>
				   <View style={style.header}>
				    <Text style={style.headerTitle}>Extra For Task</Text>
				    <TouchableOpacity onPress={this.closeModal} style={style.clsIcn}>
					    <Icon name={'chv_dwn'} size={25} color={helper.primaryColor} />
					</TouchableOpacity>
				   </View>
				   <TextInput style={style.textInput} placeholder="Enter Reason" placeholderTextColor={helper.grey1} />
				   <View style={style.boxBody}>
					   {amtList.map((d, i) => {
					   	const color = selectedIdx == i ? helper.primaryColor : helper.grey1;
					   	return (
					   		<TouchableOpacity activeOpacity={0.7} onPress={() => this.selectIdx(i)} style={[style.box, {borderColor:color}]}>
					   		 <Text style={[style.boxTxt, {color}]}>{d}</Text>
					   		</TouchableOpacity>
					   	)
					   })}
				   </View>
				   <TouchableOpacity onPress={this.submitAction} style={style.btn}>
				    <Text style={style.btnTxt}>SUBMIT</Text>
				   </TouchableOpacity>
				  </View>
			</Modal>
		)
	}
}

const style = {
	btn:{
		justifyContent:'center',
		alignItems:'center',
		width:'95%',
		marginTop:5,
		borderRadius:5,		
		height:40,
		alignSelf:'center',
		backgroundColor:helper.primaryColor
	},
	btnTxt:{
		fontSize:18,
		color:helper.blk,
		fontFamily:'sans-serif-medium'
	},
	box:{
		justifyContent:'center',
		flexDirection:'row',
		height:40,
		width:40,
		alignItems:'center',
		borderWidth:0.6,
		marginTop:5,
		marginRight:7,
		borderRadius:5
	},
	boxBody:{
		marginTop:5,
		marginBottom:5,
		flexWrap:'wrap',
		flexDirection:'row',		
		width:'95%',
		alignSelf:'center'
	},
	boxTxt:{
		fontSize:17,
		fontFamily:'sans-serif-light'
	},
	body:{
		height:'100%',
		width:'100%',
		backgroundColor:helper.blk
	},
	header:{
		height:50,
		width:'100%',
		paddingLeft:10,		
		alignItems:'center',
		flexDirection:'row',
		borderBottomWidth:0.6,				
		borderColor:helper.grey1,
		justifyContent:'space-between'
	},
	headerTitle:{
		fontSize:18,
		color:helper.silver,
		fontWeight:'bold'
	},
	clsIcn:{		
		height:50,
		justifyContent:'center',
		alignItems:'center'
	},
	textInput:{
		height:100,
		textAlignVertical:'top',
		alignSelf:'center',		
		borderColor:helper.grey1,
		borderRadius:5,
		borderWidth:0.6,
		marginTop:6,
		fontSize:15,
		width:'95%',
		padding:5,
		color:helper.white
	}
}
