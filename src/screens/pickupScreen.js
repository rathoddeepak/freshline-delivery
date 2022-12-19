import React, {Component} from 'react';
import {
	View,
	Text,
	Alert,
	FlatList,
	TouchableOpacity,
	TouchableNativeFeedback,
	StyleSheet,
	ScrollView,
	Modal,
	PanResponder,
	Animated,
	Image,
	Dimensions,
	Linking,
	ActivityIndicator
} from 'react-native';
import {
	Icon
} from 'components';
import helper from 'assets/helper';
import lang from 'assets/lang';
import moment from 'moment';
import Parse from 'parse/react-native.js';
import request from 'libs/request';
import PayModel from 'components/payModel';
import MapboxGL from '@react-native-mapbox-gl/maps';
import TickBox from 'components/tickBox';
import CheckBox3 from 'components/checkBox3';
import TaskOptions from 'components/taskOptions';
import {Bar as Progressbar, Circle as ProgressCircle} from 'react-native-progress'
import _ from 'lodash';
const {width,height} = Dimensions.get('window');
const startPosX = (width / 2) - 29;
const w80 = width * 80 / 100;
const w50 = width * 50 / 100;
const w20 = width * 20 / 100;

function getMinOrMax(markersObj, minOrMax, latOrLng){
	if(minOrMax == 'max'){
	  return _.maxBy(markersObj, (value) => value[latOrLng])[latOrLng];
	}else{
	  return _.minBy(markersObj, (value) => value[latOrLng])[latOrLng];
	}
}
function getBounds (markersObj) {
	var maxLat = getMinOrMax(markersObj, "max", 1);
	var minLat = getMinOrMax(markersObj, "min", 1);
	var maxLng = getMinOrMax(markersObj, "max", 0);
	var minLng = getMinOrMax(markersObj, "min", 0);

	var southWest = [minLng, minLat];
	var northWest = [maxLng, maxLat];
	return [southWest, northWest];
}
export default class PickupScreen extends Component {
	constructor(props){
		super(props)
		this.state = {
			time:'',
			status:{},
			customer:{},
			address:{},
			prepaid:false,
			showAction:false,
			mapMarkers:[],
			busy:false
		}
	}
	componentDidMount(){
		const {pickup_id} = this.props.route.params;
		this.setState({pickup_id}, this.loadData);
	}
	loadData = () => {
		this.setState({busy:true});
		const pickup_id = this.state.pickup_id;
		Parse.Cloud.run("getPickupData", {pickup_id}).then(data => {
			this.setState({busy:false}, () => {
				this.setData(data);
			})
		}).catch(err => {
			alert(err)
			this.setState({busy:false}, () => {
				this.props.navigation.goBack();
			});
		})
	}
	handleStatusChange = (newStatus) => {
		if(newStatus == helper.FLEETX_COMPLETE || newStatus == helper.FLEETX_CANCEL){
			this.props.navigation.goBack();
			return;
		}
		let data = this.state.tempData;
		data.agent_status = newStatus;
		this.setData(data);
	}
	setData = (data) => {
		const {
			id,title,address,agent_status,time,pay_mode,
			delivery_fee,status,vendor_id,items,phone_no,location,task_id
		} = data;

		let dataList = [];
		let showAction = false;
		let prepaid = pay_mode == helper.ONLINE_PAY;
		let customer = {				
			name:title,
			phone:phone_no
		}
		let addressObj = {
			lat:location.latitude,
			lng:location.longitude,
			val:address
		}
		dataList.push({title:"Delivery Fee", data:delivery_fee});
		dataList.push({title:"Pay Mode", data:helper.COD == pay_mode ? "COD" : "ONLINE"});
		showAction = agent_status < helper.FLEETX_COMPLETE;
		this.setState({
			time,
			customer,
			address:addressObj,
			reviewed:false,
			status:agent_status,
			id,
			dataList,
			showAction,
			prepaid,
			items,
			tempData:data,
			task_id
		}, () => {
			setTimeout(() => {
				this.displayMap()
			}, 600)
		});
	}	
	displayMap = () => {
		const {address} = this.state;
		let color = helper.startColor;
		let mapMarkers = [
		 {coord:[parseFloat(address.lng), parseFloat(address.lat)],color}
		];
		this.setState({mapMarkers})
	}
	userLocationUpdate = ({coords}) => {
		let address = this.state.address;
		if(address?.lng == undefined || address?.lat == undefined){
			return
		}
		let userLocation = [coords.longitude, coords.latitude];
		let addressLocation = [address.lng, address.lat];
		let bounds = [userLocation,addressLocation];		
		let finalBounds = getBounds(bounds);
		this.mapCamera?.fitBounds(finalBounds[0], finalBounds[1], 60, 100);
	}
	switchToPickup = () => {
		this.setState({dataList:[]}, () => {
			this.setData(helper.PICKUP, this.state.tempData);
		})		
	}
	reviewDone = () => {
		this.setState({reviewed:true})
	}
	navBack = () => this.props.navigation.goBack();
	render(){				
		const {
			id,
			dataList,
			status,
			showAction,
			prepaid,
			reviewed,
			task_id,
			busy
		} = this.state;		
		return (
			<View style={s.main}>
				<View>
				 <View style={{height:50,flexDirection:'row',alignItems:'center',paddingLeft:10}}>
				  <TouchableOpacity onPress={this.navBack}><Icon name={lang.cvlft} color={helper.primaryColor} size={20} /></TouchableOpacity>
				  <Text style={{marginLeft:7,fontSize:18,color:helper.primaryColor,fontWeight:'bold'}}>#{task_id}</Text>
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
				<FlatList
				  style={{width:'100%',alignSelf:'center'}}
				  ListHeaderComponent={this.renderHeader}
				  ListFooterComponent={this.renderFooter}
				  data={dataList}
				  keyExtractor={(item, index) => index}
				  renderItem={this.renderBox}
				 />
				 {showAction ? <TaskActionBar 
						  id={id}
						  task_id={task_id}
						  reviewed={reviewed}
						  status={status}
						  onNewStatus={this.handleStatusChange}				  
						  goToPickup={this.switchToPickup}
						  alreadyPaid={prepaid}
				 /> : null}
			 <TableViewer ref={ref => this.tableViewer = ref} />
			 <TaskOptions />
			</View>
		)
	}
	renderBox = ({item, index}) => {
		return (
			<BoxData data={item} idx={index} onTable={this.onTableView} />
		)
	}
	call = (phone) => {
		Linking.openURL(`tel:${phone}`)
	}
	address = (lat, lng) => {
		const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
		const latLng = `${lat},${lng}`;
		const label = 'Clufter Address';
		const url = Platform.select({
		  ios: `${scheme}${label}@${latLng}`,
		  android: `${scheme}${latLng}(${label})`
		});		
		Linking.openURL(url); 
	}
	onTableView = (data) => this.tableViewer.show(data);
	renderFooter = () => {
		const {
			items
		} = this.state;		
		return <Review productItems={items} onReviewDone={this.reviewDone} />
	}
	renderHeader = () => {
		const {
			time,
			customer,
			address,
			status,
			mapMarkers			
		} = this.state;
		const {text, color} = helper.getStatusData(status);
		return (
		<>
		 {/*Map Section*/}
		 <View style={{height:270,width:'100%',overflow:'hidden'}}>
			  <MapboxGL.MapView style={{flex:1}} styleURL={MapboxGL.StyleURL.Dark}>
			   {this.renderMarkers(mapMarkers)}
			   <MapboxGL.UserLocation onUpdate={this.userLocationUpdate} />
			   <MapboxGL.Camera ref={ref => this.mapCamera = ref} />
			  </MapboxGL.MapView>
			  <TouchableOpacity onPress={() => this.address(address.lat, address.lng)} style={{backgroundColor:helper.blackTrans,borderRadius:10,position:'absolute',bottom:6,right:6,width:40,height:40,justifyContent:'center',alignItems:'center'}}>
			   <Icon name='direction' size={30} color={helper.white} />
			  </TouchableOpacity>		  
	     </View>
	     {/*Basic Details Section*/}
	     <View style={{width:'98%',alignSelf:'center',paddingTop:5,flexDirection:'row',paddingLeft:5,paddingBottom:10,marginTop:5,borderBottomWidth:0.5,borderColor:helper.grey6,justifyContent:'space-between'}}>
	        <View style={{width:'70%'}}>
		        <Text style={{fontSize:18,color:helper.silver,fontWeight:'bold'}}>{customer.name}</Text>
		        <Text style={{fontSize:14,fontFamily:'sans-serif-medium',color:helper.silver}}>{time} - Pickup - <Text style={{color}}>{text}</Text></Text>
		    </View>
		    <TouchableOpacity onPress={() => this.call(customer.phone)} style={{height:50,justifyContent:'center',alignItems:'center'}}>
		      <View style={{width:28,height:28,justifyContent:'center',alignItems:'center',borderWidth:2,borderColor:helper.green,borderRadius:70}}>
		       <Icon name='phone' color={helper.green} size={16} />
		      </View>
		      <Text style={{marginTop:5,fontSize:10,color:helper.green,fontFamily:'sans-serif-light'}}>Call Cust</Text>
		    </TouchableOpacity>
		 </View>
		 <View style={{width:'98%',alignSelf:'center',paddingVertical:10,paddingLeft:5,borderBottomWidth:0.5,borderColor:helper.grey6,minHeight:30}}>
	        <Text style={{fontSize:16,color:helper.silver}}>{address.val}</Text>
		 </View>
		 {/*<View style={s.npi}>
		 	<TextIcon width={'60%'} icon={'pin'} text={address.val} medium/>
		 	<TouchableOpacity onPress={() => this.address(address.lat, address.lng)} style={{width:40,height:40,borderRadius:80,backgroundColor:'#4694f8',justifyContent:'center',alignItems:'center'}}>
		 	 <Icon name='direction' size={20} color={helper.white} />
		 	</TouchableOpacity>
		 </View>
		 <View style={s.npi}>		 	
		 	<TouchableOpacity onPress={() => this.call(customer.phone)} style={{width:40,height:40,borderRadius:80,backgroundColor:helper.grn1,justifyContent:'center',alignItems:'center'}}>
		 	 <Icon name='phone' size={20} color={helper.white} />
		 	</TouchableOpacity>
		 </View>*/}		 
		 {/*taskType == TASK_PICKUP && order_id != undefined ? <ReadyBar order_id={order_id} /> : null*/}
	    </>
		)
	}

