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
import {Bar as Progressbar, Circle as ProgressCircle} from 'react-native-progress'
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import FCSheet from 'components/fCSheet';
import TaskCard from 'components/taskCard';
import OdrDetailsViewer from 'components/odrDetailsViewer';
const width = Dimensions.get('window').width;
export default class History extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tasks:[],
			busy:false,
			todayData:''
		}		
	}

	componentDidMount() {
		this.loadInitail();
	}

	loadInitail = () => {
		let today = new Date();
		let day = today.getDate() > 10 ? today.getDate() : "0"+today.getDate();
		let month = today.getMonth() + 1;
		month = month >= 10 ? month : "0"+month;		
		this.setState({
			currentDate:today			
		}, this.loadTasks)
	}

	showDetails = (earning) => {
		this.orderDetails.loadData('Earning Details', earning);
	}

	loadTasks = async () => {		
		if(this.state.busy == true){
			ToastAndroid.show("Please Wait...Loading!!", ToastAndroid.SHORT);
			return;
		}
		const start = new Date(this.state.currentDate.getTime());
		start.setHours(0);
		start.setMinutes(0);
		const end = new Date(this.state.currentDate.getTime());
		end.setHours(23);
		start.setMinutes(59);
		const start_stamp = parseInt(start.getTime() / 1000);
		const end_stamp = parseInt(end.getTime() / 1000);
		this.setState({busy:true,error:false,tasks:[]});
		Parse.Cloud.run('loadAgentEarning', {heroId,start_stamp,end_stamp}).then(({tasks, earning}) => {	 	  
		  this.setState({busy:false,tasks,earning});
		}).catch(err => {
			alert(err);
			this.setState({busy:false,error:true})
		});
	}

	openTask = (id, type) => {
		if(type == helper.PICKUP){
			// alert('PickupScreen')
			this.props.navigation.navigate('PickupScreen', {pickup_id:id})
		}else{
			// alert('DeliveryScreen')
			this.props.navigation.navigate('DeliveryScreen', {delivery_id:id})
		}
	}

	onChange = (d) => {
		let dateParts = d.split('-');
		let currentDate = new Date();
		currentDate.setUTCFullYear(parseInt(dateParts[2]));
		currentDate.setMonth(parseInt(dateParts[1]) - 1);
		currentDate.setDate(parseInt(dateParts[0]));				
		this.setState({currentDate}, this.loadTasks);
	}

	fCSheetOpened = () => {
		let earning = this.state.earning;
		let {noOfOrders,totalCash,totalEarning,tipAmt,floatingCash,pendingCash} = earning;
		if(noOfOrders == undefined)return;
		let entities = [];
		entities.push({key:'Floating Cash',value:floatingCash});
		entities.push({key:'Pending Cash',value:pendingCash});
		entities.push({key:'Total Orders',value:noOfOrders});
		entities.push({key:'Total Cash',value:totalCash});
		entities.push({key:'Total Earning',value:totalEarning});
		entities.push({key:'Total Tip',value:tipAmt});
		this.floatingCashSheet.setData(entities);
	}

	render() {
		const {
			tasks,
			busy,
			todayData,			
			completedTasks,
			currentDate,
			onlineAmt,
			codAmt
		} = this.state;
		return (
			<View style={helper.cont}>
			 <Header busy={busy} />
			 <View style={{width:'100%',alignItems:'center'}}><DatePicker		        
		        date={currentDate}
		        mode="date"
		        placeholder="Select Date"
		        format="DD-MM-YYYY"
		        minDate="01-01-2021"
		        customStyles={{				  
		          placeholderText: {
		          	fontWeight:'bold',color:helper.blk,fontSize:15
		          },
		          dateText: {
		          	fontWeight:'bold',color:helper.blk,fontSize:15
		          },
		          dateTouchBody:{
		          	height:30
		          },
						  dateInput: {    				    
						    borderWidth:0,						    
						    height:30,
						    alignSelf:'center',						    
						    backgroundColor:helper.primaryColor,
						    borderBottomLeftRadius:8,
								borderBottomRightRadius:8,
						  }
				}}		        
		        showIcon={false}
		        onDateChange={this.onChange}
		    /></View>
			 <FlatList
			  data={tasks}
			  contentContainerStyle={{paddingBottom:40}}
			  keyExtractor={(item) => item.id}
			  refreshControl={<RefreshControl refreshing={false} onRefresh={this.loadTasks} colors={[helper.primaryColor, "#000"]} />}
			  ListEmptyComponent={this.renderEmpty}
			  renderItem={this.renderTask}
			 />
			 {/*pendingTasks.length > 0 ?
			 	<View style={{height:50,width:'100%',justifyContent:'center',paddingLeft:10,backgroundColor:helper.primaryColor}}>
			 	 <Text style={{fontSize:18,fontWeight:'bold',color:helper.blk}}>Orders: {completedTasks} | Online: {onlineAmt} | COD: {codAmt}</Text>
			 	</View>
			 : null*/}
			 <BottomSheet
		        ref={ref => this.sheetRef = ref}
		        snapPoints={[29, 329]}
		        onOpenEnd={this.fCSheetOpened}
		        renderContent={this.renderFCS}
		     />
		     <View style={s.hr} />
		     <OdrDetailsViewer ref={ref => this.orderDetails = ref} />
			</View>
		)
	}

	renderFCS = () => <FCSheet date={this.state.currentDate} ref={ref => this.floatingCashSheet = ref} />

	renderEmpty = () => {
		return (
			<View style={s.emptyBox}>
			 <Icon name={'happy'} color={"#fbc02d"} size={120} />
			 <Text style={s.allClr}>All Clear</Text>
			 <Text style={s.empDesc}>No Tasks Availiable For Now</Text>
			</View>
		)
	}

	renderTask = ({item, index}) => <TaskCard onAction={this.openTask} data={item} onDetails={this.showDetails} />
}

