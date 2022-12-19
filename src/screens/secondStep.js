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
  Button,
  LoadingModal,
  FoodCardSmall
} from 'components';
import request from 'libs/request';
import lang from 'assets/lang';
import helper from 'assets/helper';
export default class SecondStep extends Component {
	constructor(props) {
		super(props);
		this.state = {
			order_id:'#ODR143',
			order:{},
			busy:false,
		}
	}
	componentDidMount() {
		this.setState({
			order:this.props.route.params
		})
	}
	handlePicked = async (checked) => {
		if(!checked)return;
		let order = this.state.order;
		this.setState({busy:true})
		var res = await request.perform('orders', {			
			req:'pck_sts',
			user_id,			
			vo_id:order.vo_id,
			full_dispatch:order.full_dispatch
		});
		if(res)this.setState({busy:false});		
		if(typeof res === 'object' && res?.data && res?.status == 200){
			 order['status'] = order.full_dispatch ? helper.HAS_PICKED_F : helper.HAS_PICKED_C;
			 this.props.navigation.navigate("ThirdStep", order);
			 ToastAndroid.show(res.data, ToastAndroid.LONG);
		} else if(res?.status == 400) {
			this.checkbox.handlePress()
			ToastAndroid.show(res.data, ToastAndroid.LONG);
		}else {
			this.checkbox.handlePress()
			ToastAndroid.show(lang.z[cl].aeo, ToastAndroid.LONG);
		}
	}
	vNav = () => {
		const {lng, lat} = this.state.order.vendor;
		const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
		const latLng = `${lat},${lng}`;
		const label = 'Custom Label';
		const url = Platform.select({
		  ios: `${scheme}${label}@${latLng}`,
		  android: `${scheme}${latLng}(${label})`
		});		
		Linking.openURL(url); 
	}
	call = () => {
		const {phone} = this.state.order.vendor;		
		Linking.openURL(`tel:${phone}`)
	}
	render() {
		const {
			busy,
			order_id,
			order
		} = this.state;
		return (
			<View style={helper.cont}>
				 <Text style={s.code}>{order.order_code}</Text>
				 <StepIndicator step={2} />
				 <ScrollView><View style={{height:'100%',width:'89%',ustifyContent:'center',alignSelf:'center'}}>
					 
					 <Text style={s.tt}>{lang.z[cl].stp2}</Text>
					 
					 <View style={s.card}>
					  <View style={{width:'65%',padding:5}}>					   
					    {order?.vendor?.photos?.length > 0 ?
					     <FlatList			     
						     data={order.vendor.photos}			     
						     contentContainerStyle={{marginTop:8}}
						     showsHorizontalScrollIndicator={false}		     
						     horizontal={true}
						     renderItem={({item,index}) =>
						      <View style={{width:60,height:60,marginRight:5,borderRadius:7}}>
						       <Image
							      sty={{height:60,width:60,backgroundColor:helper.grey}}
								  imgSty={helper.max}
								  borderRadius={7}
								  hash={item.blurCode}
								  source={{uri:helper.site_url + item.url}}
							    />
						      </View>
						     }
				             keyExtractor={(item, index) => index.toString()}
						 /> : null}
						 <Text style={s.d1}>{order.vendor?.name}</Text>
						 <Text style={s.d2}>{order.vendor?.address}</Text>
					  </View>
					  <View style={{width:'35%',padding:5}}>
					    <Text style={s.t1}>{lang.z[cl].cnct}</Text>	   						
						<ButtonIcon onPress={this.vNav} text={lang.z[cl].nav} icon={lang.drt} style={{alignSelf:'flex-start',marginTop:4}} br={5} />
						<ButtonIcon onPress={this.call} text={lang.z[cl].cll} icon={lang.ph} style={{alignSelf:'flex-start',marginTop:4}} br={5} />
					  </View>
					 </View>
					 <FlatList			     
					     data={order.food_items}			     
					     showsHorizontalScrollIndicator={false}		     
					     contentContainerStyle={{maxHeight:200,flexDirection:'column',flexWrap:'wrap'}}
						 horizontal={true}
					     renderItem={({item,index}) =>
					      <FoodCardSmall data={item} width={240} cStyle={{margin:5}} />
					     }
			             keyExtractor={(item, index) => index.toString()}
					 />
					  <View style={{borderLeftWidth:6,borderColor:helper.blight,width:100,marginLeft:10,height:100,justifyContent:'flex-end'}}>
					   <View style={{alignItems:'center',flexDirection:'row'}}>
					    <View style={{width:40,height:40,left:-22,zIndex:10}}>
					     <CheckBox2 ref={ref => this.checkbox = ref} onChange={this.handlePicked}/>
					    </View>
					    <View style={{width:70,height:5,backgroundColor:helper.blight,left:-22}} />					   
					    <View style={{width:150,left:-15}}>
					     <Text numberOfLines={1} style={{fontSize:15,fontWeight:'bold',color:'#fff'}}>{lang.z[cl].fpck}</Text>
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
	d1:{fontSize:15,color:helper.primaryColor,fontWeight:'bold',marginTop:10},
	d2:{fontSize:14,color:helper.blight},
	d3:{fontSize:15,color:helper.blight,marginVertical:10,width:'80%'},
	card:{padding:4,borderRadius:8,width:'100%',flexDirection:'row'}
})