	renderMarkers = (markers) => {
		return markers.map((m, id) => {
			return (
				<MapboxGL.MarkerView key={id} id={id.toString()} title={m.title} coordinate={m.coord}>
				 <Icon name={lang.pin} color={m.color} size={25} />
				</MapboxGL.MarkerView>
			)
	    })
	}
}

class Review extends Component {
	constructor(props){
		super(props)
		this.state = {
			v:false,
			allDone:false,
			reviewed:false,
			productItems:[]
		}
	}

	startReview = () => {
		this.setState({v:true}, () => {
			setTimeout(this.deployItems, 100);
		})		
	}

	deployItems = () => {		
 		let items = this.props.productItems;
 		console.log(items)
 		let productItems = [];
 		items.forEach(i => {
 			i.r = false;
 			productItems.push(i);
 		});
 		this.setState({productItems,allDone:false,reviewed:false});
	}

	onReviewed = () => {
		this.setState({reviewed:true,v:false,productItems:[]}, () => {
			this.props?.onReviewDone();
		})
	}

	onProductChange = (index) => {
		let allDone = true;
		let productItems = this.state.productItems;
		productItems[index].r = !productItems[index].r;
		this.setState({productItems}, () => {
			if(productItems[index].r == false){
				this.setState({allDone:false})
			}else{
				productItems.forEach(item => {
					if(item.r == false){
						allDone = false;
					}
				});
				this.setState({allDone});
			}			
		});
	}

