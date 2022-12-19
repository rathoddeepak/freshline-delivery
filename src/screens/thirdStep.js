import React, {Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	FlatList,
	ToastAndroid,
	Linking,
	Platform
} from 'react-native';
import {
  CheckBox2,
  Image,
  StepIndicator,
  ButtonIcon,
  Slider,
  LoadingModal
} from 'components';
import request from 'libs/request';
import lang from 'assets/lang';
import helper from 'assets/helper';
export default class ThirdStep extends Component {
	constructor(props) {
		super(props);
		this.state = {
			order_id:'#ODR143',
			busy:false,
			full_dispatch:false,
			value:0,
			busy_p:false,
			order:{}
		}
	}
	componentDidMount()	{
		let order = this.props.route.params;		
		let full_dispatch = order.status == helper.HAS_PICKED_F || order.from_center == true;		
		this.setState({order,full_dispatch})
	}
	handleSlideEnd = async () => {
		let order = this.state.order;
		this.setState({busy_p:true});
		var res = await request.perform('orders', {
			req:'up_p',
			user_id,
			progress:this.state.value,
			vo_id:order.id			
		});		
		if(res)this.setState({busy_p:false});
	}
	handleDelivered = async (checked) => {		
		if(!checked)return;
		let order = this.state.order;
		this.setState({busy:true})
		var res = await request.perform('orders', {			
			req:'dl_sts',
			user_id,			
			vo_id:order.from_center ? -1 : order.vo_id,
			order_id:order.from_center ? order.id : 0,
			hasDelivered:this.state.full_dispatch
		});
		if(res)this.setState({busy:false});		
		if(typeof res === 'object' && res?.data && res?.status == 200){			 
			 this.props.navigation.navigate("Home");
			 ToastAndroid.show(res.data, ToastAndroid.LONG);
		} else {
			this.checkbox.handlePress();
			ToastAndroid.show(lang.z[cl].aeo, ToastAndroid.LONG);
		}
	}

	call = () => {		
		const {phone} = this.state.order.customer;
		Linking.openURL(`tel:${phone}`)
	}

	nav = () => {		
		const {lng, lat} = this.state.order.customer;
		const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
		const latLng = `${lat},${lng}`;
		const label = 'Custom Label';
		const url = Platform.select({
		  ios: `${scheme}${label}@${latLng}`,
		  android: `${scheme}${latLng}(${label})`
		});		
		Linking.openURL(url); 
	}

	centerNav = () => {
		
	}

	handleValueChange = (v) => this.setState({ value: Math.round(v * 100) });
	render() {
		const {			
			busy,
			value,
			order,
			busy_p,
			order_id,
			full_dispatch
		} = this.state;
		return (
			<View style={helper.cont}>
				 <Text style={s.code}>{order.order_code}</Text>
				 <StepIndicator step={3} />
				 <ScrollView><View style={{height:'100%',width:'89%',ustifyContent:'center',alignSelf:'center'}}>
					 
					 <Text style={s.tt}>{lang.z[cl].stp3}</Text>
					 					 
					 <View style={s.card}>
					 {full_dispatch ? 
					  <View style={{padding:5}}>					     
						 <Text style={s.d1}>{order.customer.first_name} {order.customer.last_name}</Text>
						 <Text style={s.d1}>Amount: {lang.rp}{order.total}</Text>
						 <Text style={s.d1}>Paid: {order.pay_method == 0 ? 'No' : 'Yes'}</Text>
						 {order.praise > 0 ? <Text style={s.d1}>Amount Without Tip: {lang.rp}{order.total - order.praise}</Text> : null}
						 <Text style={s.d1}>Tip: {lang.rp}{order.praise}</Text>
						 <Text style={s.d2}>{order.customer.address}</Text>
						 <Text style={s.d2}>Landmark: {order.customer.landmark}</Text>
						 <Text style={s.d2}>Flat: {order.customer.flat}</Text>
						 <View style={{flexDirection:'row'}}>
						    <ButtonIcon onPress={this.nav} text={lang.z[cl].nav} icon={lang.drt} style={{alignSelf:'flex-start',marginRight:7,marginTop:5}} br={5} />
							<ButtonIcon onPress={this.call} text={lang.z[cl].cll} icon={lang.ph} style={{alignSelf:'flex-start',marginRight:7,marginTop:5}} br={5} />
						 </View>
					  </View>				  
					  : <View style={{padding:5}}>					     
						 <Text style={s.d1}>{lang.z[cl].tcp}</Text>
						 <Text style={s.d2}>{order.center?.name}</Text>
						 <View style={{flexDirection:'row'}}>
						    <ButtonIcon onPress={this.centerNav} text={lang.z[cl].nav} icon={lang.drt} style={{alignSelf:'flex-start',marginRight:7,marginTop:5}} br={5} />
						 </View>
					    </View>}
					 </View>


					  {full_dispatch ? <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
					        <View style={{width:'90%'}}>
							    <Slider						          
						          maximumTrackTintColor={helper.grey4}
						          busy={busy_p}
						          minimumTrackTintColor={helper.primaryColor}
						          thumbTintColor={helper.primaryColor}
						          onValueChange={this.handleValueChange}
						          onSlidingComplete={this.handleSlideEnd}
						        />
					        </View>
					        <Text style={s.dq}>{`${value}%`}</Text>
				       </View> : null}
					  <View style={{borderLeftWidth:6,borderColor:helper.blight,width:100,marginLeft:10,height:90,justifyContent:'flex-end'}}>
					   <View style={{alignItems:'center',flexDirection:'row'}}>
					    <View style={{width:35,height:35,left:-20,zIndex:10}}>
					     <CheckBox2 onChange={this.handleDelivered} size={35} ref={ref => this.checkbox = ref} />
					    </View>
					    <View style={{width:70,height:5,backgroundColor:helper.blight,left:-22}} />					   
					    <View style={{width:150,left:-15}}>
					     <Text numberOfLines={1} style={s.dq}>{full_dispatch ? lang.z[cl].fdd : lang.z[cl].fdc}</Text>
						 <Text numberOfLines={2} style={{fontSize:13,color:helper.blight}}>{lang.z[cl].fpckdc}</Text>
					    </View>
					   </View>					   
					  </View>

				 </View></ScrollView>
				 <LoadingModal visible={busy} />
			</View>
		)
	}
}

const s = StyleSheet.create({
	code:{fontSize:20, fontWeight:'bold', color:helper.primaryColor, marginVertical:10, textAlign:'center'},
	tt:{fontSize:19,fontWeight:'bold', color:helper.blight,width:'100%',marginTop:20,marginBottom:10},
	t1:{fontSize:17,color:helper.primaryColor,fontWeight:'bold'},
	d1:{fontSize:17,color:helper.primaryColor,fontWeight:'bold',marginTop:2},
	d2:{fontSize:18,color:helper.silver,marginTop:5},
	dq:{fontSize:15,fontWeight:'bold',color:'#fff'},
	d3:{fontSize:15,color:helper.blight,marginVertical:10,width:'80%'},
	card:{padding:4,borderRadius:8,width:'100%',flexDirection:'row'}
})