import React, {Component} from 'react';
import {
	View,
	Text,
	Modal,
	TouchableOpacity,
	TouchableNativeFeedback
} from 'react-native'
import helper from 'assets/helper';
import Icon from './icon';
import Dazar from './dazar';
import lang from 'assets/lang';
export default class DetailsViewer extends Component {
	constructor(props){
		super(props)
		this.state = {
			entities:[],
			error:false,
			busy:false,
			v:false
		}
	}

	loadData = (title, earning) => {
		let keys = Object.keys(earning);
		if(keys.length > 0){
			let entities = [];			
			keys.forEach(key => {				
				entities.push({key:key.toUpperCase(),value:earning[key]});
			});
			this.setState({title,entities,v:true});
		}else{
			this.close();
		}
	}

	close = () => this.setState({v:false});

	render(){
		const {
			entities,
			busy,
			error,
			title,
			v
		} = this.state;
		return (			
			<Modal visible={v} onRequestClose={this.close} transparent animationType={'fade'}>
			 <View style={s.body}>				 				 
				 <View style={s.dataBox}>
				  <Text style={s.title}>{title}</Text>
				  <View style={s.hr} />
				  <Dazar
					  length={entities.length}				  
					  error={error}
					  loading={busy}
			      />
				  {entities.map(data => 
				  	<Text style={s.text}>{data.key}: {lang.rp}{data.value}</Text>
				  )}			  
				  <TouchableOpacity onPress={this.close} style={s.closeBtn}>
				   <Icon name={'close'} color={helper.silver} size={40} />
				  </TouchableOpacity>
				 </View>
			 </View>			 
			</Modal>
		)
	}
}

const s = {	
	dataBox:{
		width:'90%',
		alignSelf:'center',
		padding:5,
		borderRadius:5,
		backgroundColor:helper.grey4,
		elevation:12,
		alignItems:'center'
	},
	title:{
		fontSize:22,		
		color:helper.silver,
		paddingLeft:5,
		marginTop:7,
		marginBottom:2,
		fontWeight:'bold'
	},
	hr:{
		marginBottom:3,
		height:0.5,
		backgroundColor:helper.grey1,
		width:'90%'
	},
	text:{
		fontSize:19,	
		color:helper.silver,		
		marginVertical:5
	},
	closeBtn:{width:50,height:50,justifyContent:'center',alignItems:'center'},	
	body:{
		backgroundColor:'#000000b4',
		height:'100%',
		width:'100%',
		justifyContent:'center',
		alignItems:'center'
	}
}