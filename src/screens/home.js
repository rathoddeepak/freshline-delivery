import React, { Component } from 'react';
import {
	View,
	Text,	
	Modal,
	Alert,
	FlatList,
	AppState,
	Vibration,
	Dimensions,
	StyleSheet,
	ToastAndroid,
	RefreshControl,
	PermissionsAndroid,
	TouchableNativeFeedback
} from 'react-native';
import {
	Dazar,
	Icon,
	TextIcon,
	FoodCardSmall,
	CountDown,
	Image
} from 'components';
import lang from 'assets/lang';
import helper from 'assets/helper';
import request from 'libs/request';
import OneSignal from 'react-native-onesignal';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import RNLocation from 'react-native-location';
import DateHeader from 'components/header/dateHeader';
import Parse from 'parse/react-native.js';
import AsyncStorage from '@react-native-community/async-storage';
import {Bar as Progressbar, Circle as ProgressCircle} from 'react-native-progress'
import moment from 'moment';
import Sound from 'react-native-sound';
import OrderEmpty from 'components/orderEmpty';
import Notch from 'components/notch';
import TaskCard from 'components/taskCard';
import TaskAccepter from 'components/taskAccepter';
import AssignedViewer from 'components/assignedViewer';
import RippleSwitch from 'libs/Switch/';
Sound.setCategory('Playback');
const {width, height} = Dimensions.get('window');
const emptyHeight = height - 200;
export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			notchText:lang.ld,
			pendingTasks:[],
			busy:false,
			foreground:true,
			appState:''
		}
		this.pageList = [];
		this.unsubscribe = null;
	}

	componentDidMount() {
		this.init();
		this.loadHome();
	}

	init = () => {
		AppState.addEventListener("change", this._handleAppStateChange);
		OneSignal.sendTags({status: "loggedin", heroid:heroId });
    OneSignal.setNotificationWillShowInForegroundHandler(notifReceivedEvent => {    	
    	if(this.state.foreground){
    		let notif = notifReceivedEvent.getNotification();
	      notifReceivedEvent.complete(null);
	      this.checkForTasks(false, true);
    	}
    });
		ReactNativeForegroundService.stop();
		this.checkForTasks();
		this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.loadHome();
    });
	}

	componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
    if(this.unsubscribe != null){
    	this.unsubscribe();
    }
  }

  _handleAppStateChange = nextAppState => {
  	let foreground = false;
    if (this.state.appState.match(/inactive|background/) && nextAppState === "active") {
      this.checkForTasks(false)
      foreground = true
    }
    this.setState({ appState: nextAppState, foreground});
  };

	checkForTasks = async (loadData = true, ps = false) => {		
		try {
	      let taskId = await AsyncStorage.getItem('taskId');
	      let created = await AsyncStorage.getItem('created');	      
	      if(created){
	      	created = parseInt(created);
	      	var notificationArrived = moment(created);
					var nowTime = moment();
					var duration = moment.duration(nowTime.diff(notificationArrived));
					var seconds = duration.asSeconds();
					if(seconds <= 120){
						this.showTaskAccepter(taskId, true);
					}else if(loadData){
						this.loadHome();
					}
		    }
    } catch(e) {    	
      if(loadData){
				this.loadHome();
			}
    }
    if(loadData){
			setTimeout(() => {
	    	this.permission();
	    }, 500);
		}    
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

	permission = async (v) => {
	  	try {
	  		const backgroundgranted = await PermissionsAndroid.request(
			  PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
			  {
			    title: 'Background Location Permission',
			    message:
			      'We need access to your location ' +
			      'so you can get live quality updates.',
			    buttonNeutral: 'Ask Me Later',
			    buttonNegative: 'Cancel',
			    buttonPositive: 'OK',
			  },
			);
			//if (backgroundgranted === PermissionsAndroid.RESULTS.GRANTED) {
			   this.startService();
			//}
	  	} catch (er) {
	  		console.log(er)
	  	}
	  }

	  startService = () => {  	
	  	RNLocation.configure({
			  distanceFilter: 4, // Meters
			  desiredAccuracy: {
			    ios: 'best',
			    android: 'highAccuracy',
			  },
			  // Android only
			  androidProvider: 'auto',
			  interval: 5000, // Milliseconds
			  fastestInterval: 10000, // Milliseconds
			  maxWaitTime: 5000, // Milliseconds
			  // iOS Only
			  activityType: 'other',
			  allowsBackgroundLocationUpdates: false,
			  headingFilter: 1, // Degrees
			  headingOrientation: 'portrait',
			  pausesLocationUpdatesAutomatically: false,
			  showsBackgroundLocationIndicator: false,
		});
		let locationSubscription = null;
		let locationTimeout = null;
		let lat = -1;
		let lng = -1;
		ReactNativeForegroundService.add_task(
		  () => { 	
		    RNLocation.requestPermission({
		      ios: 'whenInUse',
		      android: {
		        detail: 'fine',
		      },
		    }).then((granted) => {    
		      if (granted) {
		        locationSubscription && locationSubscription();
		        locationSubscription = RNLocation.subscribeToLocationUpdates(
		          ([locations]) => {
		            locationSubscription();
		            locationTimeout && clearTimeout(locationTimeout);				                       
		            if(lat != locations.longitude && lng != locations.latitude){		            	
		            	lat = locations.longitude;
		            	lng = locations.latitude;		            	
		            	Parse.Cloud.run('hl', {id:heroId,lg:locations.longitude,lt:locations.latitude})		            	
		            }
		          },
		        );

		      } else {
		        locationSubscription && locationSubscription();
		        locationTimeout && clearTimeout(locationTimeout);
		      }
		    });
		  },
		  {
		    delay: 1000,
		    onLoop: true,
		    taskId: 'taskid',
		    onError: (e) => console.log('Error logging:', e),
		  },
		)
		setTimeout(() => {
			ReactNativeForegroundService.start({
			  id: 1212,
			  title: "Updating Location",
			  message: "You Location is Live",
			});
		}, 1000)
	}

	loadHome = () => {
	 if(this.state.busy == true){
	 	ToastAndroid.show("Please Wait...Loading!!", ToastAndroid.SHORT);
	 	return;
	 }
	 this.setState({busy:true,error:false,pendingTasks:[],notchText:lang.ld});
	 this.assignedViewer.clear();
	 Parse.Cloud.run('loadAgentHome', {heroId}).then(({pending, notchText, assigned, status}) => {	 	  
      this.setState({busy:false,pendingTasks:pending,notchText,status}, () => {
      	this.assignedViewer.dispatchTasks(assigned);
      });
   }).catch(err => {
		 	alert(err)
		  this.setState({busy:false,error:true})
   });
	}

	showTaskAccepter = (task_id, sound) => {
		this.taskAccepter.show(task_id, sound)
	}

	taskAcceptFail = (task_id) => {
	 this.assignedViewer.removeTask(task_id)	
	}

	profile = () => this.props.navigation.navigate('Profile');
	history = () => this.props.navigation.navigate('History');

	handleDlS = () => {

	}

	render() {
		const {
			notchText,
			pendingTasks,
			busy
		} = this.state;
		return (
			<View style={s.main}>
			 <Header busy={busy} ref={ref => this.header = ref} />
			 <Notch data={notchText} pos='top' />
			 <FlatList
			  data={pendingTasks}			  
			  keyExtractor={(item) => item.id}
			  refreshControl={<RefreshControl refreshing={false} onRefresh={this.loadHome} colors={[helper.primaryColor, "#000"]} />}			  
			  ListHeaderComponent={this.renderHeader}
			  ListEmptyComponent={<View style={{height:emptyHeight,justifyContent:'center'}}><OrderEmpty /></View>}
			  renderItem={this.renderTask}
			 />
			 
			 <View style={s.hr} />			 
			 <AssignedViewer
			  ref={ref => this.assignedViewer = ref}
			  showTask={this.showTaskAccepter}
			 />
			 <TaskAccepter
			  ref={ref => this.taskAccepter = ref}
			  onAccepted={this.loadHome}
			  onFail={this.taskAcceptFail}
			 />
			</View>
		)
	}
	renderTask = ({item, index}) => {
		return (
			<TaskCard
			  data={item}
				onAction={this.openTask}
		  />
	  )
  }
}

