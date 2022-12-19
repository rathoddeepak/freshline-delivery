import React, {Component} from 'react';
import {
	View,
	Text,
	Modal,
	TouchableOpacity,
	TouchableNativeFeedback
} from 'react-native'
import helper from 'assets/helper';
export default class TaskCard extends Component {
	render () {
		const {
			pickups,
			deliveries,
			id,
			earning,
			status
		} = this.props.data;
		const showNotch = status == helper.ORDER_DELIVERED;
		return (
			<>
				<View style={s.body}>			
				 {pickups.map(this.renderPickups)}
				 {deliveries.map(this.renderDeliveries)}
				 <View style={s.badge}>
				  <Text style={s.badgeTxt}>#{id}</Text>
				 </View>
				</View>
				{showNotch ? <TouchableOpacity onPress={() => this.props.onDetails(earning)} style={s.notch}>
				 <Text style={s.seeDetails}>See Details</Text>
				</TouchableOpacity> : null}		
			</>
		)
	}

	renderPickups = (data, index) => {
		const sts = helper.getStatusData(data.agent_status);
		return (
			<>
				<TouchableNativeFeedback key={index} onPress={() => this.props.onAction(data.id, helper.PICKUP)}>
				    <View>					
						<Text numberOfLines={1} style={s.vkn}>{this.props?.data?.time} - Pickup - <Text style={{color:sts.color}}>{sts.text}</Text></Text>					
						<Text numberOfLines={1} style={[s.njb, {color:helper.primaryColor}]}>{data.title}</Text>
						<Text numberOfLines={2} style={s.njb}>{data.address}</Text>
			        </View>
			    </TouchableNativeFeedback>
			    <View style={s.hr} />
		    </>
		)
	}

	renderDeliveries = (data, index) => {
		const sts = helper.getStatusData(data.agent_status);
		return (
			<TouchableNativeFeedback onPress={() => this.props.onAction(data.id, helper.DELIVERY)}>
			    <View>
			        <Text numberOfLines={1} style={s.vkn}>{this.props?.data?.time} - Delivery - <Text style={{color:sts.color}}>{sts.text}</Text></Text>					
					<Text numberOfLines={1} style={[s.njb, {color:helper.primaryColor}]}>{data.title}</Text>
					<Text numberOfLines={2} style={s.njb}>{data.address}</Text>					
			    </View>
			 </TouchableNativeFeedback>
		)
	}
}

const s = {
	badgeTxt:{fontSize:15,fontWeight:'bold',color:helper.blk},
	seeDetails:{fontWeight:'bold',color:helper.blk,fontSize:15},
	notch:{borderBottomLeftRadius:8,borderBottomRightRadius:8,paddingVertical:4,paddingHorizontal:14,alignSelf:'center',backgroundColor:helper.primaryColor},
	badge:{padding:2,borderRadius:5,backgroundColor:helper.grey1,position:'absolute',top:0,right:0},
	body:{elevation:24,width:'98%',alignSelf:'center',paddingBottom:10,marginTop:10,backgroundColor:helper.grey6,borderRadius:10},
	njb:{marginLeft:10,fontFamily:'sans-serif-light',fontSize:15,color:helper.grey},
	vkn:{marginLeft:10,fontSize:16,fontFamily:'notoserif',color:helper.silver,marginTop:10},
	hr:{width:'95%',alignSelf:'center',height:0.5,backgroundColor:helper.grey1,marginTop:10},
	closeBtn:{position:'absolute',width:50,height:50,justifyContent:'center',alignItems:'center'},
	seeDetails:{fontWeight:'bold',color:helper.blk,fontSize:15},
	notch:{borderBottomLeftRadius:8,borderBottomRightRadius:8,paddingVertical:4,paddingHorizontal:14,alignSelf:'center',backgroundColor:helper.primaryColor}
}