	closeModal = () => {
		this.setState({reviewed:false,v:false,productItems:[]});
	}
	render(){
		const {
			v,			
			allDone,
			reviewed,
			productItems,			
			refreshList
		} = this.state;
		return (
			<>
			 <View style={s.nkv}>
			    <View style={{flexDirection:'row'}}>
				    <View style={s.nkc}>
				     <TickBox active={reviewed} size={14} />
				    </View>			    
			        <Text style={s.nkd}>Review Items To Be Picked To Complete Pickup, Make Sure You Pick All Items.</Text>
		        </View>
		        <TouchableOpacity onPress={this.startReview} style={s.btnStyle}>
		         <Text style={{fontWeight:'bold',fontSize:13,color:helper.silver}}>{reviewed ? 'View Items' : 'Review'}</Text>
		        </TouchableOpacity>
			 </View>

			 {/*Review Model*/}
			 <Modal visible={v} transparent animationType='slide' onRequestClose={this.closeModal}>
			  <View style={reviewStyle.body}>
			   <View style={reviewStyle.header}>
			    <Text style={reviewStyle.headerTitle}>Review Items</Text>
			    <TouchableOpacity onPress={this.closeModal} style={reviewStyle.clsIcn}>
				    <Icon name={'chv_dwn'} size={25} color={helper.primaryColor} />
				</TouchableOpacity>
			   </View>
			   <View style={{flex:1}}>
			    <FlatList
			     extraData={refreshList}
			     data={productItems}
			     keyExtractor={item => item.n}
			     renderItem={this.renderItem}
			    />
			   </View>
			   <TouchableOpacity onPress={this.onReviewed} disabled={!allDone} activeOpacity={0.7} style={reviewStyle.footer}>
			    <Text style={[reviewStyle.fTxt, {opacity:allDone ? 1 : 0.3}]}>Reviewed</Text>
			   </TouchableOpacity>
			  </View>
			 </Modal>			 
			</>
		)
	}

