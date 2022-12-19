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
import moment from 'moment';
import Parse from 'parse/react-native.js';
import request from 'libs/request';
import PayModel from 'components/payModel';
const {width,height} = Dimensions.get('window');
const startPosX = (width / 2) - 29;
const w80 = width * 80 / 100;
const w50 = width * 50 / 100;
const w20 = width * 20 / 100;
const TASK_PICKUP = 0;
const TASK_DELIVERY = 1;
export default class TaskScreen extends Component {
	constructor(props){
		super(props)
		this.state = {
			time:'',
			taskType:'',
			status:{},
			customer:{},
			address:{},
			prepaid:false,
			showAction:false
		}
	}
	componentDidMount(){		
		const {taskType, data} = this.props.route.params;
		this.setData(taskType, data);
	}
	handleStatusChange = (newStatus) => {
		let data = this.state.tempData;
		if(this.state.taskType == TASK_PICKUP){			
			data.status.p = newStatus;
			if(newStatus == helper.FLEETX_COMPLETE){
				this.setData(TASK_DELIVERY, data);
				return
			}else if(newStatus == helper.FLEETX_CANCEL){
				this.props.navigation.goBack();
			}
		}else{			
			if(newStatus == helper.FLEETX_CANCEL || newStatus == helper.FLEETX_COMPLETE){
				this.props.navigation.goBack();
			}
			data.status.d = newStatus;
		}
		this.setData(this.state.taskType, data);
	}
	setData = (taskType, data) => {		
		const {id, time, order_id, pickup, delivery, status, pickPoint, dlvPoint} = data;		
		let customer = null;
		let address = null;
		let dataList = [];
		let showAction = false;
		let prepaid = delivery.pay_mode == 'ONLINE';
		if(taskType == helper.PICKUP){
			customer = {				
				name:pickPoint.name,
				phone:pickup.phone
			}
			address = {
				lat:pickPoint.lat,
				lng:pickPoint.lng,
				val:pickup.address
			}
			for(var key in pickup){
				if(key != 'phone'){
					let title = key.toUpperCase().replace(/_/g, ' ');									
					dataList.push({title, data:pickup[key]});
				}				
			}
			showAction = status.p < helper.FLEETX_COMPLETE;
		}else{
			customer = {
				name:dlvPoint.name,
				phone:delivery.phone
			}
			address = {
				lat:dlvPoint.lat,
				lng:dlvPoint.lng,
				val:delivery.address
			}			
			for(var key in delivery){
				if(key != 'phone'){
					let title = key.toUpperCase().replace(/_/g, ' ');					
					dataList.push({title, data:delivery[key]});
				}
			}
			showAction = status.d < helper.FLEETX_COMPLETE;			
		}
		this.setState({
			time,
			order_id,
			customer,
			address,
			taskType,
			status,
			id,
			dataList,
			showAction,
			prepaid,
			tempData:data
		})
	}	
	switchToPickup = () => {
		this.setState({dataList:[]}, () => {
			this.setData(helper.PICKUP, this.state.tempData);
		})		
	}
	render(){				
		const {
			id,
			order_id,
			dataList,
			taskType,
			status,
			showAction,
			prepaid
		} = this.state;		
		return (
			<View style={s.main}>
			 <View style={{height:70,flexDirection:'row',alignItems:'center',paddingLeft:10}}>
			  <Icon name={'arw_back'} color={helper.white} size={28} />
			  <Text style={{marginLeft:10,fontSize:16,color:helper.white}}>{id} | #{order_id}</Text>
			 </View>
			 <FlatList
			  style={{backgroundColor:helper.white,borderTopRightRadius:10,borderTopLeftRadius:10,width:'97%',alignSelf:'center'}}
			  ListHeaderComponent={this.renderHeader}
			  data={dataList}
			  keyExtractor={(item, index) => index}
			  renderItem={this.renderBox}
			 />
			 {showAction ? <TaskActionBar 
				  id={id}
				  taskType={taskType}
				  status={status}
				  onNewStatus={this.handleStatusChange}				  
				  goToPickup={this.switchToPickup}
				  alreadyPaid={prepaid}
			 /> : null}
			 <TableViewer ref={ref => this.tableViewer = ref} />
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
	renderHeader = () => {
		const {
			time,
			order_id,
			customer,
			address,
			status,
			taskType
		} = this.state;
		const taskName = taskType == TASK_PICKUP ? 'Pickup' : 'Delivery';
		const taskIndex = taskType == TASK_PICKUP ? status.p : status.d;
		const {text, color} = helper.getStatusData(taskIndex);
		return (
		<>
		 <View style={s.npi}>
		 	<TextIcon icon={'clock'} text={`${time} - ${taskName}`} bold />
		 	<Text style={{fontSize:18,fontWeight:'bold',fontFamily:'sans-serif-light',color}}>{text}</Text>
		 </View>
		 <View style={s.npi}>
		 	<TextIcon width={'60%'} icon={'user'} text={customer.name} bold />
		 	<TouchableOpacity onPress={() => this.call(customer.phone)} style={{width:40,height:40,borderRadius:80,backgroundColor:helper.grn1,justifyContent:'center',alignItems:'center'}}>
		 	 <Icon name='phone' size={20} color={helper.white} />
		 	</TouchableOpacity>
		 </View>
		 <View style={s.npi}>
		 	<TextIcon width={'60%'} icon={'pin'} text={address.val} medium/>
		 	<TouchableOpacity onPress={() => this.address(address.lat, address.lng)} style={{width:40,height:40,borderRadius:80,backgroundColor:'#4694f8',justifyContent:'center',alignItems:'center'}}>
		 	 <Icon name='direction' size={20} color={helper.white} />
		 	</TouchableOpacity>
		 </View>
		 <View style={s.npi}>
		 	<TextIcon width={'60%'} icon={'receipt'} text={'ORDER ID #' + order_id} bold />		 	
		 </View>
		 {taskType == TASK_PICKUP && order_id != undefined ? <ReadyBar order_id={order_id} /> : <View style={{height:40}} />}
	    </>
		)
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
	          	this.cloudPerform('cancelTask', helper.FLEETX_CANCEL, {taskType:this.state.taskType});
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
	successAction = () => {
		let err = 'Invalid Action Please Restart You App Again';
		let {taskType, status} = this.props;		
		let cloudAction = undefined;
		let newStatus = undefined;
		if(taskType == helper.PICKUP){
			if(status.p == helper.FLEETX_UNASSIGNED){
				alert(err);
				this.panX.setValue(0);	
				return;
			}else if(status.p == helper.FLEETX_ASSIGNED){
				cloudAction = 'startPickup';
				newStatus = helper.FLEETX_START;
			}else if(status.p == helper.FLEETX_START){
				cloudAction = 'completePickup';
				newStatus = helper.FLEETX_COMPLETE;
			}			
		}else if (taskType == helper.DELIVERY){
			if(status.d == helper.FLEETX_UNASSIGNED){
				alert(err);
				this.panX.setValue(0);	
				return;
			}else if(status.d == helper.FLEETX_ASSIGNED){
				if(status.p != helper.FLEETX_COMPLETE){
					this.panX.setValue(0);
					Alert.alert(
				      "Pickup Pending",
				      "To Start Pickup You Must Complete Pickup related to task",
				      [
				        {
				          text: "Go To Pickup",
				          onPress: () => this.props.goToPickup()
				        },
				        {text: "Ok"}	        
				      ]
				    )
				    return;
				}
				cloudAction = 'startDelivery';
				newStatus = helper.FLEETX_START;				
			}else if(status.d == helper.FLEETX_START){				
				this.paySelection();				
				return;
			}			
		}
		if(cloudAction == undefined){
			alert(err);
			this.panX.setValue(0);
			return;
		}else{
			this.cloudPerform(cloudAction, newStatus);
		}		
	}
	paySelection = () => {		
		let cloudAction = 'completeDelivery';
		let newStatus = helper.FLEETX_COMPLETE;
		if(this.props.alreadyPaid == true){
			this.cloudPerform(cloudAction, newStatus, {payType:helper.RAZORPAY})
		}else{
			this.payModel.show(payType => {				
				if(payType == -1){
					this.panX.setValue(0)
				}else{				
					this.cloudPerform(cloudAction, newStatus, {payType})
				}
			});	
		}		
	}
	cloudPerform = async (cloudAction, newStatus, extra = {}) => {
		try {
			this.setState({busy:true})						
			const response = await request.taskAction(cloudAction, {agent_id:user_id,taskId:this.props.id, ...extra});
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
			outputRange:[1, 0, 1],
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
			taskType,
			status
		} = this.props;
		const pointerEvents = busy ? undefined : 'none';
		const sts = helper.getActionData(taskType == TASK_PICKUP ? status.p : status.d);
		return (
			<View style={s.actionBar}>
		     <View style={{width:'100%',flexDirection:'row'}}>
		      <View style={{width:'50%',height:70,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
		       <Text style={{fontSize:17,color:helper.silver,fontFamily:'sans-serif'}}>Cancel</Text>
		      </View>
		      <View style={{width:'50%',height:70,justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
		       <Image style={{marginLeft:27,width:70,height:40}} resizeMode='contain' source={require('assets/icons/ic_direction_arrows.png')} />
		       <Text style={{marginRight:10,fontSize:17,fontWeight:'bold',color:helper.blk,fontFamily:'sans-serif'}}>{sts}</Text>
		      </View>
		     </View>		     
		     <Animated.View
		      style={{
		      	width:55,height:55,borderRadius:100,position:'absolute',backgroundColor:helper.white,
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
			<View style={{marginVertical:10}}>
				<View style={{width:'100%',height:30,backgroundColor:'#fafafa',borderColor:'#dcdcdc',justifyContent:'center',borderTopWidth:0.7,borderBottomWidth:0.7}}>
				 <Text style={{fontSize:13,color:helper.blk,marginLeft:10,fontWeight:'bold',fontFamily:'sans-serif-thin'}}>{data.title}</Text>
				</View>
				{this.renderContent(data)}
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
				<Text style={{fontSize:16,color:helper.blk,marginLeft:10,marginTop:15}}>{data}</Text>
			)
		}else if(renderType == this.TABLE){
			return (
				<TouchableNativeFeedback onPress={() => this.showTableData('Food Items')}><View style={{width:'100%',height:30,justifyContent:'center',marginLeft:10,backgroundColor:helper.white}}>
				 <Text style={{fontSize:16,fontWeight:'bold',color:helper.blk}}>VIEW DATA</Text>
				</View></TouchableNativeFeedback>
			 )
		}else if(renderType == this.API){
			return (
				<Text style={{fontSize:16,fontWeight:'bold',color:helper.blk,marginLeft:10,marginTop:15}}>PRESS HERE ACTION</Text>
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
			foodReady:false,
			busy:true,
			error:false
		}
	}
	componentDidMount(){
		this.checkFoodReady();
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
			foodReady,
			busy,
			error
		} = this.state;
		return (
			<View style={[s.npi, {height:60}]}>
			 	<TouchableOpacity onPress={this.checkFoodReady} style={{justifyContent:'center',alignItems:'center',height:'100%',width:'100%'}}>
				 	 <Text style={{fontSize:18,fontWeight:'bold',color:foodReady ? helper.green : 'red'}}>{error ? 'Retry' : foodReady ? 'Food Ready' : 'Food Not Ready'}</Text>
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
	main:{flex:1,backgroundColor:helper.blk},
	npi:{width:'95%',alignSelf:"center",flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:20,borderBottomWidth:0.7,borderColor:'#dcdcdc',minHeight:70},
	actionBar:{height:70,elevation:24,width:'100%',backgroundColor:helper.white}
})