class Header extends Component {
	constructor(props){
		super(props)
		this.state = {

		}
	}

	render(){
		const {
			busy
		} = this.props;
		return (
			<View style={s.header.body}>
			  <View style={s.header.left}>
			   <Text style={s.header.logo}>Famdel </Text>
			   <Text style={s.header.text}>| HERO</Text>
			  </View>			 
			  <View style={s.header.right}>
				  <DutyBar />
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

class DutyBar extends Component {
	constructor(props){
		super(props)
		this.state = {
			status:-1
		}
	}
	componentDidMount () {
		this.loadData();
	}
	loadData = async () => {
		try {
			this.setState({status:-1})
			const query = new Parse.Query(helper.tbls.AG);
			query.select(['status']);
			query.equalTo("objectId", heroId);
			let results = await query.find();
			if(results.length > 0){											
				this.setState({status:results[0].attributes.status})				
			}else{
				this.setState({status:-2})
			}
		} catch (err) {
			this.setState({status:-2})
		}
	}
	getBg = (status) => {
		if(status === -3){
			return {c:helper.primaryColor,t:'Updating...'}
		}else if(status === -1){
			return {c:helper.grey,t:'Checking...'}
		}else if(status === -2){
			return {c:helper.grey,t:'RETRY'}
		}else if(status === 0){
			return {c:helper.grey,t:'OFFLINE'}
		}else if(status === 1){
			return {c:helper.green,t:'ONLINE'}
		}else if(status === 2){
			return {c:helper.startColor,t:'BUSY'}
		}
	}
	updateSts = () => {
		Alert.alert(
	      "Change Status",
	      "Select Your Status",
	      [
	        {
	          text: "Cancel"
	        },
	        {
	          text: "Offline",
	          onPress: () => this.saveStatus(helper.HERO_OFFLINE)
	        },
	        {
	        	text: "Online",
	        	onPress: () => this.saveStatus(helper.HERO_ONLINE)
	        }	        
	      ]
	    )
	}
	saveStatus = async (s) => {
		this.setState({status:-3});
		Parse.Cloud.run('heroStatus', {heroId,status:s}).then(({status, code}) => {			
      this.setState({status:code == 3 ? status : -2}, () => {
      	if(status == helper.HERO_OFFLINE){
					ReactNativeForegroundService.stop();
				}
      });
    }).catch(err => {
      this.setState({status:-2})
    });
	}
	render () {
		const {
			status
		} = this.state;
	  const d = this.getBg(status)	  
		return (
				<TouchableNativeFeedback onPress={this.loadData} onLongPress={this.updateSts}><View style={{height:30,borderRadius:10,backgroundColor:d.c,width:90, justifyContent:'center',alignItems:'center'}}>
				 <Text style={{color:helper.blk,fontSize:13,fontWeight:'bold'}}>{d.t}</Text>
				</View></TouchableNativeFeedback>
		)
	}
}

const s = {
	main:{
		width:'100%',
		height:'100%',
		backgroundColor:'#000'
	},
	header:{
		text:{
			fontWeight:'bold',
			color:helper.primaryColor,
			fontSize:20
		},
		logo:{			
			color:helper.primaryColor,
			fontSize:22,
			fontWeight:'bold'
		},
		left:{
			height:50,	  	
	  	justifyContent:'center',
	  	alignItems:'center',
	  	flexDirection:'row',
	  	marginLeft:5
		},
	  right:{
	  	height:50,
	  	width:100,
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
	hr:{width:'100%',position:'absolute',bottom:0,height:0.3,backgroundColor:helper.grey1},
	bnw:{width:'100%',height:'100%',justifyContent:'center',alignItems:'center'},
  aptc:{width:'95%',alignSelf:'center',borderRadius:6,marginVertical:5,backgroundColor:helper.white},	
  vpv:{width:'95%',alignSelf:'center',paddingVertical:10,borderBottomWidth:0.7,borderColor:helper.silver},
  vks:{fontSize:15,fontWeight:'bold',color:helper.blk},  
  njk:{fontSize:15,color:helper.grey},  
  opv:{width:'95%',alignSelf:'center',marginVertical:10,borderRadius:5,backgroundColor:helper.grn1,height:40,justifyContent:'center',alignItems:'center'},
  uil:{fontFamily:'sans-serif',fontSize:15,color:helper.white}
}