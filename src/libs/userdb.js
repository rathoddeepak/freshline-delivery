import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';
let cb = new Datastore({
	storage:AsyncStorage,
	filename: 'usrdta',
	autoload: true
});
let user = null;
const UserDB = {
	init(callback = false) {
		cb = new Datastore({
			storage:AsyncStorage,
			filename: 'usrdta',
			autoload: true
		});	
		cb.findOne({_id:'si'}, (err, fs) => {
			user = fs;
			if(callback)callback();
		});
	},
	setUser({id,first_name,last_name}, callback){
		let usr = {_id:'si',id,first_name,last_name};
		user = usr;
		global.heroId = id;			
		cb.findOne({_id:'si'}, (err, it) => {		    			
			if(it == null || it == undefined){	
				cb.insert(usr, (e, n) => {
					//console.log("these caled ->", e, n)
				});
			}else{
			    cb.remove({}, {multi: true}, (e, n) => cb.insert(usr, (e, n) => {
			    	//console.log("these caled -> ", e, n)
			    }));				
			}
			if(callback)callback();
		});
	},	
	getUser(){		
		return user;
	},
	flush(){
		user = null;
		cb.remove({}, {multi: true}, (e, n) => {});		
	}
}

export default UserDB;