class Header extends Component {
	render(){
		const {
			busy
		} = this.props;
		return (
			<View style={s.header.body}>
			  <View style={s.header.left}>			   
			   <Text style={s.header.text}>History</Text>
			  </View>			 
			  <View style={s.header.right}>
			   <Icon name={'menu'} size={30} color={helper.primaryColor} />
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
	  	alignItems:'center',	  	
	  	marginLeft:5
		},
	  right:{
	  	height:50,
	  	width:50,
	  	justifyContent:'center',
	  	alignItems:'center'
	  },
	  body:{
	  	justifyContent:'space-between',
	  	flexDirection:'row',
	    height:50,
	    borderBottomWidth:0.5,
	    borderColor:helper.grey1
	  }
	},
	empDesc:{fontSize:18,marginTop:10,color:helper.silver},
	allClr:{fontSize:25,fontWeight:'bold',marginTop:4,color:helper.silver},
	emptyBox:{width:'100%',height:250,marginTop:50,justifyContent:'center',alignItems:'center'},
  bnw:{width:'100%',height:'100%',justifyContent:'center',alignItems:'center'},
  aptc:{width:'95%',alignSelf:'center',borderRadius:6,marginVertical:5,backgroundColor:helper.white},	
  vpv:{width:'95%',alignSelf:'center',paddingVertical:10,borderBottomWidth:0.7,borderColor:helper.silver},
  vks:{fontSize:15,fontWeight:'bold',color:helper.blk},
  vkn:{fontSize:16,fontFamily:'sans-serif',fontWeight:'bold',color:helper.blk},
  njk:{fontSize:15,color:helper.grey},
  njb:{marginLeft:30,fontWeight:'600',fontSize:15,fontWeight:'bold',marginTop:2,color:helper.grey,fontFamily:'sans-serif-light'},
  opv:{width:'95%',alignSelf:'center',marginVertical:10,borderRadius:5,backgroundColor:helper.grn1,height:40,justifyContent:'center',alignItems:'center'},
  uil:{fontFamily:'sans-serif',fontSize:15,color:helper.white},
  hdr:{height:70,flexDirection:'row',width:'100%',justifyContent:'space-between',alignItems:'center',backgroundColor:helper.blk},
  icn:{height:70,width:40,justifyContent:'center',alignItems:'center'},
  hr:{width:'100%',position:'absolute',bottom:0,height:0.3,backgroundColor:helper.grey4},
}