import React, {Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	FlatList,
	Platform,
	Linking,
	ToastAndroid
} from 'react-native';
import {
  CheckBox2,
  Image,
  StepIndicator,
  ButtonIcon,
  Button
} from 'components';
import lang from 'assets/lang';
import helper from 'assets/helper';
export default class FirstStep extends Component {
	constructor(props) {
		super(props);
		this.state = {
			order_id:'#ODR143',
			selected:-1,
			order:{vendor:{photos:[]}}
		}
		this.checkBox = [];
	}
	componentDidMount() {
		this.setState({order:this.props.route.params})
	}
	handleChange = (s, i) => {
		let si = this.state.selected;
		if(si != -1 && si != i)this.checkBox[si]?.handlePress(false);
		this.setState({selected:s ? i : -1});
	}
	handleSubmit = () => {
		let selected = this.state.selected;
		let data = this.state.order;
		if(selected == -1){
			ToastAndroid.show(lang.z[cl].sld, ToastAndroid.SHORT);
			return;
		}
		data['full_dispatch'] = this.state.order.multi == 0 ? true : false;
		this.props.navigation.navigate('SecondStep', data);
	}
	custAddress = () => {
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
	call = () => {		
		const {phone} = this.state.order.customer;
		Linking.openURL(`tel:${phone}`)
	}
	render() {
		const {
			order_id,
			order
		} = this.state;
		const multi = order.multi == 1; 
		return (
			<View style={helper.cont}>
				 <Text style={s.code}>{order.order_code}</Text>				 
				 <StepIndicator step={1} />
				 <ScrollView><View style={{height:'100%',width:'89%',ustifyContent:'center',alignSelf:'center'}}>
					 
					 <Text style={s.tt}>{lang.z[cl].stp1}</Text>
					 
					 <View style={s.card}>
					  <View style={{width:'50%',padding:5}}>
					   <Text style={s.t1}>{lang.z[cl].frm}</Text>
					     {order.vendor.photos.length > 0 ? 
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
						 <Text style={s.d1}>{order.vendor.name}</Text>
						 <Text style={s.d2}>{order.vendor.address}</Text>
					  </View>
					  <View style={{width:'50%',padding:5}}>
					   <Text style={s.t1}>{lang.z[cl].to}</Text>
					     <Text style={s.d1}>{order.customer?.first_name}</Text>
						 <Text style={s.d2}>{order.customer?.address}</Text>
						 <ButtonIcon text={lang.z[cl].nav} onPress={this.custAddress} icon={lang.drt} style={{alignSelf:'flex-start',marginTop:4}} br={5} />
						 <ButtonIcon onPress={this.call} text={lang.z[cl].cll} icon={lang.ph} style={{alignSelf:'flex-start',marginRight:7,marginTop:5}} br={5} />
					  </View>
					 </View>

					 <Text style={s.d3} numberOfLines={2}>{lang.z[cl].sbtt}</Text>

					  {multi ? <View style={s.gv}>
					   <View style={s.cb}>
					    <View style={s.vn}>
					     <CheckBox2 ref={(ref) => this.checkBox[1] = ref} onChange={(bool) => this.handleChange(bool, 1)}/>
					    </View>
					    <View style={s.vv} />					   
					    <View style={s.vt}>
					     <Text numberOfLines={1} style={s.ct}>Center Dispatch</Text>
						 <Text numberOfLines={2} style={s.tv}>To Center Point</Text>
					    </View>
					   </View>
					  </View> : 
					   <View style={s.gv}>
					    <View style={s.cb}>
					    <View style={s.vn}>
					     <CheckBox2 ref={(ref) => this.checkBox[0] = ref} onChange={(bool) => this.handleChange(bool, 0)}/>
					    </View>
					    <View style={s.vv} />					   
					    <View style={s.vt}>
					     <Text numberOfLines={1} style={s.ct}>Full Dispatch</Text>
						 <Text numberOfLines={2} style={s.tv}>To Customer Directly</Text>
					    </View>
					   </View>
					  </View>}

					  <Button onPress={this.handleSubmit} text={lang.z[cl].smt} hr={20} vr={5} style={{alignSelf:'center',marginTop:20}}/>
				 </View></ScrollView>
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
	card:{padding:4,borderRadius:8,backgroundColor:'#242424',width:'100%',flexDirection:'row'},
	gv:{borderLeftWidth:6,borderColor:helper.blight,width:100,marginLeft:10,height:50,justifyContent:'flex-end'},
	cb:{alignItems:'center',flexDirection:'row'},
	vn:{width:40,height:40,left:-22,zIndex:10},
	vv:{width:70,height:5,backgroundColor:helper.blight,left:-22},
	vt:{width:150,left:-15},
	tv:{fontSize:13,color:helper.blight},
	ct:{fontSize:15,fontWeight:'bold',color:'#fff'},

})