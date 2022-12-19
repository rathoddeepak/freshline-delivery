import React, {Component} from 'react';
import {
	View,
	Text,
	FlatList,
	TouchableOpacity
} from 'react-native';
import helper from 'assets/helper';
import Icon from 'components/icon';
import moment from 'moment';
export default class AssignedViewer extends Component {
	constructor(props){
		super(props)
		this.state = {
			timeout:120			
		}
	}
	clear = () => {
		this.setState({assignedTasks:[]})
	}
	dispatchTasks = (assignedTasks) => {
		if(assignedTasks.length == 1){
			let task = assignedTasks[0];
			let timeout = this.state.timeout;			
			let timestamp = moment.unix(task.time);	    
			let time = moment().diff(timestamp, 'seconds');
			if(time <= timeout-5){
				this.handleSelect(task.id);
			}			
		}else{
			this.setState({assignedTasks});
		}
	}
	render(){
		const {
			assignedTasks
		} = this.state;
		return (
			<FlatList
			 renderItem={this.renderTask}
			 style={style.bottom}
			 data={assignedTasks}
			 keyExtractor={item => item.id}
			/>
		)
	}
	removeIndex = (index) => {
		let assignedTasks = this.state.assignedTasks;
		assignedTasks.splice(index, 1);
		this.setState({assignedTasks});
	}
	removeTask = (task_id) => {
		let assignedTasks = this.state.assignedTasks;
		let index = assignedTasks.findIndex(i => i.id == task_id);
		if(index != -1){
			assignedTasks.splice(index, 1);
			this.setState({assignedTasks});
		}		
	}
	handleSelect = (task_id, sound = true) => {
		this.props?.showTask(task_id, sound)
	}
	renderTask = ({item : {id,time}, index}) => {
		const timeout = this.state.timeout;
		return (
			<TouchableOpacity activeOpacity={0.6} onPress={() => this.handleSelect(id, false)} style={style.wrapper}>
			 <Text style={style.tS}>You Have An Order (<Timer selfDestruct={() => this.removeIndex(index)} timeout={timeout} timestamp={time} />)</Text>
			 <Icon name={'chv_up'} color={helper.primaryColor} size={20} />
			</TouchableOpacity>
		)
	}
}

class Timer extends Component {
	constructor(props){
		super(props)
		this.state = {
			time:undefined
		}
		this.interval = null;
	}
	componentDidMount(){		
		this.start()
	}
	componentWillUnmount(){
		this.stop();
	}
	start = () => {
	    let {timestamp, timeout} = this.props;	    
	    timestamp = moment.unix(timestamp);	    
		let time = moment().diff(timestamp, 'seconds');
		if(time >= timeout-5){
			this.stop();
			this.props?.selfDestruct();
			return;
		}
		this.setState({time:timeout - time});
		this.interval = setInterval(() => {			
			let time = this.state.time;
			time--;
			if(time == 0){
				this.stop();
				this.props?.selfDestruct();
				return;
			}
			this.setState({time});
		}, 1000);
	}
	stop = () => {
		if(this.interval != null)
			clearInterval(this.interval);
	}
	render(){
		const time = this.state.time;
		return <Text style={style.tS}>{time}</Text>
	}
}

const style = {
	tS:{
		fontSize:15,
		color:helper.primaryColor
	},
	wrapper:{
		padding:10,
		backgroundColor:helper.grey4,
		justifyContent:'space-between',
		flexDirection:'row',
		borderTopWidth:0.6,
		borderColor:helper.grey1
	},
	bottom:{position:'absolute',bottom:0,width:'100%'}
}