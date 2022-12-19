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
	TouchableNativeFeedback,
	TouchableOpacity
} from 'react-native';
import Icon from './icon';
import lang from 'assets/lang';
import helper from 'assets/helper';
import request from 'libs/request';
import DateHeader from './header/dateHeader';
import Parse from 'parse/react-native.js';
import AsyncStorage from '@react-native-community/async-storage';
import {Circle as ProgressCircle} from 'react-native-progress'
import moment from 'moment';
import Sound from 'react-native-sound';
import TaskCard from './taskCard';
import SingleSlider from './singleSlider';
import MapboxGL from '@react-native-mapbox-gl/maps';
import _ from 'lodash';
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

export default class TaskAccepter extends Component {
	constructor(props){
		super(props)
		this.state = {
			task_id:'',
			v:false,
			busy:false,
			taskData:{},
			mapMarkers:[]
		}
	}

	show = async (task_id, sound = false) => {
		this.setState({
			task_id,
			busy:true,
			v:true,
			taskData:{},
			mapMarkers:[]
		});		
		let valid = [helper.FLEETX_ASSIGNED, helper.FLEETX_UNASSIGNED, helper.FLEETX_AUTO]
		Parse.Cloud.run("getTaskData", {task_id, location:true}).then(({status, data}) => {
			if(status == 200){
				if(data.hero_id == undefined || data.hero_id.length != 0){
					this.handleClose();
				}else if(valid.indexOf(data.agent_status) == -1){
					this.handleClose();
				}
				this.setState({taskData:data,busy:false}, () => {
					this.setupMap();
				});
			}else{
				this.fail();
			}
		}).catch(err => {
			alert(err)
			this.fail();
		})
		if(sound){
			//this.playSound();
		}		
	}

	setupMap = () => {
		let {deliveries, pickups} = this.state.taskData;
		let bounds = [];
		let mapMarkers = [];
		for(let pickup of pickups){
			let {longitude, latitude} = pickup.location;
			mapMarkers.push({coord:[longitude, latitude],color:helper.startColor})
			bounds.push([longitude, latitude])
		}
		for(let delivery of deliveries){
			let {longitude, latitude} = delivery.location;
			mapMarkers.push({coord:[longitude, latitude],color:helper.unasgColor})
			bounds.push([longitude, latitude])
		}		
		let finalBounds = getBounds(bounds);
		this.setState({mapMarkers}, () => {
			setTimeout(() => {
				this.mapCamera?.fitBounds(finalBounds[0], finalBounds[1], 60, 100);
			}, 500)
		});
	}

	handleClose = () => {
		this.setState({v:false})
	}

	fail = () => {
		this.setState({v:false,busy:false,taskData:{}}, () => {
			this.props?.onFail(this.state.task_id);
		});	
	}

	playSound = () => {
		var siren = new Sound('siren.mp3', Sound.MAIN_BUNDLE, (error) => {		  
		  if(error)return;
		  siren.play()
		  setTimeout(() => {
	      	siren.stop(() => {
	      		siren.release();
			});				
	      }, 1500)
		});
	}

	update = () => {
		const {busy, taskData} = this.state;
		if(busy == true){
			if(taskData?.id == undefined){
				alert('Task Data Not Loaded Yet!');
			}else{
				alert('Already Working On It!');
			}			
			return;
		}
		this.accept();
	}

	accept = async () => {
		this.setState({busy:true})
		Parse.Cloud.run("agentAcceptTask", {task_id:this.state.task_id, heroId}).then(({status, data}) => {
			if(status == 200){
				this.setState({busy:false,v:false}, () => {				
					this.props.onAccepted();
				});
			}else{
				this.setState({busy:false})
				alert(helper.again);
			}
		}).catch(err => {
			this.setState({busy:false})
			alert(helper.again);
		})
	}

	render(){
		const {
			v,
			busy,
			taskData,
			mapMarkers
		} = this.state;
		return (
			<Modal animationType="slide" visible={v}>
			 <View style={s.main}>
			  
			  <TouchableOpacity style={s.closeBtn} onPress={this.handleClose}>
			   <Text style={s.closeFont}>X  DENY</Text>
			  </TouchableOpacity>

			  <View style={s.body}>
			   {busy ?
			   	<ProgressCircle
					indeterminate
					size={50}
					color={helper.primaryColor}
			    />
			   : 
			    <>				     
				     <View style={s.mapCont}>
				      <MapboxGL.MapView style={{flex:1}} styleURL={MapboxGL.StyleURL.Dark}>						      
					   {this.renderMarkers(mapMarkers)}					   
					   <MapboxGL.Camera ref={ref => this.mapCamera = ref} />
					  </MapboxGL.MapView>
				     </View>
				     <Text style={s.nTask}>New Task!</Text>
				     <TaskCard data={taskData} />
			    </>
			   }
			  </View>
			  <View style={s.footer}>
			   <SingleSlider sts={'Accept'} updating={this.update} />
			  </View>
			 </View>
			</Modal>
		);
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

const s = {
	body:{
		flex:1,
		width:'100%',		
		justifyContent:'center',
		alignItems:'center'
	},
	main:{
		height:'100%',
		width:'100%',
		backgroundColor:helper.blk
	},
	closeFont:{
		color:'#EC7777',
		fontSize:15,
		fontFamily:'sans-serif-light'
	},
	mapProCont:{
		position:'absolute',
		top:0,
		left:0
	},
	nTask:{
		fontFamily:'sans-serif',
		fontSize:24,		
		color:helper.silver,
		marginVertical:10
	},
	mapCont:{
		height:250,
		width:250,		
		borderRadius:250,
		borderWidth:2,
		borderColor:helper.primaryColor,
		backgroundColor:helper.grey4,
		overflow:'hidden'
	},
	closeBtn:{
		top:10,
		right:10,
		width:90,
		padding:6,
		borderRadius:5,
		borderWidth:0.7,
		borderColor:'#EC7777',		
		alignItems:'center',
		position:'absolute'
	},
	footer:{
		height:70,
		width:'100%',
		borderTopWidth:0.6,
		borderColor:helper.grey1
	}
}