	renderItem = ({item, index}) => {
		return (
			<View style={reviewStyle.fISty}>
	   		 <View style={{width:30,paddingLeft:5}}>
	   		  <Text style={{fontSize:17,color:helper.silver}}>{item.qty}x</Text>
	   		 </View>
	   		 <View style={{flex:1}}>
	   		  <Text style={{paddingLeft:10,fontSize:17,color:helper.silver}}>{item.name}</Text>
	   		  {/*{item?.a?.map((a, b) => {
		 			return (
	 				<Text key={b} numberOfLines={3} style={reviewStyle.adn}> - {a.qty} x <Text style={{fontSize:13}}>{a.items.map(a => '  ' + a.name + ", ")}</Text></Text>
	 			)
	 		  })}*/}
	   		 </View>
	   		 <View style={{width:30,height:30,justifyContent:'center',alignItems:'center'}}>
	   		  <CheckBox3 size={25} iconSize={17} onChange={() => this.onProductChange(index)} />
	   		 </View>
	   		</View>
		)
	}
}
const reviewStyle = {
	fTxt:{
		color:helper.white,
		fontSize:15
	},
	adn:{
		fontSize:16,			
		color:helper.silver,
		marginLeft:5,
		marginTop:3
	},
	fISty:{flexDirection:'row',alignItems:'center',marginVertical:6},
	body:{
		height:'100%',
		width:'100%',
		backgroundColor:helper.blk
	},
	footer:{
		height:50,
		width:'100%',		
		alignItems:'center',		
		borderTopWidth:0.6,				
		borderColor:helper.grey1,
		justifyContent:'center'
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
	}
}

