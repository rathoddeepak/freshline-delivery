import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Modal,
	Alert,
	FlatList,
	Vibration,
	Dimensions,
	ToastAndroid,
	RefreshControl,	
	TouchableNativeFeedback
} from 'react-native';
import {
	Icon	
} from 'components';
import lang from 'assets/lang';
import helper from 'assets/helper';
import Parse from 'parse/react-native.js';
import {Bar as Progressbar} from 'react-native-progress'

const width = Dimensions.get('window').width;
export default class History extends Component {
	constructor(props) {
		super(props);
		this.state = {
			notifications:[],
			busy:false
		}		
	}

	componentDidMount() {
		this.loadNotifications();
	}

	loadNotifications = () => {
		let notifications = [
		 {
		 	title:'Update Delivery App',
		 	desc:'Update App For New Features App.\n1. Live Distance',
		 	time:'09 Dec 2021 09:00pm'
		 }
		];
		this.setState({busy:true}, () => {
			setTimeout(() => {
				this.setState({notifications,busy:false})
			}, 3000)
		})		
	}

	render() {
		const {
			notifications,
			busy
		} = this.state;
		return (
			<View style={helper.cont}>
			 <Header busy={busy} />			 
			 <FlatList
			  data={notifications}
			  style={{backgroundColor:helper.blk,borderTopLeftRadius:10,borderTopRightRadius:10,overflow:'hidden'}}
			  keyExtractor={(item) => item.id}
			  refreshControl={<RefreshControl refreshing={false} onRefresh={this.loadTasks} colors={[helper.primaryColor, "#000"]} />}
			  ListEmptyComponent={this.renderEmpty}
			  renderItem={this.renderNotify}
			 />
			 <View style={s.hr} />
			</View>
	    )
	}

	renderNotify = ({item : {title,desc,time}, index}) => {		
		return (
			<View style={s.body}>
			 <Text style={s.title}>{title}</Text>
			 <Text style={s.desc}>{desc}</Text>
			 <Text style={s.time}>{time}</Text>
			</View>
		)
	}
}

class Header extends Component {
	render(){
		const {
			busy
		} = this.props;
		return (
			<View style={s.header.body}>
			  <View style={s.header.left}>			   
			   <Text style={s.header.text}>Notifications</Text>
			  </View>
			  {busy ?
			 	 <Progressbar
			 	  style={{position:'absolute',bottom:0}}
			 	  indeterminate
			 	  width={width}
			 	  borderColor={helper.blk}
			 	  color={helper.primaryColor}
			 	  borderRadius={0}
			 	  height={4}
			 	 />
			 	: null}
			</View>			
		)
	}
}

const s = {
	header:{
		text:{
			fontWeight:'bold',
			color:helper.primaryColor,
			fontSize:20
		},
		left:{
			height:50,	  	
		  	justifyContent:'center',
		  	marginLeft:5
		},
		body:{
		  	justifyContent:'space-between',
		  	flexDirection:'row',
		    height:50,
		    borderBottomWidth:0.5,
		    borderColor:helper.grey1
		}
	},
	body:{
		width:'95%',
		borderRadius:5,
		backgroundColor:helper.grey4,
		padding:5,
		alignSelf:'center',
		marginTop:10
	},
	title:{
		fontSize:18,		
		fontWeight:'bold',
		width:'95%',
		color:helper.primaryColor
	},
	desc:{
		width:'95%',
		fontSize:16,
		color:helper.silver
	},
	time:{		
		fontSize:14,
		paddingRight:5,
		marginTop:3,	
		textAlign:'right',	
		color:helper.grey1
	},
	hr:{width:'100%',position:'absolute',bottom:0,height:0.3,backgroundColor:helper.grey4},
}