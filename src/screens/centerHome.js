import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	ToastAndroid,
	RefreshControl,
	Linking
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import {
	Dazar,
	CHeader,
	SlideClose,
	Icon,
	TextIcon,
	FoodCardSmall,
	CountDown,
	Image,
	ButtonIcon
} from 'components';
import lang from 'assets/lang';
import helper from 'assets/helper';
import request from 'libs/request';
import OneSignal from 'react-native-onesignal';
export default class Orders extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pending:[],
			busy:false
		}
		this.pageList = [];
	}
	componentDidMount() {		
		OneSignal.sendTags({status: "loggedin", heroid:user_id });
		this.loadingPending();
	}
	loadingPending = async () => {
		if(this.state.busy)return;
		this.setState({busy: true})	
		var res = await request.perform('orders', {
			user_id,			
			req:'gtcdlo'
		});
		if(res)this.setState({busy:false});
		if(typeof res === 'object' && res?.status == 200){			
			if(res.data?.length != undefined){
				this.setState({pending:res.data});
			}else{
				this.handleStartNav(res.data)
			}
		}else{
			 this.setState({error:true});
		}
	}
    handleStartNav = (data) => {
    	data['from_center'] = true;
    	this.props.navigation.navigate('ThirdStep', data);
    }

    call = (phone) => {		
		Linking.openURL(`tel:${phone}`)
	}

	handleAccept = (index) => {
    	let pending = this.state.pending;
    	pending.splice(index, 1);
    	this.setState({pending})
    }

	render() {
		const {
			pending,
			busy
		} = this.state;
		return (
			<View style={helper.cont}>
			 <CHeader text={lang.z[cl].cltrhr} />
			 <FlatList
			  data={pending}
			  keyExtractor={(item) => item.id.toString()}
			  renderItem={({item, index}) =>
			      <OrderCard
				   data={item}
				   onCall={this.call}
				   destroy={() => this.handleAccept(index)}
				   onNav={this.handleStartNav}
				  />
			  }
			  refreshControl={<RefreshControl refreshing={false} onRefresh={this.loadingPending} colors={[helper.primaryColor, "#000"]} />}
			  ListFooterComponent={
			  	 <Dazar
			       loading={busy}
			       error={false}
			       emptyOther
			       length={pending.length}		      
			     />
			  }
			 />
			</View>
		)
	}
}

class OrderCard extends Component {
	constructor(props) {
		super(props)
		this.state = {
			busy:false,
			prepared:true,
			status:-1
		}
	}
	componentDidMount() {
		let status = this.props.data.status;
		this.setState({status})
	}
	handleStart = async () => {		
		let order_id = this.props.data.id;			
		this.setState({busy: true})		
		var res = await request.perform('orders', {			
			req:'dlc_sts',
			user_id,
			order_id
		});
		if(res)this.setState({busy:false});
		if(typeof res === 'object' && res?.status == 200){
			this.props.onNav(this.props.data)
		}else if(typeof res === 'object' && res?.data){
			if(res.data == 'AA'){
				this.props.destroy()
				ToastAndroid.show("Someone Else Accepted Your Order!", ToastAndroid.LONG);
			}else{
				this.slideClose.reset();
				ToastAndroid.show(res.data, ToastAndroid.LONG);
			}						
		}else{
			this.slideClose.reset();
			ToastAndroid.show(lang.z[cl].aeo, ToastAndroid.LONG);
		}
	}
	render() {
		const {
			order_code,
			customer,
			time,
			amount,	
			prepared,
			time_left,
			food_items
		} = this.props.data;		
		const {
			status,
			busy
		} = this.state;
		return (
			<View style={s.orderCrd}>
			 <View style={s.dtls}> 
			    <Text numberOfLines={1} style={s.tt}>{order_code} {customer.first_name} {customer.last_name}</Text>
			    <TextIcon style={{marginBottom:5}} name={lang.pin} text={customer.address} />
			    <TextIcon name={lang.clk} text={time} />			  
			    <ButtonIcon onPress={() => this.props.onCall(customer.phone)} text={'Call Customer'} icon={lang.ph} style={{alignSelf:'flex-start',marginTop:8}} br={5} />
			 </View>
			 <View style={{width:'95%',alignSelf:'center'}}>				 
				 <FlatList			     
				     data={food_items}			     
				     showsHorizontalScrollIndicator={false}		     
				     contentContainerStyle={{maxHeight:200,flexDirection:'column',flexWrap:'wrap'}}
					 horizontal={true}
				     renderItem={({item,index}) =>
				      <FoodCardSmall data={item} width={240} cStyle={{margin:5}} />
				     }
		             keyExtractor={(item, index) => index.toString()}
				 />
				 <View style={s.dda}>
					 <SlideClose busy={busy} ref={ref => this.slideClose = ref} fSize={12} width={'70%'} onSubmit={this.handleStart} text={lang.z[cl].srtdl} />				 
				 </View>
			 </View>			 
			</View>
		)
	}
}

const s = StyleSheet.create({
	orderCrd:{
		width:'95%',
		borderRadius:10,
		marginVertical:8,
		alignSelf:'center',
		backgroundColor:helper.grey6
	},
	ctr:{
		width:'38%',		
		justifyContent:'center',
		alignSelf:'center'
	},
	dtls:{
		padding:5,
		marginVertical:6,
		width:'95%',
		alignSelf:'center',	
	},
	dda:{
		flexDirection:'row',
		marginVertical:6,
		width:'100%',
		justifyContent:'space-around',		
	},	
	aa:{
		fontSize:14,		
		color:helper.silver,
		fontWeight:'bold'
	},
	tt:{
		fontSize:16,
		fontWeight:'bold',
		color:helper.primaryColor,
		marginBottom:4
	}
})