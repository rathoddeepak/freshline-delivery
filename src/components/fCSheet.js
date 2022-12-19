import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView
} from 'react-native';
import helper from 'assets/helper';
import lang from 'assets/lang';
import {Circle as ProgressCircle} from 'react-native-progress'
export default class FCSheet extends Component {
	constructor(props){
		super(props)
		this.state = {
			entities:[],
			busy:false
		}
	}

	setData = (entities) => this.setState({entities})	

	render () {
		const {
			totalAmt,
			entities,
			busy
		} = this.state;
		return (
			<>			
				<View style={s.notch}>
				 <Text style={s.seeDetails}>Floating Cash {totalAmt}</Text>
				</View>
				<View style={s.dataBody}>
					{busy ? <View style={s.loader}>
					 <ProgressCircle
						indeterminate
						size={50}
						color={helper.silver}
					 />
					</View> : null}
					{entities.map(data => 
					  	<Text style={s.text}>{data.key}: {data.value}</Text>
					)}
				</View>
			</>
		)
	}
}

const s = {
	seeDetails:{fontWeight:'bold',color:helper.silver,fontSize:15},
	notch:{borderTopLeftRadius:8,borderTopRightRadius:8,paddingVertical:4,paddingHorizontal:14,alignSelf:'center',backgroundColor:helper.grey4},
	dataBody:{
		height:300,
		backgroundColor:helper.grey4,
		width:'95%',
		borderTopLeftRadius:8,
		borderTopRightRadius:8,
		alignSelf:'center'
	},
	text:{
		fontSize:17,
		fontFamily:'sans-serif',
		color:helper.silver,		
		margin:8
	},
	loader:{
		flex:1,
		justifyContent:'center',
		alignItems:'center'
	}
}