class TaskActionBar extends Component {
	constructor(props){
		super(props)
		this.state = {
			busy:false
		}		
		this.panX = new Animated.Value(startPosX)
		this.panResponder = PanResponder.create({
		    onMoveShouldSetPanResponder: () => true,
		    onPanResponderGrant: () => {
		      this.panX.setOffset(startPosX);
		    },
		    onPanResponderMove: (e, {dx}) => {
		    	this.panX.setValue(dx);
		    },
		    onPanResponderRelease: () => {
		    	let slided = w50 + this.panX._value;
		    	if(slided > w80){
		    		this.panX.setValue(w80);
		    		this.successAction();		    				    		
		    	}else if(slided < w20){		    		
		    		this.panX.setValue(w20);
		    		this.cancelConfirm()
		    	}else{
		    		Animated.spring(this.panX, {
		    			toValue:0,
		    			useNativeDriver:false
		    		}).start()
		    	}
		    }
		});
	}
	cancelConfirm = () => {
		Alert.alert(
	      "Are You Sure",
	      "Do You Really Want To Cancel Order",
	      [
	        {
	          text: "YES",
	          onPress: () => {
	          	this.askDistance();
	          }
	        },
	        {
	        	text: "NO",
	        	onPress: () => {
	        		this.panX.setValue(0);
	        	}
	        }	        
	      ]
	    )		
	}

	askDistance = () => {
		let task_id = this.props.task_id;
		let pickup_id = this.props.id;
		let hero_id = heroId;
		Alert.alert(
	      "Travelled To Pickup",
	      "Did You Travelled Certain Distance?",
	      [
	        {
	          text: "YES",
	          onPress: () => {
	          	this.cloudPerform('cancelTask', helper.FLEETX_CANCEL, {task_id,hero_id,pickup_id,full_refund:false});
	          }
	        },
	        {
	        	text: "NO",
	        	onPress: () => {
	        		this.cloudPerform('cancelTask', helper.FLEETX_CANCEL, {task_id,hero_id,pickup_id,full_refund:true});
	        	}
	        }	        
	      ]
	    )		
	}

	successAction = () => {
		let err = 'Invalid Action Please Restart You App Again';
		let abvErr = 'Please Complete Above Actions, To Proceed!';
		let {status, reviewed} = this.props;		
		let cloudAction = undefined;
		let newStatus = undefined;
		if(status == helper.FLEETX_UNASSIGNED){
			alert(err);
			this.panX.setValue(0);	
			return;
		}else if(status == helper.FLEETX_ASSIGNED){
			cloudAction = 'startPickup';
			newStatus = helper.FLEETX_START;
		}else if(reviewed == false){
			alert('Please Review Items');
			this.panX.setValue(0);	
			return;
		}else if(status == helper.FLEETX_START){				
			cloudAction = 'completePickup';
			newStatus = helper.FLEETX_COMPLETE;
		}	
		if(cloudAction == undefined){
			alert(err);
			this.panX.setValue(0);
			return;
		}else{
			this.cloudPerform(cloudAction, newStatus);
		}		
	}
	cloudPerform = async (cloudAction, newStatus, extra = {}) => {
		try {
			this.setState({busy:true})						
			const response = await request.taskAction(cloudAction, {hero_id:heroId,pickup_id:this.props.id, ...extra});
			this.setState({busy:false}, () => {
				this.panX.setValue(0);
				if(response){
					this.props.onNewStatus(newStatus)
				}
			});
		}catch(err){
			this.panX.setValue(0);
		    this.setState({busy:false})
			alert(helper.again);
		}
	}
	render () {
		const opacity = this.panX.interpolate({
			inputRange:[0, w50, width],
			outputRange:[0.3, 0, 1],
			extrapolate:'clamp'
		})
		const backgroundColor = this.panX.interpolate({
			inputRange:[0, w50, width],
			outputRange:['rgba(255, 0, 0, 1)', 'rgba(0, 0, 0, 0)', 'rgba(14, 189, 52, 1)'],
			extrapolate:'clamp'
		});
		const {
			busy
		} = this.state;
		const {
			status
		} = this.props;
		const pointerEvents = busy ? undefined : 'none';
		const sts = helper.getActionData(status);
		return (
			<View style={s.actionBar}>
		     <View style={{width:'100%',flexDirection:'row'}}>
		      <View style={{width:'50%',height:70,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
		       <Text style={{fontSize:17,color:helper.silver,fontFamily:'sans-serif'}}>Reject</Text>
		      </View>
		      <View style={{width:'50%',height:70,justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
		       <Image style={{marginLeft:27,width:70,height:40}} resizeMode='contain' source={require('assets/icons/ic_direction_arrows.png')} />
		       <Text style={{marginRight:10,fontSize:17,fontWeight:'bold',color:helper.silver,fontFamily:'sans-serif'}}>{sts}</Text>
		      </View>
		     </View>		     
		     <Animated.View
		      style={{
		      	width:55,height:55,borderRadius:100,position:'absolute',backgroundColor:helper.blk,
	            transform: [{ translateX: this.panX }, { translateY:7 }]
	          }}
	          {...this.panResponder.panHandlers}
		     >
		     <Image style={{width:55,height:55}} source={require('assets/icons/start_ride.png')} />		     
		     </Animated.View>		     
		     <Animated.View pointerEvents={pointerEvents} style={{width:'100%',height:'100%',position:'absolute',opacity,backgroundColor,justifyContent:'center',alignItems:'center'}}>
		      <Text style={{color:helper.white,fontSize:16,fontWeight:'bold'}}>Updating</Text>
		     </Animated.View>
		     <PayModel ref={ref => this.payModel = ref} />
			</View>
		)
	}
}

class BoxData extends Component {
	constructor(props){
		super(props)
		this.state = {
			renderType:0
		}		
		this.STRING = 1;
		this.TABLE = 2;
		this.API = 3;
	}
	componentDidMount(){
		const {data} = this.props.data;				
		if(typeof data == 'string' || typeof data == 'number'){
			this.setState({renderType:this.STRING})
		}else if(Array.isArray(data)){			
			if(data.length > 0){
				let header = [];
				let rows = [];
				data.forEach(row => {
					for(let k in row){
						if(header.indexOf(k) == -1){
							header.push(k);
						}
					}
				})				
				this.setState({renderType:this.TABLE,header,rows:data})
			}
		}else if(typeof data == 'object'){
		 if(data?.t != undefined && data.t == 'API')		  {
		 	this.setState({renderType:this.API});
		 }
		}
	}
	showTableData (title) {
		this.props.onTable({
			title,
			rows:this.state.rows,
			header:this.state.header
		})
	}
	render(){
		const {
			data
		} = this.props;		
		return (
			<View style={{width:'98%',alignSelf:'center',paddingTop:5,flexDirection:'row',paddingLeft:5,paddingBottom:5,borderBottomWidth:0.5,borderColor:helper.grey6,justifyContent:'space-between'}}>
	        <View style={{width:'70%'}}>
		        {this.renderContent(data)}
		    </View>
		    <View style={{height:40,justifyContent:'center',alignItems:'center'}}>
		        <View style={{backgroundColor:helper.grey1,padding:5,borderRadius:5}}>
				 <Text style={{fontSize:13,color:helper.blk,fontWeight:'bold',fontFamily:'sans-serif-medium'}}>{data.title}</Text>
				</View>
		    </View> 
		 </View>
		)
	}
	renderContent({data}){
		const {
			renderType
		} = this.state;
		if(renderType == 0){
			return null;
		}else if(renderType == this.STRING){
			return (
				<Text style={{fontSize:16,color:helper.silver,marginTop:5}}>{data}</Text>
			)
		}else if(renderType == this.TABLE){
			return (
				<TouchableNativeFeedback onPress={() => this.showTableData('Food Items')}><View style={{width:'100%',height:30,justifyContent:'center'}}>
				 <Text style={{fontSize:16,color:helper.silver}}>VIEW DATA</Text>
				</View></TouchableNativeFeedback>
			 )
		}else if(renderType == this.API){
			return (
				<Text style={{fontSize:16,fontWeight:'bold',color:helper.blk,marginTop:15}}>PRESS HERE ACTION</Text>
			)
		}
	}
}

class TableViewer extends Component {
	constructor(props){
		super(props)
		this.state = {
			title:'',
			rows:[],
			header:[],
			v:false
		}
	}
	show = (data) => {
		this.setState({...data, v:true})
	}
	close = () => {
		let data = {
			title:'',
			rows:[],
			header:[],
			v:false
		}
		this.setState(data);
	}
	render () {
		const {
			title,
			rows,
			header,
			v
		} = this.state;
		return (
		 <Modal onRequestClose={this.close} visible={v} transparent animationType="slide">
		  <View style={{backgroundColor:'#000000b4',height:'100%',width:'100%'}}>
		   <Text style={{marginLeft:10,fontSize:20,fontWeight:'bold',marginVertical:10,color:helper.white}}>{title}</Text>
		   <ScrollView>
			   {rows.map(row => {
			   	return (
			   		<View style={{width:'95%',marginVertical:10,borderRadius:7,padding:7,backgroundColor:helper.white,alignSelf:'center'}}>		  	
			   		{header.map(key => 
			   			<View style={{flexDirection:'row'}}>
				   			<Text style={{fontSize:15,color:helper.blk,marginVertical:5,fontWeight:'bold'}}>{key}: </Text>
				   			<Text style={{fontSize:15,color:helper.blk,marginVertical:5}}>{row[key]}</Text>
			   			</View>			   			
			   		)}
				    </View>
			   	)
			   })}
			</ScrollView>
		  </View>
		 </Modal>
		)
	}
}

class ReadyBar extends Component {
	constructor(props){
		super(props)
		this.state = {
			itemReady:false,
			busy:true,
			error:false
		}
	}
	componentDidMount(){
		//this.checkFoodReady();
	}
	checkFoodReady = async () => {		
		this.setState({busy:true});
		let order_id = this.props.order_id;
		var res = await request.perform('vendor_app', {
			req:'fd_ready',
			order_id
		});
		if(res)this.setState({busy:false});
		if(res?.status == 200){
			this.setState({foodReady:res.data})
		}else{
			this.setState({foodReady:false,error:true})
		}
	}
	render () {
		const {
			itemReady,
			busy,
			error
		} = this.state;
		return (
			<View style={[s.npi, {height:60}]}>
			 	<TouchableOpacity onPress={this.checkFoodReady} style={{justifyContent:'center',alignItems:'center',height:'100%',width:'100%'}}>
				 	 <Text style={{fontSize:18,fontWeight:'bold',color:itemReady ? helper.green : 'red'}}>{error ? 'Retry' : itemReady ? 'Item Ready' : 'Not Updated'}</Text>
			 	</TouchableOpacity>
			 	{busy ? <View style={{position:'absolute',width:'100%',height:60,justifyContent:'center',alignItems:'center',backgroundColor:'#00000051'}}><ActivityIndicator color={helper.blk} size={30} /></View> : null}
			</View>
		)
	}
}
class TextIcon extends Component {
	render () {
		const {
			icon,
			text,
			bold,
			medium,
			width
		} = this.props;
		let fontSize = 16;
		let fontWeight = '400';
		if(bold == true){
			fontSize = 17;
			fontWeight = 'bold';
		}else if(medium == true){
			fontSize = 17;			
		}
		return (
			<View style={{flexDirection:'row',alignItems:'center',width}}>
			 <Icon name={icon} color={helper.blk} size={18} />
			 <Text style={{marginLeft:10,fontFamily:'sans-serif-light',fontSize,color:helper.blk,fontWeight}}>{text}</Text>
			</View>
		)
	}
}

const s = StyleSheet.create({
	nkv:{width:'98%',alignSelf:'center',paddingVertical:3,paddingLeft:5,borderBottomWidth:0.5,borderColor:helper.grey6,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
	nkc:{height:50,justifyContent:'center',alignItems:'center'},
	nkd:{paddingLeft:5,width:200,fontSize:13,color:helper.silver},
	main:{flex:1,backgroundColor:helper.blk},
	btnStyle:{paddingVertical:5,paddingHorizontal:10,borderRadius:5,backgroundColor:helper.grey4},
	npi:{width:'95%',alignSelf:"center",flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:20,borderBottomWidth:0.7,borderColor:'#dcdcdc',minHeight:70},
	actionBar:{height:70,width:'100%',borderTopWidth:0.7,borderColor:helper.grey1}
})