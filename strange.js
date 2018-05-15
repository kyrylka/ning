if(!dojo.hostenv.findModule("xg.components.chat.server.Formatter",false)){
dojo.provide("xg.components.chat.server.Formatter");
xg.components.chat.server.Formatter=(function(){
var _1={};
var _={};
_1.toRoom=function(_3,_4){
if(!("users" in _3)){
_3.users=[];
}
var _5=x$.map(_3.users,function(_6){
return _1.toUser(_6,_4);
});
return xg.components.chat.models.Room(_3.type,_3.roomId,_3.name,_3.iconUrl,_3.currentUserInRoom,_3.hiddenFromCurrentUser,_3.groupCreator,_5,_4.user,_3.unreadCount,_4);
};
_1.toMessage=function(_7,_8){
return {id:_7.messageId,sender:_1.toUser(_7.sender,_8),messageOrFile:_7.file||_7.body,timestamp:_7.createDate,targetRoomId:_7.roomId,seen:_7.seen};
};
_1.toUser=function(_9,_a){
return _a.getOrCreateUser(_9.ningId,_9.name,_9.iconUrl,_9.online,_9.blockedByCurrentUser);
};
_1.fromUser=function(_b){
return {ningId:_b.getId(),name:_b.getName(),iconUrl:_b.getAvatarUrl(),online:_b.isOnline};
};
return _1;
})();
}
if(!dojo.hostenv.findModule("xg.shared.EventRegistry",false)){
dojo.provide("xg.shared.EventRegistry");
xg.shared.EventRegistry=(function(){
var _={};
var _2={};
_.eventListeners={};
_2.fire=function(_3,_4){
var _5=_.eventListeners[_3];
if(!_5){
return;
}
var _6=[];
x$.each(_5,function(_7,_8){
_6.push(_8(_4));
});
return _6;
};
_2.listen=function(_9,_a){
if(!_.eventListeners[_9]){
_.eventListeners[_9]=[];
}
_.eventListeners[_9].push(_a);
};
_2.listenMultiple=function(_b){
x$.each(_b,function(_c,_d){
_2.listen(_c,_d);
});
};
_2.unlisten=function(_e,_f){
var _10=_.eventListeners[_e];
if(!_10){
return;
}
_.eventListeners[_e]=x$.grep(_10,function(_11,_12){
return _11!==_f;
});
};
_2.listenOnce=function(_13,_14){
if(_.eventListeners[_13]){
for(var i=0;i<_.eventListeners[_13].length;i++){
if(_.eventListeners[_13][i]+""===_14+""){
return;
}
}
}
_2.listen(_13,_14);
};
return _2;
})();
}
if(!dojo.hostenv.findModule("xg.components.chat.models.Room",false)){
dojo.provide("xg.components.chat.models.Room");
xg.components.chat.models.Room=function(_1,id,_3,_4,_5,_6,_7,_8,_9,_a,_b){
var _c={};
var _={};
_.SAMPLE_USER_COUNT=5;
_.internalId;
_.initialize=function(){
if(!xg.components.chat.models.Room.internalIdCounter){
xg.components.chat.models.Room.internalIdCounter=0;
}
xg.components.chat.models.Room.internalIdCounter+=1;
_.internalId=xg.components.chat.models.Room.internalIdCounter;
_8=_8.slice(0,_.SAMPLE_USER_COUNT);
xg.shared.EventRegistry.listen("xg.components.chat.models.User.nameChanged",function(_e){
if(!_3&&_1=="PRIVATE"&&_8.indexOf(_e)>-1){
xg.shared.EventRegistry.fire("xg.components.chat.models.Room.nameChanged",_c);
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_ADD_USER",function(_f){
if(_f.room.roomId!=id){
return;
}
if(x$.grep(_8,function(_10){
return _f.user.ningId==_10.getId();
}).length>0){
return;
}
_7=_f.room.groupCreator;
if(_8.length<_.SAMPLE_USER_COUNT){
_8.push(xg.components.chat.server.Formatter.toUser(_f.user,_b));
xg.shared.EventRegistry.fire("xg.components.chat.models.Room.sampleUsersChanged",_c);
if(!_3&&_1=="PRIVATE"){
xg.shared.EventRegistry.fire("xg.components.chat.models.Room.nameChanged",_c);
}
}
if(_f.user.ningId==_b.user.getId()){
_5=true;
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_JOIN",function(_11){
if(_11.room.roomId==id&&_8.length<_.SAMPLE_USER_COUNT){
_8.push(xg.components.chat.server.Formatter.toUser(_11.user,_b));
xg.shared.EventRegistry.fire("xg.components.chat.models.Room.sampleUsersChanged",_c);
if(!_3&&_1=="PRIVATE"){
xg.shared.EventRegistry.fire("xg.components.chat.models.Room.nameChanged",_c);
}
}
if(_11.room.roomId==id&&_11.user.ningId==_b.user.getId()){
_5=true;
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_LEAVE",function(_12){
if(_12.room.roomId==id&&_12.userId==_b.user.getId()){
_5=false;
_c.clearUnreadCount();
}
if(_12.room.roomId==id&&_.hasSampleUser(_12.userId)){
_8=x$.map(_12.room.users,function(_13){
return xg.components.chat.server.Formatter.toUser(_13,_b);
});
xg.shared.EventRegistry.fire("xg.components.chat.models.Room.sampleUsersChanged",_c);
if(!_3&&_1=="PRIVATE"){
xg.shared.EventRegistry.fire("xg.components.chat.models.Room.nameChanged",_c);
}
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_BAN_USER",function(_14){
if(_14.room.roomId==id&&_14.userId==_b.user.getId()){
_5=false;
_c.clearUnreadCount();
}
if(_14.room.roomId==id&&_.hasSampleUser(_14.userId)){
_8=x$.map(_14.room.users,function(_15){
return xg.components.chat.server.Formatter.toUser(_15,_b);
});
xg.shared.EventRegistry.fire("xg.components.chat.models.Room.sampleUsersChanged",_c);
if(!_3&&_1=="PRIVATE"){
xg.shared.EventRegistry.fire("xg.components.chat.models.Room.nameChanged",_c);
}
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_CHANGE",function(_16){
if(_16.roomId==id){
if(_3!=_16.name){
_3=_16.name;
xg.shared.EventRegistry.fire("xg.components.chat.models.Room.nameChanged",_c);
}
if(_4!=_16.iconUrl){
_4=_16.iconUrl;
xg.shared.EventRegistry.fire("xg.components.chat.models.Room.iconUrlChanged",_c);
}
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_HIDE",function(_17){
if(!_6&&_17.roomId==id){
_6=true;
xg.shared.EventRegistry.fire("xg.components.chat.models.Model.roomRemoved",_c);
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_UNHIDE",function(_18){
if(_6&&_18.roomId==id){
_6=false;
xg.shared.EventRegistry.fire("xg.components.chat.models.Model.roomAdded",_c);
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.MESSAGE_ADD",function(_19){
if(_6&&_19.roomId==id){
_b.server.unhideRoom(_c);
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_ADD_USER",function(_1a){
if(_6&&_1a.room.roomId==id&&_1a.user.ningId==_b.user.getId()){
_b.server.unhideRoom(_c);
}
});
};
_c.getId=function(){
return id;
};
_c.getInternalId=function(){
return _.internalId;
};
_c.getType=function(){
return _1;
};
_c.getName=function(){
return _3||_c.generateName();
};
_c.generateName=function(){
if(_1=="MAIN"){
return xg.shared.nls.text("MAIN_ROOM");
}
if(_1=="PRIVATE"){
var _1b=[];
x$.each(_8,function(i,_1d){
if(_1d.getId()!=_9.getId()){
_1b.push(_1d.getName());
}
});
if(_1b.length>3){
return _1b.join(", ")+"\u2026";
}else{
if(_1b.length>0){
return _1b.join(", ");
}
}
}
return xg.shared.nls.text("UNTITLED");
};
_c.getNameProper=function(){
return _3;
};
_c.isDirectMessage=function(){
return _3==null&&_1=="PRIVATE"&&_c.getSampleUsers().length===2&&_c.getOtherSampleUsers().length===1;
};
_c.getOtherUser=function(){
return _c.getOtherSampleUsers()[0];
};
_c.getIconUrl=function(){
return _4;
};
_c.getSampleUsers=function(){
return _8;
};
_.hasSampleUser=function(_1e){
for(var i=0;i<_8.length;i++){
if(_8[i].getId()==_1e){
return true;
}
}
return false;
};
_c.getOtherSampleUsers=function(){
return x$.grep(_8,function(_20){
return _20.getId()!=_9.getId();
});
};
_c.incrementUnreadCount=function(){
_a+=1;
xg.shared.EventRegistry.fire("xg.components.chat.models.Room.unreadCountChanged",_c);
};
_c.getUnreadCount=function(){
return _a;
};
_c.clearUnreadCount=function(){
_a=0;
xg.shared.EventRegistry.fire("xg.components.chat.models.Room.unreadCountChanged",_c);
};
_c.isRemovableFromModel=function(){
return _1=="PRIVATE"&&!_c.isDirectMessage();
};
_c.isLeavable=function(){
return !_c.isDirectMessage();
};
_c.isCurrentUserInRoom=function(){
return _5;
};
_c.isHiddenFromCurrentUser=function(){
return _6;
};
_c.getGroupCreator=function(){
return _7;
};
_.initialize();
return _c;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.Flasher",false)){
dojo.provide("xg.components.chat.Flasher");
xg.components.chat.Flasher=function(){
var _1={};
var _={};
var _3=2000;
var _4=null;
var _5=false;
var _6=true;
var _7="";
var _8=window.document.title;
var _9=null;
_.initialize=function(){
x$(window).on("blur",_1.windowBlurred);
x$(window).on("focus",_1.windowFocused);
};
_.flashTitlebar=function(){
if(_6){
window.document.title=_7;
}else{
window.document.title=_8;
}
_6=!_6;
};
_1.startFlashing=function(_a){
if(_5){
return;
}
_7=_a;
if(_4||_9){
return;
}
_9=window.setTimeout(function(){
_9=null;
_4=window.setInterval(_.flashTitlebar,_3);
},_1.getMillisecondsUntilNextStartSecond(new Date().getTime()));
};
_1.getMillisecondsUntilNextStartSecond=function(_b){
var _c=_3*2;
return (_c-(_b%_c))%_c;
};
_1.stopFlashing=function(){
window.document.title=_8;
_6=true;
window.clearTimeout(_9);
_9=null;
window.clearInterval(_4);
_4=null;
};
_1.windowBlurred=function(){
_5=false;
};
_1.windowFocused=function(){
_5=true;
_1.stopFlashing();
};
_.initialize();
return _1;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.SoundLock",false)){
dojo.provide("xg.components.chat.SoundLock");
xg.components.chat.SoundLock=function(){
var _1={};
var _={};
_.CHECK_INTERVAL=2000;
_.COOKIE_NAME="soundLockTimestamp";
_.myTimestamp=null;
_.soundEnabled=false;
_.initialize=function(){
_.check();
setInterval(_.check,_.CHECK_INTERVAL);
};
_.check=function(){
var _3=xg.shared.util.getCookie(_.COOKIE_NAME);
if(_3&&x$.now()-_3<(_.CHECK_INTERVAL*2)&&_.myTimestamp!=_3){
_.soundEnabled=false;
return;
}
_.myTimestamp=x$.now();
xg.shared.util.setCookie(_.COOKIE_NAME,_.myTimestamp);
_.soundEnabled=true;
};
_1.isSoundEnabled=function(){
return _.soundEnabled;
};
_.initialize();
return _1;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.LocalStorageUpdater",false)){
dojo.provide("xg.components.chat.LocalStorageUpdater");
xg.components.chat.LocalStorageUpdater=function(_1){
var _2={};
var _={};
_.COOKIE_NAME="chatWriteTimestamp";
_.lastWriteTimestamp=0;
_2.shouldUpdateFromLocalStorage=function(){
var _4=xg.shared.util.getCookie(_.COOKIE_NAME);
return _4&&_4>_.lastWriteTimestamp;
};
_2.setClientIsUpdated=function(){
_.lastWriteTimestamp=x$.now();
};
_2.propagateChangesToOtherClients=function(){
_1.save();
_2.setClientIsUpdated();
xg.shared.util.setCookie(_.COOKIE_NAME,_.lastWriteTimestamp);
};
return _2;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.LocalStorage",false)){
dojo.provide("xg.components.chat.LocalStorage");
xg.components.chat.LocalStorage=function(_1){
var _2={};
var _={};
_.VERSION=4;
_.data;
_.savePending=false;
_.HEARTBEAT_INTERVAL=2000;
_.updater=xg.components.chat.LocalStorageUpdater(_2);
_.initialize=function(){
_.load();
if(!_.data||_.data.version!==_.VERSION){
x$.jStorage.flush();
_.data={version:_.VERSION,users:{}};
_.savePending=true;
}
if(!_.data.users[_1]){
_.data.users[_1]={values:{},lastActivityTime:x$.now()};
}
setInterval(function(){
_.checkForUpdatesFromLocalStorage();
_2.save();
},_.HEARTBEAT_INTERVAL);
x$(window).unload(_2.save);
};
_2.set=function(_4,_5,_6,_7){
if(typeof _6==="undefined"){
throw "propagateChangeToOtherClients must be specified";
}
_.checkForUpdatesFromLocalStorage();
if(!_7){
var _8=_2.get(_4);
if(typeof _5!=="object"&&_5===_8){
return;
}
if(typeof _5==="object"&&_5!==_8&&x$.toJSON(_5)===x$.toJSON(_8)){
return;
}
}
var _9={value:_5};
var _a=_7?new Date().getTime()+_7*1000:null;
if(_a){
_9.expiry=_a;
}
_.data.users[_1].values[_4]=_9;
_.data.users[_1].lastActivityTime=x$.now();
_.savePending=true;
if(_6){
_2.save();
_2.getUpdater().propagateChangesToOtherClients();
}
};
_2.get=function(_b,_c){
_.checkForUpdatesFromLocalStorage();
var _d=_.data.users[_1].values[_b];
if(!_d){
return null;
}
if(_d.expiry&&new Date().getTime()>parseInt(_d.expiry)){
return null;
}
if(_c&&typeof _d.value==="object"){
return x$.parseJSON(x$.toJSON(_d.value));
}
return _d.value;
};
_.checkForUpdatesFromLocalStorage=function(){
if(_2.getUpdater().shouldUpdateFromLocalStorage()){
_.load();
}
};
_.load=function(){
var _e=false;
if(_.data){
x$.jStorage.reInit();
_e=true;
}
_.data=x$.jStorage.get("xg.components.chat.LocalStorage.data");
_2.getUpdater().setClientIsUpdated();
if(_e){
xg.shared.EventRegistry.fire("xg.components.chat.LocalStorage.updated");
}
};
_2.save=function(){
if(!_.savePending){
return;
}
x$.jStorage.set("xg.components.chat.LocalStorage.data",_.data);
_.savePending=false;
};
_2.getUpdater=function(){
return _.updater;
};
_.initialize();
return _2;
};
}
if(!dojo.hostenv.findModule("xg.shared.LanguageFilter",false)){
dojo.provide("xg.shared.LanguageFilter");
xg.shared.LanguageFilter=function(_1){
var _2="done";
var _3={};
var _={};
_3._=_;
var _5=[];
_3.addWord=function(_6){
_.addSequenceToNode(_5,_6.toLowerCase().split(""));
};
_.addSequenceToNode=function(_7,_8){
var _9=_8.shift();
_7[_9]=_7[_9]||[];
if(_8.length==0){
_7[_9][_2]=true;
return;
}
_.addSequenceToNode(_7[_9],_8);
};
_3.filter=function(_a){
var i=0;
while(i<_a.length){
var _c=_.findLongestMatchLength(_a,i);
if(_c>0){
var _d=Array(_c).join("*");
_a=_a.substring(0,i+1)+_d+_a.substring(i+_c,_a.length);
i=i+_c-1;
}
if(_1==true){
i=_.findBoundary(_a,i+1);
}else{
i++;
}
}
return _a;
};
_.findLongestMatchLength=function(_e,_f){
_e=_e.toLowerCase();
var _10=0;
var _11=_5;
var _12=0;
while(_f<_e.length){
_11=_11[_e.charAt(_f)];
_12++;
_f++;
if(_11==null){
break;
}
if(_11[_2]!=true){
continue;
}
if(_1==true&&_.findBoundary(_e,_f)!=_f){
continue;
}
_10=_12;
}
return _10;
};
_.findBoundary=function(_13,_14){
if(_14==0){
return 0;
}
if(_14==_13.length){
return _13.length;
}
var _15=_13.substring(_14-1,_13.length).search(/[\s\S]\b/);
if(_15==-1){
return _13.length;
}
return _14+_15;
};
return _3;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.models.Model",false)){
dojo.provide("xg.components.chat.models.Model");
xg.components.chat.models.Model=function(_1,_2,_3){
var _4={};
var _={};
_4.MAX_HEIGHT=300;
_4.PADDING=20;
_4.LOCAL_STORAGE_NAME_FOR_ROOM_WINDOW_STATES_FOR_MOBILE_CHAT="mobileChatRoomStates_v1";
_4.LOCAL_STORAGE_NAME_FOR_ROOM_WINDOW_STATES_FOR_FOOTER_AND_MODULE_CHAT="chatRoomStates_v1";
_4.appId="";
_4.appName="";
_4.user;
_4.defaultAvatarUrl="";
_4.userIsAdmin=false;
_4.countUrl="";
_4.languageFilter=null;
_4.isMobileChat=false;
_.state=null;
_4.layout=null;
_4.server=null;
_.rooms=[];
_.roomsKeyedById={};
_.connected=_2;
_.conversationViewExpanded=_3;
_.users={};
_.initialize=function(){
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.MESSAGE_ADD",function(_6){
for(var i=0;i<_.rooms.length;i++){
if(_.rooms[i].getId()===_6.roomId){
if(i===0){
return;
}
var _8=_.rooms.splice(i,1)[0];
_.rooms.unshift(_8);
xg.shared.EventRegistry.fire("xg.components.chat.models.Model.roomMovedToTop",_8);
break;
}
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_ADD",function(_9){
var _a=_9;
_4.addRoom(xg.components.chat.server.Formatter.toRoom(_a,_4));
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_ADD_USER",function(_b){
var _c=_b.room;
if(!_4.getRoom(_c.roomId)){
_4.addRoom(xg.components.chat.server.Formatter.toRoom(_c,_4));
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_JOIN",function(_d){
var _e=_d.room;
if(!_4.getRoom(_e.roomId)){
_4.addRoom(xg.components.chat.server.Formatter.toRoom(_e,_4));
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_LEAVE",function(_f){
if(_4.user.getId()==_f.userId){
var _10=_4.getRoom(_f.room.roomId);
if(_10.isRemovableFromModel()){
delete _.roomsKeyedById[_f.room.roomId];
_.rooms=x$.grep(_.rooms,function(_11){
return _11.getId()!=_f.room.roomId;
});
xg.shared.EventRegistry.fire("xg.components.chat.models.Model.roomRemoved",_10);
}
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_BAN_USER",function(_12){
if(_4.user.getId()==_12.userId){
var _13=_4.getRoom(_12.room.roomId);
delete _.roomsKeyedById[_12.room.roomId];
_.rooms=x$.grep(_.rooms,function(_14){
return _14.getId()!=_12.room.roomId;
});
xg.shared.EventRegistry.fire("xg.components.chat.models.Model.roomRemoved",_13);
}
});
};
_4.setState=function(_15){
if(_.state==_15){
return;
}
_.state=_15;
xg.shared.EventRegistry.fire("xg.components.chat.models.Model.stateChanged",_15);
};
_4.initializeRooms=function(_16){
_.rooms=_16;
x$.each(_16,function(i,_18){
_.roomsKeyedById[_18.getId()]=_18;
});
};
_4.getRooms=function(){
return x$.grep(_.rooms,function(_19){
return !_19.isHiddenFromCurrentUser();
});
};
_4.addRoom=function(_1a){
_.rooms.unshift(_1a);
_.roomsKeyedById[_1a.getId()]=_1a;
xg.shared.EventRegistry.fire("xg.components.chat.models.Model.roomAdded",_1a);
};
_4.getDirectMessageRooms=function(_1b){
return x$.grep(_.rooms,function(_1c){
return _1c.isDirectMessage()&&(_1b||!_1c.isHiddenFromCurrentUser());
});
};
_4.getGroupChatRooms=function(){
return x$.grep(_.rooms,function(_1d){
return !_1d.isDirectMessage()&&!_1d.isHiddenFromCurrentUser();
});
};
_4.getRoom=function(id){
return _.roomsKeyedById[id];
};
_4.getState=function(){
return _.state;
};
_4.createLanguageFilter=function(_1f,_20){
_4.languageFilter=xg.shared.LanguageFilter(_20);
for(var i=0;i<_1f.length;i++){
_4.languageFilter.addWord(_1f[i]);
}
};
_4.getCachedOnlineStatus=function(){
return _.connected;
};
_4.setCachedOnlineStatus=function(_22){
if(_.connected==_22){
return;
}
_.connected=_22;
_.updateUserPreferences();
_1.set("chatConnected",_22,true);
};
_4.readOnlineStatusFromLocalStorage=function(){
var _23=_1.get("chatConnected");
if(_23!==null){
_.connected=_23;
}
return _.connected;
};
_4.isConversationViewExpanded=function(){
return _.conversationViewExpanded;
};
_4.setConversationViewExpanded=function(_24){
if(_.conversationViewExpanded==_24){
return;
}
_.conversationViewExpanded=_24;
_.updateUserPreferences();
};
_.updateUserPreferences=function(){
_4.layout.updateUserPreferences({connected:_.connected?"1":"0",conversationViewExpanded:_.conversationViewExpanded?"1":"0"});
};
_4.getRoomWindowStates=function(){
return _1.get(_4.layout.getLocalStorageNameForRoomWindowStates())||[];
};
_4.setRoomWindowStates=function(_25){
_1.set(_4.layout.getLocalStorageNameForRoomWindowStates(),_25,true);
};
_4.setConversationViewHeight=function(_26){
_1.set("conversationViewHeight",_26,false);
};
_4.getConversationViewHeight=function(){
return _1.get("conversationViewHeight",false);
};
_4.getOrCreateUser=function(id,_28,_29,_2a,_2b){
if(!_.users[id]){
_.users[id]=xg.components.chat.models.User(id,_28,_29,_2a,_2b);
}
return _.users[id];
};
_4.getUser=function(id){
return _.users[id];
};
_.initialize();
return _4;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.LazyImageLoader",false)){
dojo.provide("xg.components.chat.LazyImageLoader");
xg.components.chat.LazyImageLoader=function(_1,_2){
var _3={};
var _={};
var _5=50;
var _6;
_.initialize=function(){
_6=xg.shared.util.createQuiescenceTimer(_5,_3.loadImagesInViewport);
};
_3.monitorScrolling=function(){
_1.scroll(function(){
_6.trigger();
});
};
_3.loadImagesInViewport=function(){
if(!_1[0]){
return;
}
var _7=_1.find(_2);
var _8=Math.floor((_1.scrollTop()/_1[0].scrollHeight)*_7.length);
var _9=Math.ceil(((_1.scrollTop()+_1.outerHeight())/_1[0].scrollHeight)*_7.length);
for(var i=_8;i<=_9;i++){
if(_7[i]){
x$(_7[i]).find(".lazy-load").each(function(){
var _b=x$(this);
_b.replaceWith(_b.html().replace(/<!--(.*)-->/g,"$1"));
});
}
}
};
_.initialize();
return _3;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.models.User",false)){
dojo.provide("xg.components.chat.models.User");
xg.components.chat.models.User=function(id,_2,_3,_4,_5){
var _6={};
var _={};
_.id;
_.name;
_.avatarUrl;
_.online;
_.blockedByCurrentUser;
_.initialize=function(){
_.id=id;
_.name=_2;
_.avatarUrl=_3;
_.online=_4;
_.blockedByCurrentUser=_5;
};
_6.getId=function(){
return _.id;
};
_6.getName=function(){
return _.name;
};
_6.isOnline=function(){
return _.online;
};
_6.getAvatarUrl=function(){
return _.avatarUrl;
};
_6.setName=function(_8){
if(_.name!=_8){
_.name=_8;
xg.shared.EventRegistry.fire("xg.components.chat.models.User.nameChanged",_6);
}
};
_6.setAvatarUrl=function(_9){
if(_.avatarUrl!=_9){
_.avatarUrl=_9;
xg.shared.EventRegistry.fire("xg.components.chat.models.User.avatarUrlChanged",_6);
}
};
_6.setOnline=function(_a){
if(_.online!=_a){
_.online=_a;
xg.shared.EventRegistry.fire("xg.components.chat.models.User.onlineChanged",_6);
}
};
_6.isBlockedByCurrentUser=function(){
return _.blockedByCurrentUser;
};
_6.setBlockedByCurrentUser=function(_b){
if(_.blockedByCurrentUser!=_b){
_.blockedByCurrentUser=_b;
xg.shared.EventRegistry.fire("xg.components.chat.models.User.blockedByCurrentUserChanged",_6);
}
};
_.initialize();
return _6;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.ChatPaneResizer",false)){
dojo.provide("xg.components.chat.ChatPaneResizer");
xg.components.chat.ChatPaneResizer=function(_1,_2,_3){
var _4={};
var _={};
_.selectedHeight=null;
_4.initialize=function(_6){
_.selectedHeight=_6;
_1.click(function(_7){
_7.preventDefault();
_7.stopPropagation();
xg.shared.EventRegistry.fire("xg.components.chat.stopPropagation");
});
_1.mousedown(_.startDragAndResize);
return _4;
};
_.startDragAndResize=function(_8){
_8.preventDefault();
x$("body").append(x$("<div class=\"dragCover\"></div>"));
x$(document).bind("mousemove",_.dragAndResize);
x$(document).mouseup(function(_9){
x$(document).unbind("mousemove",_.dragAndResize);
x$(".dragCover").remove();
_3();
});
};
_.dragAndResize=function(_a){
_.selectedHeight=x$(window).height()-(_a.pageY-x$(document).scrollTop());
_2();
};
_4.getSelectedHeight=function(){
return _.selectedHeight;
};
return _4;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.HTMLBuilder",false)){
dojo.provide("xg.components.chat.HTMLBuilder");
xg.components.chat.HTMLBuilder=function(){
var _1={};
var _={};
_.deferredImageStartMarker="<span class=\"lazy-load\"><!--";
_.deferredImageEndMarker="--></span>";
_.imageTemplate="<img class=\"_avatar {extraClass}\" src=\"{image}\" onerror=\"{onerror}\">";
_.lazyImageTemplate=_.deferredImageStartMarker+_.imageTemplate+_.deferredImageEndMarker;
_.directMessageEntryTemplate="<li class=\"cht-room-{roomInternalId}\"><a href=\"#\" class=\"userEntry\">{roomAvatarHtml}<span class=\"_username cht-roomName-{roomInternalId}\">{name}</span><span class=\"cht-count\"></span></a></li>";
_.groupEntryTemplate="<li class=\"cht-room-{roomInternalId}\"><a href=\"#\" class=\"userEntry\">{roomAvatarHtml}<span class=\"_groupname cht-roomName-{roomInternalId}\">{name}</span><span class=\"cht-count\"></span></a></li>";
_.messageTemplate="<li class=\"message {liClass} cht-message-{messageId}\" data-sender-id=\"{screenName}\">"+"{avatarHtml}"+"<span class=\"_sender {userNameClass}\">{name}</span>"+"<div>"+"<p class=\"_message\">"+"{messageHtml}</p>"+"<span class=\"cht-timestamp\">{timestamp}</span>"+"{stateHtml}"+"</div>"+"{deleteHtml}"+"</li>";
_.messageDeletedTemplate="<i class=\"cht-icon cht-trashIcon\"></i>"+xg.shared.nls.html("MESSAGE_DELETED");
_.typingIndicatorTemplate="<li class=\"message cht-typing cht-typing-{screenName}\">"+"{avatarHtml}"+"<span class=\"_sender cht-userName-{screenName}\">{name}</span>"+"<div>"+"<p class=\"_message\">. . .</p>"+"</div>"+"</li>";
_.stateTemplate="<span class=\"cht-state\" {stateStyle} data-state=\"{state}\">{stateLabel}</span>";
_.deleteMessageTemplate="<a href=\"#\" class=\"cht-deleteMessage\" data-message-id=\"{messageId}\"><span class=\"icon icon-closeChat\"></span><span class=\"cht-confirmDeleteMessage\">"+xg.shared.nls.html("CHAT_DELETE")+"</span></a>";
_.searchResultTemplate="<li><a href=\"#\" data-screen-name=\"{screenName}\"\">{userAvatarHtml}<span class=\"cht-userName-{screenName}\">{name}</span></a></li>";
_.roomUserListItemTemplate="<li data-screen-name=\"{screenName}\">{userAvatarHtml}<span class=\"cht-userName cht-userName-{screenName} {userNameClass}\">{name}</span>{banButtonHtml}</li>";
_.banButtonTemplate="<a class=\"cht-ban\" href=\"#\" title=\""+xg.shared.nls.html("BAN_USER_FROM_GROUP")+"\"><span class=\"icon icon-closeChat\"></span></a>";
_.loadingMoreMessagesTemplate="<li class=\"cht-loadingMoreMessages\">"+xg.shared.nls.html("LOADING_MORE_MESSAGES")+"</li>";
_.findingMorePeopleTemplate="<li class=\"cht-findingMorePeople\">"+xg.shared.nls.html("FINDING_MORE_PEOPLE")+"</li>";
_.userBlockedWarningTemplate="<li class=\"warning\">"+xg.shared.nls.html("YOU_HAVE_BLOCKED","href=\"#\"")+"</li>";
_.messageNotSentWarningTemplate="<li class=\"warning\">"+xg.shared.nls.html("PROBLEM_SENDING_MESSAGE","href=\"#\"")+"</li>";
_.userLeftTemplate="<li class=\"cht-userLeft\">{note}</li>";
_1.roomAvatar=function(_3,_4){
if(_3.isDirectMessage()){
return _1.avatar(_3.getOtherUser().getAvatarUrl(),_3.getOtherUser(),null,_4);
}
if(_3.getIconUrl()){
return _1.avatar(_3.getIconUrl(),null,null,_4);
}
if(_3.getType()=="MAIN"){
return _1.avatar(x$(".xg_chat").data("appIconUrl"),null,null,_4);
}
var _5=_3.getOtherSampleUsers();
if(_5.length===0){
return _1.avatar(x$(".xg_chat").data("defaultAvatarUrl"),null,null,_4);
}
if(_5.length===1){
return _1.avatar(_5[0].getAvatarUrl(),_5[0],null,_4);
}
var _6=_3.getSampleUsers().slice(0,3);
var _7="<span class=\"_avatarGroup\"><span class=\"avatarGroup_inner\">";
x$.each(_6,function(i,_9){
_7+="<span>";
_7+=_1.avatar(_9.getAvatarUrl(),_9,null,_4);
_7+="</span>";
});
_7+="</span></span>";
return _7;
};
_1.avatar=function(_a,_b,_c,_d){
var _e=_d?_.lazyImageTemplate:_.imageTemplate;
_c=_c||"";
var _f="";
if(_b){
_c+=" "+(_b.isOnline()?"cht-online ":"cht-offline ")+" cht-userAvatar-"+_b.getId();
_f="<i></i>";
}
return xg.renderHtml(_e,{extraClass:_c,image:xg.qh(_a),onerror:xg.qh("this.onerror=null;this.src='"+x$(".xg_chat").data("defaultAvatarUrl")+"';")})+_f;
};
_1.roomUserListItem=function(_10,_11,_12,_13){
var _14;
if(_10.getId()==_12.getId()){
_14="";
}else{
if(_11.getType()==="PRIVATE"&&_12.getId()===_11.getGroupCreator()){
_14=xg.renderHtml(_.banButtonTemplate);
}else{
if(_11.getType()!=="PRIVATE"&&_13){
_14=xg.renderHtml(_.banButtonTemplate);
}else{
_14="";
}
}
}
var _15=_10.getId()===_12.getId();
return xg.renderHtml(_.roomUserListItemTemplate,{screenName:_10.getId(),name:xg.qh(_10.getName()),userAvatarHtml:_1.avatar(_10.getAvatarUrl(),_10,_15?"cht-me":null,false),userNameClass:_15?"cht-me":null,banButtonHtml:_14});
};
_1.searchResult=function(_16){
return xg.renderHtml(_.searchResultTemplate,{screenName:_16.getId(),name:xg.qh(_16.getName()),userAvatarHtml:_1.avatar(_16.getAvatarUrl(),_16,null,false)});
};
_1.directMessageEntry=function(_17){
return xg.renderHtml(_.directMessageEntryTemplate,{name:xg.qh(_17.getName()),roomAvatarHtml:_1.roomAvatar(_17,false),roomInternalId:_17.getInternalId()});
};
_1.groupEntry=function(_18){
return xg.renderHtml(_.groupEntryTemplate,{name:xg.qh(_18.getName()),roomAvatarHtml:_1.roomAvatar(_18,false),roomInternalId:_18.getInternalId()});
};
_1.message=function(_19,_1a,_1b,_1c){
var _1d="";
if(_1b){
_1d=xg.renderHtml(_.deleteMessageTemplate,{messageId:_19.id});
}
var _1e="";
if(_1b){
var _1f="",_20="",_21="style=\"display: none;\"";
if(_19.seen){
_1f="SEEN";
_20=xg.qh(xg.shared.nls.text("SEEN"));
_21="";
}else{
if(!_1c){
_1f="DELIVERED";
_20=xg.qh(xg.shared.nls.text("DELIVERED"));
_21="";
}
}
_1e=xg.renderHtml(_.stateTemplate,{state:_1f,stateLabel:_20,stateStyle:_21});
}
return xg.renderHtml(_.messageTemplate,{messageId:_19.id,screenName:_19.sender.getId(),avatarHtml:_1.avatar(_19.sender.getAvatarUrl(),_19.sender,_1b?"cht-me":null,false),liClass:_1b?"cht-meBlock":"",name:_1b?xg.shared.nls.html("ME"):xg.qh(_19.sender.getName()),userNameClass:_1b?"cht-me":("cht-userName-"+_19.sender.getId()),messageHtml:_1a,deleteHtml:_1d,stateHtml:_1e,timestamp:_.formatTime(_19.timestamp)});
};
_1.typingIndicator=function(_22){
return xg.renderHtml(_.typingIndicatorTemplate,{screenName:_22.getId(),avatarHtml:_1.avatar(_22.getAvatarUrl(),_22,null,false),name:xg.qh(_22.getName())});
};
_1.loadingMoreMessages=function(){
return _.loadingMoreMessagesTemplate;
};
_1.messageDeleted=function(){
return _.messageDeletedTemplate;
};
_1.findingMorePeople=function(){
return _.findingMorePeopleTemplate;
};
_1.userBlockedWarning=function(){
return _.userBlockedWarningTemplate;
};
_1.messageNotSentWarning=function(){
return _.messageNotSentWarningTemplate;
};
_1.userLeft=function(_23){
return xg.renderHtml(_.userLeftTemplate,{note:xg.shared.nls.html("USER_LEFT_GROUP",xg.qh(_23.getName()))});
};
_.formatTime=function(_24){
var _25=new Date();
_25.setHours(0);
_25.setMinutes(0);
_25.setSeconds(0);
var _26=new Date(_24);
if(isNaN(_26.getTime())){
return "";
}
if(_25-(24*60*60*1000)>_26){
switch(_26.getMonth()){
case 0:
return xg.shared.nls.text("JAN_DAY",_26.getDate());
case 1:
return xg.shared.nls.text("FEB_DAY",_26.getDate());
case 2:
return xg.shared.nls.text("MAR_DAY",_26.getDate());
case 3:
return xg.shared.nls.text("APR_DAY",_26.getDate());
case 4:
return xg.shared.nls.text("MAY_DAY",_26.getDate());
case 5:
return xg.shared.nls.text("JUN_DAY",_26.getDate());
case 6:
return xg.shared.nls.text("JUL_DAY",_26.getDate());
case 7:
return xg.shared.nls.text("AUG_DAY",_26.getDate());
case 8:
return xg.shared.nls.text("SEP_DAY",_26.getDate());
case 9:
return xg.shared.nls.text("OCT_DAY",_26.getDate());
case 10:
return xg.shared.nls.text("NOV_DAY",_26.getDate());
case 11:
return xg.shared.nls.text("DEC_DAY",_26.getDate());
}
}
if(_25>_26){
return xg.shared.nls.text("YESTERDAY_CAPITALIZED");
}
var _27=_26.getHours();
var _28=_27<10?"0"+_27:_27;
var _29=_27>12?_27-12:_27;
var _2a=_29<10?"0"+_29:_29;
var _2b=_26.getMinutes()<10?"0"+_26.getMinutes():_26.getMinutes();
return _29+":"+_2b+" "+(_27<12?"AM":"PM");
};
return _1;
};
xg.components.chat.HTMLBuilder.get=function(){
if(!xg.components.chat.HTMLBuilder.instance){
xg.components.chat.HTMLBuilder.instance=xg.components.chat.HTMLBuilder();
}
return xg.components.chat.HTMLBuilder.instance;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.SearchField",false)){
dojo.provide("xg.components.chat.SearchField");
xg.components.chat.SearchField=function(_1,_2,_3,_4,_5){
var _6={};
var _={};
_.DELAY_AFTER_TYPING=1000;
_.currentRequestId=0;
_.initialize=function(){
var _8=xg.shared.util.createQuiescenceTimer(_.DELAY_AFTER_TYPING,_.searchTermChanged);
_5=_5||function(){
};
_1.bind("keyup keypress cut paste input",function(_9){
if(_9.which==13){
if(_9.type=="keyup"){
_.searchTermChanged();
_8.cancel();
}
return;
}
if(_9.which==27){
if(_9.type=="keyup"){
_6.hideDropdown();
_8.cancel();
_5();
}
return;
}
_8.trigger();
});
x$(document).click(function(){
_6.hideDropdown();
});
xg.shared.EventRegistry.listen("xg.components.chat.stopPropagation",_6.hideDropdown);
_2.on("click","a",function(_a){
_a.preventDefault();
_4(_3.getUser(x$(this).data("screenName")));
_6.hideDropdown();
});
xg.shared.EventRegistry.listen("xg.components.chat.models.Model.stateChanged",_.stateChanged);
_.stateChanged();
};
_.stateChanged=function(){
_1.prop("disabled",!_3.getState()||_3.getState().getName()!="Online");
};
_6.hideDropdown=function(){
_1.val("");
_.invalidateInFlightRequests();
_.showResults([]);
};
_.invalidateInFlightRequests=function(){
_.currentRequestId+=1;
};
_.searchTermChanged=function(){
_.invalidateInFlightRequests();
var _b=_1.val().trim();
if(!_b){
_6.hideDropdown();
return;
}
var _c=_.currentRequestId;
x$.get("/main/chat/findMembers",{term:_b},function(_d){
if(_.currentRequestId!==_c){
return;
}
if(!_d.success){
_6.hideDropdown();
}
_.showResults(_d.users);
});
};
_.showResults=function(_e){
_2.empty();
if(_e.length===0){
_2.hide();
}
x$.each(_e,function(i,_10){
var _11=xg.components.chat.server.Formatter.toUser(_10,_3);
var _12=xg.components.chat.HTMLBuilder.get().searchResult(_11);
_2.append(_12);
});
_2.show();
};
_.initialize();
return _6;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.ConversationView",false)){
dojo.provide("xg.components.chat.ConversationView");
xg.components.chat.ConversationView=function(_1,_2,_3,_4,_5){
var _6={};
var _={};
var _8;
var _9;
var _a;
var _b;
var _c=_1.find(".cht-viewAll");
var _d;
var _e;
var _f;
var _10=false;
var _11;
var _12=0;
var _13=4;
_6.initialize=function(_14){
_11=xg.components.chat.ChatPaneResizer(x$(".resizeHandle",_1),_.onResize,_.saveSize).initialize(_14);
if(_1.hasClass("xg_chatWindow")){
_8=_1;
}else{
_8=x$(".xg_chatWindow",_1);
}
_9=x$(".xg_status",_1);
_a=x$(".cht-chatGroups",_1);
_b=x$(".cht-chatUsers",_1);
_e=xg.components.chat.LazyImageLoader(_b,"li");
_e.monitorScrolling();
_f=xg.components.chat.LazyImageLoader(_a,"li");
_f.monitorScrolling();
_4.layout.initializeConversationView(_1);
x$(".cht-minimize, .xg_expand",_1).click(function(_15){
_15.preventDefault();
_15.stopPropagation();
xg.shared.EventRegistry.fire("xg.components.chat.stopPropagation");
_6.toggleExpanded();
});
x$(".xg_chatWindow .chatTitle",_1).click(function(_16){
_16.preventDefault();
_16.stopPropagation();
xg.shared.EventRegistry.fire("xg.components.chat.stopPropagation");
if(_1.find(".cht-back").is(":visible")){
_.backToSmallGroupsView();
return;
}
_6.toggleExpanded();
});
x$(".xg_bottomBar .xg_info",_1).click(function(_17){
_17.preventDefault();
_17.stopPropagation();
xg.shared.EventRegistry.fire("xg.components.chat.stopPropagation");
_4.getState().onClickConversationViewBar(_6);
});
x$(document).click(function(_18){
_.hideChatOptionBox();
});
_1.click(function(_19){
_19.stopPropagation();
xg.shared.EventRegistry.fire("xg.components.chat.stopPropagation");
_.hideChatOptionBox();
});
_9.click(function(_1a){
_1a.preventDefault();
_1a.stopPropagation();
xg.shared.EventRegistry.fire("xg.components.chat.stopPropagation");
_6.toggleChatOptionBox();
});
_d={};
xg.shared.EventRegistry.listen("xg.components.chat.models.Model.stateChanged",_.stateChanged);
_.handleEvents();
_.setUpSeeAllLink();
xg.shared.EventRegistry.listen("xg.components.chat.models.Room.unreadCountChanged",function(_1b){
_.updateUnreadCount(_8.find(".cht-room-"+_1b.getInternalId()),_1b);
});
xg.components.chat.SearchField(_8.find(".xg_inputSearch"),_8.find(".cht-searchResults"),_4,_.onClickSearchResult);
return _6;
};
_.onClickSearchResult=function(_1c){
var _1d=false;
x$.each(_4.getDirectMessageRooms(true),function(i,_1f){
if(_1f.getOtherUser().getId()==_1c.getId()){
if(_1f.isHiddenFromCurrentUser()){
_4.server.unhideRoom(_1f);
}
_3.addRoomWindow(_1f,true,true);
_1d=true;
return false;
}
});
if(_1d){
return;
}
var _20=xg.shared.EventRegistry.listen("xg.components.chat.models.Model.roomAdded",function(_21){
if(_21.isDirectMessage()&&_21.getOtherUser().getId()==_1c.getId()){
_3.addRoomWindow(_21,true,true);
xg.shared.EventRegistry.unlisten("xg.components.chat.models.Model.roomAdded",_20);
}
});
_4.server.addDirectMessageRoom(_1c.getId());
};
_.updateUnreadCount=function(_22,_23){
if(_23.getUnreadCount()){
_22.find(".cht-count").show().text(_23.getUnreadCount());
}else{
_22.find(".cht-count").hide();
}
};
_.handleEvents=function(){
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_LIST",function(_24){
_.populateDirectMessageList();
if(_.isShowingAllGroups()){
_6.showAllGroups();
}else{
_.populateSmallGroupList();
}
_.updateSize();
_e.loadImagesInViewport();
_f.loadImagesInViewport();
});
xg.shared.EventRegistry.listen("xg.components.chat.models.Model.roomMovedToTop",function(_25){
var _26=_b.find(".cht-room-"+_25.getInternalId());
if(_26.length){
_b.prepend(_26);
}else{
var _27=_a.find(".cht-room-"+_25.getInternalId());
if(_27.length){
if(_.isShowingAllGroups()){
_a.prepend(_27);
}else{
_.populateSmallGroupList();
}
}
}
});
xg.shared.EventRegistry.listen("xg.components.chat.models.Model.roomAdded",function(_28){
if(_28.isDirectMessage()){
_b.prepend(_.createDirectMessageListItem(_28));
}else{
if(_.isShowingAllGroups()){
_a.prepend(_.createGroupChatListItem(_28,false));
}else{
_.populateSmallGroupList();
}
}
});
xg.shared.EventRegistry.listen("xg.components.chat.models.Room.iconUrlChanged",function(_29){
if(_29.isDirectMessage()){
var _2a=_b.find(".cht-room-"+_29.getInternalId());
_2a.replaceWith(_.createDirectMessageListItem(_29));
}else{
if(_.isShowingAllGroups()){
var _2b=_a.find(".cht-room-"+_29.getInternalId());
_2b.replaceWith(_.createGroupChatListItem(_29,false));
}else{
_.populateSmallGroupList();
}
}
});
xg.shared.EventRegistry.listen("xg.components.chat.models.Room.sampleUsersChanged",function(_2c){
var _2d=_b.find(".cht-room-"+_2c.getInternalId());
var _2e=_2d.length>0;
var _2f=_2c.isDirectMessage();
if(_2e&&_2f){
_2d.replaceWith(_.createDirectMessageListItem(_2c));
}else{
if(!_2e&&!_2f){
if(_.isShowingAllGroups()){
var _30=_a.find(".cht-room-"+_2c.getInternalId());
_30.replaceWith(_.createGroupChatListItem(_2c,false));
}else{
_.populateSmallGroupList();
}
}else{
if(_2e&&!_2f){
_2d.remove();
if(_.isShowingAllGroups()){
_a.prepend(_.createGroupChatListItem(_2c,false));
}else{
_.populateSmallGroupList();
}
}else{
if(!_2e&&_2f){
if(_.isShowingAllGroups()){
var _30=_a.find(".cht-room-"+_2c.getInternalId());
_30.remove();
}else{
_.populateSmallGroupList();
}
_b.prepend(_.createDirectMessageListItem(_2c));
}
}
}
}
});
xg.shared.EventRegistry.listen("xg.components.chat.models.Model.roomRemoved",function(_31){
_b.find(".cht-room-"+_31.getInternalId()).remove();
_a.find(".cht-room-"+_31.getInternalId()).remove();
if(!_.isShowingAllGroups()){
_.populateSmallGroupList();
}
});
};
_.isShowingAllGroups=function(){
return _a.hasClass("cht-allChatGroups");
};
_.populateDirectMessageList=function(){
_b.empty();
x$.each(_4.getDirectMessageRooms(),function(i,_33){
_b.append(_.createDirectMessageListItem(_33));
});
};
_.populateSmallGroupList=function(){
_a.find("li:not(.cht-viewAll)").remove();
x$.each(_4.getGroupChatRooms().slice(0,_13),function(i,_35){
_a.append(_.createGroupChatListItem(_35,false));
});
_.updateSeeAllLink();
};
_.updateSeeAllLink=function(){
_c.toggle(_4.getGroupChatRooms().length>_13);
};
_.setUpSeeAllLink=function(){
_c.find("a").click(function(_36){
_36.preventDefault();
_6.showAllGroups();
});
};
_6.showAllGroups=function(){
_a.addClass("cht-allChatGroups");
_a.find("li:not(.cht-viewAll)").remove();
_1.find(".cht-back").show();
x$.each(_4.getGroupChatRooms(),function(i,_38){
_a.append(_.createGroupChatListItem(_38,true));
});
_f.loadImagesInViewport();
};
_.backToSmallGroupsView=function(){
_a.removeClass("cht-allChatGroups");
_a.find("li:not(.cht-viewAll)").slice(4).remove();
_1.find(".cht-back").hide();
};
_.onResize=function(){
_.updateSize();
_e.loadImagesInViewport();
_f.loadImagesInViewport();
};
_.saveSize=function(){
_4.setConversationViewHeight(_11.getSelectedHeight());
};
_.stateChanged=function(_39){
_9.toggleClass("xg_status-offline",!_39.isOnline());
_.updateConversationViewBarText();
_.hideChatOptionBox();
};
_.updateConversationViewBarText=function(){
x$(".cht-conversationViewBarText",_1).html(_4.getState().getConversationViewBarHtml());
};
_.updateSize=function(){
_4.layout.updateConversationViewSize(_b,_1,_8,_11.getSelectedHeight());
};
_6.toggleExpanded=function(){
if(_6.isExpanded()){
_6.contract(true);
}else{
_6.expand();
}
_.hideChatOptionBox();
};
_6.expand=function(){
_4.setConversationViewExpanded(true);
if(!_4.getState().isOnline()){
_3.toggleOnlineStatus();
return;
}
_8.show();
x$(".xg_bottomBar .xg_info.chatTitle").addClass("hidden");
_.updateSize();
_e.loadImagesInViewport();
_f.loadImagesInViewport();
};
_6.contract=function(_3a){
if(!_4.layout.canMinimizeConversationView()){
return;
}
if(_3a){
_4.setConversationViewExpanded(false);
}
_8.hide();
x$(".xg_bottomBar .xg_info.chatTitle").removeClass("hidden");
_.updateSize();
};
_6.isExpanded=function(){
return _8.filter(":visible").length>0;
};
_.createGroupChatListItem=function(_3b,_3c){
var _3d=x$(xg.components.chat.HTMLBuilder.get().groupEntry(_3b));
_3d.data("roomId",_3b.getId());
var _3e=function(_3f){
_3f.preventDefault();
_3f.stopPropagation();
xg.shared.EventRegistry.fire("xg.components.chat.stopPropagation");
_3.addRoomWindow(_3b,true,true);
};
x$(".userEntry",_3d).click(_3e);
_3d.click(_3e);
_.updateUnreadCount(_3d,_3b);
return _3d;
};
_.createDirectMessageListItem=function(_40){
var _41=x$(xg.components.chat.HTMLBuilder.get().directMessageEntry(_40));
_41.data("roomId",_40.getId());
var _42=function(_43){
_43.preventDefault();
_43.stopPropagation();
xg.shared.EventRegistry.fire("xg.components.chat.stopPropagation");
_3.addRoomWindow(_40,true,true);
};
x$(".userEntry",_41).click(_42);
_41.click(_42);
_.updateUnreadCount(_41,_40);
return _41;
};
_.showChatOptionBox=function(){
var div=_4.getState().getChatOptionBoxDiv(_.hideChatOptionBox);
if(!div){
return;
}
_2.children().hide();
x$(div).show();
_2.append(div);
_2.show();
_10=true;
};
_.hideChatOptionBox=function(){
_2.hide();
_10=false;
};
_6.toggleChatOptionBox=function(){
if(_10){
_.hideChatOptionBox();
}else{
_.showChatOptionBox();
}
};
return _6;
};
}
if(!dojo.hostenv.findModule("xg.components.shared.FileUploader",false)){
dojo.provide("xg.components.shared.FileUploader");
xg.components.shared.FileUploader=function(_1){
var _2={};
var _={};
_.initialize=function(){
var _4=[];
_1.$fileInput.fileupload({url:_1.url,forceIframeTransport:true,formData:_4,add:function(e,_6){
if(_1.maxFileCount&&_6.files.length>_1.maxFileCount){
_1.onExceedMaxFileCount();
return;
}
if(_1.validate&&!_1.validate(_6.files)){
return;
}
var _7=this;
_1.onStart(function(_8){
_4.push({"name":"xg_token","value":xg.token});
x$.each(_8||{},function(_9,_a){
_4.push({name:_9,value:_a});
});
_6.submit();
});
},done:function(e,_c){
var _d={};
try{
var _e="";
if(_c.result[0]&&_c.result[0].documentElement){
var _f=_c=_c.result[0]&&_c.result[0].documentElement;
if(_f.innerText){
_e=_f.innerText;
}else{
if(_f.textContent){
_e=_f.textContent;
}
}
}
_d=JSON.parse(_e);
}
catch(e){
_1.onError();
return;
}
_1.onEnd(_d);
},fail:function(e,_11){
_1.onError();
}});
};
_2.setUrl=function(_12){
_1.$fileInput.fileupload("option","url",_12);
};
_.initialize();
return _2;
};
}
if(!dojo.hostenv.findModule("xg.components.shared.dialogAdapter",false)){
dojo.provide("xg.components.shared.dialogAdapter");
xg.components.shared.dialogAdapter=(function(){
var _1={};
var _={};
_1.alert=function(_3,_4){
return xg.shared.util.alert(_3,_4);
};
_1.hideDialog=function(_5){
_1.hideOverlay(_5);
_5.hide();
};
_1.confirm=function(_6){
return xg.shared.util.confirm(_6);
};
_1.busy=function(_7,_8){
return xg.shared.util.progressDialog({bodyHtml:xg.qh(_7),classes:_8});
};
_1.showOverlay=function(_9){
return xg.shared.util.showOverlay();
};
_1.hideOverlay=function(_a){
return xg.shared.util.hideOverlay();
};
return _1;
})();
}
if(!dojo.hostenv.findModule("xg.components.chat.RoomOptions",false)){
dojo.provide("xg.components.chat.RoomOptions");
xg.components.chat.RoomOptions=function(_1,_2){
var _3={};
var _={};
_.initialize=function(){
var _5=_1.getRoom();
var _6=_1.getContainer();
var _7=_.initializeAddMemberMenuItem();
_.initializeChangeGroupNameMenuItem();
_.initializeChangeGroupPictureMenuItem();
_.initializeLeaveConversationMenuItem();
_.initializeDeleteConversationMenuItem();
_.initializeBlockPersonMenuItem();
_.initializeUnblockPersonMenuItem();
_6.find(".xg_optionsChat").click(function(_8){
_8.preventDefault();
_8.stopPropagation();
xg.shared.EventRegistry.fire("xg.components.chat.stopPropagation");
_6.find(".xg_optionsChat-dropdown").toggle();
_7.hideDropdown();
_6.find(".cht-optionSection").hide();
if(_5.isDirectMessage()&&_5.getOtherUser().isBlockedByCurrentUser()){
_6.find(".xg_optionsChat-dropdown").find("li").hide();
_6.find(".cht-unblockPersonMenuItem").parent("li").show();
}else{
_6.find(".xg_optionsChat-dropdown").find("li").show();
if(_5.getType()=="PRIVATE"&&!_5.isDirectMessage()){
_6.find(".cht-groupMenuItem").parent("li").show();
}else{
if(_5.getType()=="MAIN"&&_2.userIsAdmin){
_6.find(".cht-groupMenuItem").parent("li").show();
}else{
if(_5.getType()=="PUBLIC"&&_2.userIsAdmin){
_6.find(".cht-groupMenuItem").parent("li").show();
}else{
_6.find(".cht-groupMenuItem").parent("li").hide();
}
}
}
_6.find(".cht-leaveConversationMenuItem").parent("li").toggle(_5.isLeavable());
_6.find(".cht-unblockPersonMenuItem").parent("li").hide();
_6.find(".cht-blockPersonMenuItem").parent("li").toggle(_5.isDirectMessage()&&!_5.getOtherUser().isBlockedByCurrentUser());
}
});
_6.find(".cht-optionSection").click(function(_9){
_9.stopPropagation();
xg.shared.EventRegistry.fire("xg.components.chat.stopPropagation");
});
x$(document).click(function(){
_6.find(".cht-optionSection, .xg_optionsChat-dropdown").hide();
});
};
_.initializeBlockPersonMenuItem=function(){
var _a=_1.getRoom();
var _b=_1.getContainer();
_b.find(".cht-blockPersonMenuItem").click(function(_c){
_c.preventDefault();
_c.stopPropagation();
xg.shared.EventRegistry.fire("xg.components.chat.stopPropagation");
_b.find(".xg_optionsChat-dropdown").hide();
xg.components.shared.dialogAdapter.confirm({classes:"cht-popup",title:xg.shared.nls.text("BLOCK_PERSON"),bodyText:xg.shared.nls.text("ARE_YOU_SURE_BLOCK_USER",_a.getOtherUser().getName()),okButtonText:xg.shared.nls.text("BLOCK"),onOk:function(){
_2.server.blockUser(_a.getOtherUser());
}});
});
};
_.initializeUnblockPersonMenuItem=function(){
var _d=_1.getRoom();
var _e=_1.getContainer();
_e.find(".cht-unblockPersonMenuItem").click(function(_f){
_f.preventDefault();
_f.stopPropagation();
xg.shared.EventRegistry.fire("xg.components.chat.stopPropagation");
_e.find(".xg_optionsChat-dropdown").hide();
_2.server.unblockUser(_d.getOtherUser());
});
};
_.initializeLeaveConversationMenuItem=function(){
var _10=_1.getContainer();
_10.find(".cht-leaveConversationMenuItem").click(function(_11){
_11.preventDefault();
_11.stopPropagation();
xg.shared.EventRegistry.fire("xg.components.chat.stopPropagation");
_10.find(".xg_optionsChat-dropdown").hide();
xg.components.shared.dialogAdapter.confirm({classes:"cht-popup",title:xg.shared.nls.text("LEAVE_CONVERSATION"),bodyText:xg.shared.nls.text("ARE_YOU_SURE_LEAVE_CONVERSATION"),okButtonText:xg.shared.nls.text("LEAVE"),onOk:function(){
_2.server.leaveRoom(_1.getRoom());
}});
});
};
_.initializeDeleteConversationMenuItem=function(){
var _12=_1.getContainer();
_12.find(".cht-deleteConversationMenuItem").click(function(_13){
_13.preventDefault();
_13.stopPropagation();
xg.shared.EventRegistry.fire("xg.components.chat.stopPropagation");
_12.find(".xg_optionsChat-dropdown").hide();
xg.components.shared.dialogAdapter.confirm({classes:"cht-popup",title:xg.shared.nls.text("DELETE_CONVERSATION"),bodyText:xg.shared.nls.text("ARE_YOU_SURE_DELETE_CONVERSATION"),okButtonText:xg.shared.nls.text("DELETE"),onOk:function(){
_2.server.deleteConversation(_1.getRoom());
}});
});
};
_.initializeAddMemberMenuItem=function(){
var _14=_1.getRoom();
var _15=_1.getContainer();
_15.find(".cht-addMemberMenuItem").click(function(_16){
_16.preventDefault();
_16.stopPropagation();
xg.shared.EventRegistry.fire("xg.components.chat.stopPropagation");
_15.find(".xg_optionsChat-dropdown").hide();
_15.find(".cht-addMemberSection").show();
if(_15.find(".cht-addMemberSection").is(":visible")){
_15.find(".xg_inputSearch").focus();
}
});
var _17=xg.components.chat.SearchField(_15.find(".xg_inputSearch"),_15.find(".cht-searchResults"),_2,function(_18){
_2.server.addUserToRoom(_18,_14);
_15.find(".cht-addMemberSection").hide();
},function(){
_15.find(".cht-addMemberSection").hide();
});
x$(document).click(function(){
_17.hideDropdown();
});
return _17;
};
_.initializeChangeGroupNameMenuItem=function(){
var _19=_1.getRoom();
var _1a=_1.getContainer();
var _1b=_1a.find(".cht-changeGroupNameSection");
_1a.find(".cht-changeGroupNameMenuItem").click(function(_1c){
_1c.preventDefault();
_1c.stopPropagation();
xg.shared.EventRegistry.fire("xg.components.chat.stopPropagation");
_1a.find(".xg_optionsChat-dropdown").hide();
var _1d=xg.components.chat.HTMLBuilder.get().roomAvatar(_19,false);
_1b.find(".cht-avatarContainer").html(_1d);
_1b.find("[name=\"groupName\"]").val(_19.getName());
_1b.show();
_1b.find("[name=\"groupName\"]").focus();
});
_1b.submit(function(_1e){
_1e.preventDefault();
var _1f=parseInt(_1b.find("[name=\"groupName\"]").attr("maxlength"),10);
if(_1b.find("[name=\"groupName\"]").val()==_19.generateName().substring(0,_1f)){
var _20=null;
}else{
var _20=_1b.find("[name=\"groupName\"]").val();
}
_2.server.updateRoom(_19,_20,_19.getIconUrl());
_1b.hide();
});
};
_.initializeChangeGroupPictureMenuItem=function(){
var _21=_1.getRoom();
var _22=_1.getContainer();
var _23=_22.find(".cht-changeGroupPictureSection");
_22.find(".cht-changeGroupPictureMenuItem").click(function(_24){
_24.preventDefault();
_24.stopPropagation();
xg.shared.EventRegistry.fire("xg.components.chat.stopPropagation");
_22.find(".xg_optionsChat-dropdown").hide();
var _25=xg.components.chat.HTMLBuilder.get().roomAvatar(_21,false);
_23.find(".cht-avatarContainer").html(_25);
_23.show();
});
var _26=_23.find("[name=\"roomImage\"]");
var _27;
xg.components.shared.FileUploader({$fileInput:_26,url:"/main/chat/roomImage",maxFileCount:1,onExceedMaxFileCount:function(){
},onStart:function(_28){
_27=xg.components.shared.dialogAdapter.busy(xg.shared.nls.text("UPLOADING_LABEL"),"cht-popup");
_28();
},onEnd:function(_29){
_23.hide();
xg.components.shared.dialogAdapter.hideDialog(_27);
if(_29.success!==true){
xg.components.shared.dialogAdapter.alert({classes:"cht-popup",bodyHtml:xg.qh(_29.errorMessage||xg.shared.nls.text("FAILED_TO_UPLOAD_IMAGE"))});
return;
}
_2.server.updateRoom(_21,_21.getNameProper(),_29.avatarUrl);
},onError:function(){
_23.hide();
xg.components.shared.dialogAdapter.hideDialog(_27);
xg.components.shared.dialogAdapter.alert({classes:"cht-popup",bodyHtml:xg.qh(xg.shared.nls.text("FAILED_TO_UPLOAD_IMAGE"))});
}});
};
_.initialize();
return _3;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.Emoticons",false)){
dojo.provide("xg.components.chat.Emoticons");
xg.components.chat.Emoticons=function(_1){
var _2={};
var _={};
var _4=[[":-D",":-)",":-O",":-*"],[":-P",":-(",";-)",":-X"],["8-)",":-!","8-(",":'("]];
_2.EMOTICON_TO_CSS_CLASS_NAME_MAP={":-D":"biggrin",":D":"biggrin",":-)":"smile",":)":"smile",":-O":"surprise",":-o":"surprise",":O":"surprise",":o":"surprise",":-*":"biglips",":-P":"tongue",":-p":"tongue",":P":"tongue",":p":"tongue",":-(":"frown",":(":"frown",";-)":"wink",";)":"wink",":-X":"sick",":-x":"sick",":X":"sick",":x":"sick","8-)":"coolsmile","8)":"coolsmile",":-!":"ohmy","8-(":"sadeyes","8(":"sadeyes",":'(":"cry"};
_2.initialize=function(){
x$(".emoticon-button",_1).click(_2.handleEmoticonButtonClick);
return _2;
};
_2.handleEmoticonButtonClick=function(e){
e.preventDefault();
var _6=x$(".emoticon-panel",_1);
if("block"==_6.css("display")){
_2.hideEmoticons(_6);
}else{
_2.showEmoticons(_6);
}
};
_2.showEmoticons=function(_7){
_7.show();
_7.bind("click",_2.insertEmoticon);
};
_2.hideEmoticons=function(_8){
_8.hide();
_8.unbind("click",_2.insertEmoticon);
};
_2.insertEmoticon=function(e){
if("undefined"===typeof e.offsetX){
e.offsetX=e.originalEvent.layerX;
e.offsetY=e.originalEvent.layerY;
}
var x=_.getColumnFromOffset(e.offsetX);
var y=_.getRowFromOffset(e.offsetY);
if(null===x||null===y){
return;
}
var _c=_.getEmoticonForPosition(x,y);
var _d=x$(".xg_chatInput",_1);
_d.val(_d.val()+_c);
_2.hideEmoticons(x$(e.target));
_2.focusAtEnd(_d);
};
_2.focusAtEnd=function(_e){
_e.focus();
if(_e[0].setSelectionRange){
var _f=_e.val().length;
_e[0].setSelectionRange(_f,_f);
}else{
_e.val(_e.val());
}
_e[0].scrollTop=999999;
};
_.getEmoticonForPosition=function(x,y){
return _4[y][x];
};
_.getColumnFromOffset=function(x){
if(8<=x&&26>=x){
return 0;
}
if(38<=x&&56>=x){
return 1;
}
if(70<=x&&88>=x){
return 2;
}
if(100<=x&&118>=x){
return 3;
}
return null;
};
_.getRowFromOffset=function(y){
if(2<=y&&20>=y){
return 0;
}
if(32<=y&&46>=y){
return 1;
}
if(58<=y&&75>=y){
return 2;
}
return null;
};
return _2;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.roomwindow.TypingTracker",false)){
dojo.provide("xg.components.chat.roomwindow.TypingTracker");
xg.components.chat.roomwindow.TypingTracker=function(_1,_2){
var _3={};
var _={};
_.delay=3000;
_.typing=false;
_.quiescenceTimer;
_.initialize=function(){
_.quiescenceTimer=xg.shared.util.createQuiescenceTimer(_.delay,function(){
_.typing=false;
_2();
});
};
_3.onType=function(){
_.quiescenceTimer.trigger();
if(!_.typing){
_.typing=true;
_1();
}
};
_3.onSubmit=function(){
_.quiescenceTimer.cancel();
_.typing=false;
_2();
};
_.initialize();
return _3;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.roomwindow.MessagePanel",false)){
dojo.provide("xg.components.chat.roomwindow.MessagePanel");
xg.components.chat.roomwindow.MessagePanel=function(_1,_2,_3,_4,_5,_6,_7,_8){
var _9={};
var _={};
_.showing=true;
_.$messageList;
_.$lastLi=x$();
_.$input;
_.$textareaContainer;
_.maxMessageLength;
_.emoticons;
_.browserSupportsInlineBlock;
_.pendingMessages=[];
_.pendingMessagesKeyedById={};
_.lastActivityTime=new Date().getTime();
_.distanceFromBottomBeforeAddingMessages;
_.distanceFromBottomBeforeHiding;
_.messageAddedByCurrentUser=false;
_.openedAtLeastOnce=false;
_.hasMoreHistory=false;
_.historyEndId=null;
_.historyRequestInFlight=false;
_.HISTORY_BATCH_SIZE=20;
_.messageConfirmedSentTimer;
_.showingMessageNotSentWarning=false;
_.$typingIndicators={};
_.initialize=function(){
_.$messageList=x$(".xg_messageList",_3);
_.$input=x$(".xg_chatInput",_3);
_.$textareaContainer=x$(".textarea-container",_3);
_.maxMessageLength=parseInt(_.$input.attr("maxlength"),10);
_.emoticons=xg.components.chat.Emoticons(_2).initialize();
xg.shared.util.setMaxLength(_.$input[0],_.maxMessageLength);
_.browserSupportsInlineBlock=_.doesBrowserSupportInlineBlock();
var _b=xg.components.chat.roomwindow.TypingTracker(function(){
_6.server.startedTypingIn(_4);
},function(){
_6.server.stoppedTypingIn(_4);
});
_3.find(".cht-send").click(function(){
_.sendMessage();
_b.onSubmit();
});
_.$input.keypress(function(_c){
if(_c.which==13){
_c.preventDefault();
_.sendMessage();
_b.onSubmit();
}else{
_b.onType();
}
});
_.$input.autoResize({animate:false,maxHeight:100000,extraSpace:0,onAfterResize:_9.updateSize});
var _d=0;
_.$input.bind("keyup change input paste resize blur",function(){
_.lastActivityTime=new Date().getTime();
if(_d!=_.$input.outerHeight(true)){
_9.updateSize();
_d=_.$input.outerHeight(true);
}
});
_.initializeFileUploadButton();
_.initializeImageUploadButton();
_.initializeDeleteMessageButtons();
_.initializeHistoryInfiniteScroll();
_.initializeMessageNotSentWarning();
xg.shared.EventRegistry.listen("xg.components.chat.models.User.blockedByCurrentUserChanged",function(_e){
if(_4.isDirectMessage()&&_4.getOtherUser().getId()==_e.getId()){
if(_e.isBlockedByCurrentUser()){
_.showBlockedByCurrentUserWarning();
}else{
_.hideBlockedByCurrentUserWarning();
}
}
});
if(_4.isDirectMessage()&&_4.getOtherUser().isBlockedByCurrentUser()){
_.showBlockedByCurrentUserWarning();
}
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.MESSAGE_DELETE",function(_f){
if(_1.getId()===_f.roomId){
$message=_3.find(".cht-message-"+_f.messageId);
$message.find("._message").html(xg.components.chat.HTMLBuilder.get().messageDeleted());
$message.find(".cht-state").remove();
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.MESSAGE_SEEN",function(_10){
if(_1.getId()===_10.roomId){
if(_1.isOpen()){
$message=_3.find(".cht-message-"+_10.messageId);
$message.find(".cht-state").show().data("state","SEEN").text(xg.shared.nls.text("SEEN"));
}else{
if(_.pendingMessagesKeyedById[_10.messageId]){
_.pendingMessagesKeyedById[_10.messageId].seen=true;
}
}
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_LEAVE",function(_11){
if(_1.getId()===_11.room.roomId&&_11.user){
_.addUserLeftNote(_11.user);
}
});
_.initializeTypingIndicators();
};
_.initializeTypingIndicators=function(){
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_START_TYPING",function(_12){
if(_1.getId()===_12.roomId&&_6.user.getId()!==_12.user.ningId){
var _13=xg.components.chat.server.Formatter.toUser(_12.user,_6);
_.showTypingIndicator(_13);
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_STOP_TYPING",function(_14){
if(_1.getId()===_14.roomId&&_6.user.getId()!==_14.user.ningId){
var _15=xg.components.chat.server.Formatter.toUser(_14.user,_6);
_.hideTypingIndicator(_15);
}
});
var _16=120000;
setInterval(function(){
var now=new Date().getTime();
x$.each(_.$typingIndicators,function(_18,_19){
var _1a=_6.getUser(_18);
if(now-_19.data("startTime")>_16){
_.hideTypingIndicator(_1a);
}
});
},30000);
};
_9.show=function(){
_.showing=true;
_3.find(".cht-messagePanel").show();
_9.updateSize();
if(_.distanceFromBottomBeforeHiding<20){
_.scrollToBottom();
}
};
_9.hide=function(){
_.distanceFromBottomBeforeHiding=_.getDistanceFromBottom();
_.showing=false;
_3.find(".cht-messagePanel").hide();
};
_9.updateSize=function(){
if(!_.showing){
return;
}
var _1b=_.getDistanceFromBottom();
var _1c=_1.getSelectedHeight();
var _1d=_1c?_1c:_6.layout.getExpandedHeight(_1,_.$messageList,_.$lastLi,_.$textareaContainer);
_1d=Math.min(x$(window).height()-_6.PADDING,Math.max(_8,_1d));
var _1e=_.$input.outerHeight()>_.$textareaContainer.height();
x$(".emoticonContainer",_3).toggleClass("withScrollbar",_1e);
var _1f=_.$input.val().length;
if(_1f>0&&_.getCursorPosition(_.$input)>=_1f){
var _20=_.$textareaContainer[0].scrollHeight;
_20=_.$textareaContainer[0].scrollHeight;
_.$textareaContainer.scrollTop(_20-_.$textareaContainer.innerHeight());
}
_6.layout.setWindowHeight(_2,_1d);
_6.layout.updateMessageListSize(_.$messageList,_3,_1d);
if(_1b<20){
_.scrollToBottom();
}
};
_.initializeMessageNotSentWarning=function(){
var _21=false;
_.messageConfirmedSentTimer=xg.shared.util.createQuiescenceTimer(10000,function(){
_.showMessageNotSentWarning();
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.MESSAGE_ADD",function(_22){
if(_21){
return;
}
_.messageConfirmedSentTimer.cancel();
_.hideMessageNotSentWarning();
});
xg.shared.EventRegistry.listen("xg.components.chat.RoomWindow.testMessageNotSentWarning",function(_23){
_.showMessageNotSentWarning();
_21=true;
});
};
_.initializeHistoryInfiniteScroll=function(){
var _24=50;
var _25=xg.shared.util.createQuiescenceTimer(_24,function(){
if(!_.hasMoreHistory||_.historyRequestInFlight||_.$messageList.scrollTop()>20){
return;
}
_.$messageList.prepend(x$(xg.components.chat.HTMLBuilder.get().loadingMoreMessages()));
_.getMoreHistory(function(_26){
_.$messageList.find(".cht-loadingMoreMessages").remove();
var _27=_.getDistanceFromBottom();
var _28=20;
_.prependHistory(_26);
_9.updateSize();
_.$messageList.scrollTop(_.$messageList[0].scrollHeight-_.$messageList.innerHeight()-_27-_28);
});
});
_.$messageList.scroll(function(){
_25.trigger();
});
};
_.initializeDeleteMessageButtons=function(){
_3.on("click",".cht-confirmDeleteMessage",function(_29){
_29.stopPropagation();
xg.shared.EventRegistry.fire("xg.components.chat.stopPropagation");
var _2a=x$(this),_2b=_2a.closest(".cht-deleteMessage");
_6.server.deleteMessage(_2b.data("messageId"),_1.getId());
_2b.hide();
});
_3.on("click",".cht-deleteMessage",function(_2c){
_2c.preventDefault();
var _2d=x$(this),_2e=_2d.find(".cht-confirmDeleteMessage");
if(_2e.is(":visible")){
_2e.removeClass("visible");
}else{
_2e.addClass("visible");
}
});
};
_.initializeImageUploadButton=function(){
var _2f=_3.find(".xg_addImage .transparentFileInputButton-fileInput");
var _30;
var _31=x$(".xg_chat").data("maxUploadedFileCount");
var _32=x$(".xg_chat").data("fileSizeLimitInMb");
xg.components.shared.FileUploader({$fileInput:_2f,url:"/main/chat/images",validate:function(_33){
if(_33.length>_31){
xg.components.shared.dialogAdapter.alert({classes:"cht-popup",bodyHtml:xg.qh(xg.shared.nls.text("TOO_MANY_IMAGES",_31))});
return false;
}
for(var i=0;i<_33.length;i++){
var _35=_33[i];
if(_35.size&&_35.size>1048576*_32){
xg.components.shared.dialogAdapter.alert({classes:"cht-popup",bodyHtml:xg.qh(xg.shared.nls.text("FILE_IS_BIGGER_THAN_LIMIT",_35.name,_32))});
return false;
}
}
return true;
},onStart:function(_36){
_30=xg.components.shared.dialogAdapter.busy(xg.shared.nls.text("UPLOADING_LABEL"),"cht-popup");
_36();
},onEnd:function(_37){
xg.components.shared.dialogAdapter.hideDialog(_30);
if(_37.success!==true){
xg.components.shared.dialogAdapter.alert({classes:"cht-popup",bodyHtml:xg.qh(_37.errorMessage||xg.shared.nls.text("FAILED_TO_UPLOAD_IMAGE"))});
return;
}
x$.each(_37.files,function(i,_39){
_6.server.sendFile(_39,_4.getId());
});
},onError:function(){
xg.components.shared.dialogAdapter.hideDialog(_30);
xg.components.shared.dialogAdapter.alert({classes:"cht-popup",bodyHtml:xg.qh(xg.shared.nls.text("FAILED_TO_UPLOAD_IMAGE"))});
}});
};
_.initializeFileUploadButton=function(){
var _3a=_3.find(".xg_addFile .transparentFileInputButton-fileInput");
var _3b;
var _3c=x$(".xg_chat").data("maxUploadedFileCount");
var _3d=x$(".xg_chat").data("fileSizeLimitInMb");
xg.components.shared.FileUploader({$fileInput:_3a,url:"/main/chat/files",validate:function(_3e){
if(_3e.length>_3c){
xg.components.shared.dialogAdapter.alert({classes:"cht-popup",bodyHtml:xg.qh(xg.shared.nls.text("TOO_MANY_FILES",_3c))});
return false;
}
for(var i=0;i<_3e.length;i++){
var _40=_3e[i];
if(_40.size&&_40.size>1048576*_3d){
xg.components.shared.dialogAdapter.alert({classes:"cht-popup",bodyHtml:xg.qh(xg.shared.nls.text("FILE_IS_BIGGER_THAN_LIMIT",_40.name,_3d))});
return false;
}
}
return true;
},onStart:function(_41){
_3b=xg.components.shared.dialogAdapter.busy(xg.shared.nls.text("UPLOADING_LABEL"),"cht-popup");
_41();
},onEnd:function(_42){
xg.components.shared.dialogAdapter.hideDialog(_3b);
if(_42.success!==true){
xg.components.shared.dialogAdapter.alert({classes:"cht-popup",bodyHtml:xg.qh(_42.errorMessage||xg.shared.nls.text("FAILED_TO_UPLOAD_FILE"))});
return;
}
x$.each(_42.files,function(i,_44){
_6.server.sendFile(_44,_4.getId());
});
},onError:function(){
xg.components.shared.dialogAdapter.hideDialog(_3b);
xg.components.shared.dialogAdapter.alert({classes:"cht-popup",bodyHtml:xg.qh(xg.shared.nls.text("FAILED_TO_UPLOAD_FILE"))});
}});
};
_.showMessageNotSentWarning=function(){
_.showingMessageNotSentWarning=true;
var _45=x$(xg.components.chat.HTMLBuilder.get().messageNotSentWarning());
_.showWarning(_45,false);
};
_.hideMessageNotSentWarning=function(){
if(!_.showingMessageNotSentWarning){
return;
}
_.showingMessageNotSentWarning=true;
_.hideWarning();
};
_.showBlockedByCurrentUserWarning=function(){
var _46=x$(xg.components.chat.HTMLBuilder.get().userBlockedWarning());
_46.find("a").click(function(_47){
_47.preventDefault();
_6.server.unblockUser(_4.getOtherUser());
});
_.showWarning(_46,true);
};
_.hideBlockedByCurrentUserWarning=function(){
_.hideWarning();
};
_9.afterAddingMessages=function(){
_.repositionWarnings();
if(_1.isOpen()){
_9.updateSize();
if(_.distanceFromBottomBeforeAddingMessages<20||_.messageAddedByCurrentUser){
_.scrollToBottom();
}
}
};
_9.afterOpeningWindow=function(){
_.displayPendingMessages();
_9.updateSize();
_.scrollToBottom();
if(!_.openedAtLeastOnce){
_.openedAtLeastOnce=true;
_.getMoreHistory(function(_48){
_.prependHistory(_48);
_.$lastLi=_.$messageList.children().last();
_9.updateSize();
_.scrollToBottom();
});
}
};
_.getMoreHistory=function(_49){
_.historyRequestInFlight=true;
_6.server.getRoomHistory(_4.getId(),_.HISTORY_BATCH_SIZE,_.historyEndId,function(_4a){
_4a.sort(function(a,b){
if(a.timestamp<b.timestamp){
return -1;
}
if(a.timestamp>b.timestamp){
return 1;
}
return 0;
});
if(_4a.length<_.HISTORY_BATCH_SIZE){
_.hasMoreHistory=false;
_.historyEndId=null;
}else{
_.hasMoreHistory=true;
_.historyEndId=_4a[0].id;
}
_49(_4a);
_.historyRequestInFlight=false;
});
};
_9.addMessage=function(_4d){
_.lastActivityTime=Math.max(_.lastActivityTime,_4d.timestamp);
if(!_.openedAtLeastOnce){
}else{
if(!_1.isOpen()){
_.pendingMessages.push(_4d);
_.pendingMessagesKeyedById[_4d.id]=_4d;
}else{
_.addMessageToDisplay(_4d);
}
}
if(_7){
_7.startFlashing(xg.shared.nls.text("TITLEBAR_USER_SAYS",_4d.sender.getName()));
}
};
_9.getLastActivityTime=function(){
return _.lastActivityTime;
};
_.showTypingIndicator=function(_4e){
if(_.$typingIndicators[_4e.getId()]){
return;
}
var _4f=_.getDistanceFromBottom()<20;
var _50=x$(xg.components.chat.HTMLBuilder.get().typingIndicator(_4e));
_.$messageList.append(_50);
_.$lastLi=_50;
_.$typingIndicators[_4e.getId()]=_50;
_50.data("startTime",new Date().getTime());
if(_4f){
_.scrollToBottom();
}
};
_.hideTypingIndicator=function(_51){
if(!_.$typingIndicators[_51.getId()]){
return;
}
var _52=_.$typingIndicators[_51.getId()];
_.$lastLi=_52.prev();
_52.remove();
delete _.$typingIndicators[_51.getId()];
};
_.showWarning=function(_53,_54){
_.$messageList.find(".warning").remove();
_.$messageList.append(_53);
_.$lastLi=_53;
_9.updateSize();
_.scrollToBottom();
if(_54){
_2.addClass("roomDisabled");
x$(".textarea-container",_3).hide();
}
};
_.hideWarning=function(){
var _55=_.$messageList.find(".warning");
_.$lastLi=_55.prev();
_55.remove();
_2.removeClass("roomDisabled");
x$(".textarea-container",_3).show();
_9.updateSize();
};
_.repositionWarnings=function(){
if(!x$.isEmptyObject(_.$typingIndicators)){
var _56=x$(".cht-typing",_2);
_.$messageList.append(_56);
_.$lastLi=_56.last();
}
if(_2.hasClass("roomDisabled")||_.showingMessageNotSentWarning){
var _57=x$(".warning",_2);
_.$messageList.append(_57);
_.$lastLi=_57.last();
}
};
_.doesBrowserSupportInlineBlock=function(){
if(x$.browser.msie&&x$.browser.version.match(/^(5|6|7)\b/)){
return false;
}
var _58=x$("<div style=\"display: inline-block;\"></div>");
_58.appendTo(document.body);
var _59=_58.css("display")=="inline-block";
_58.remove();
return _59;
};
_9.beforeAddingMessages=function(){
_.distanceFromBottomBeforeAddingMessages=_.getDistanceFromBottom();
_.messageAddedByCurrentUser=false;
};
_.getDistanceFromBottom=function(){
return _.$messageList[0].scrollHeight-_.$messageList.scrollTop()-_.$messageList.innerHeight();
};
_.displayPendingMessages=function(){
if(_.pendingMessages.length==0){
return false;
}
while(_.pendingMessages.length){
var _5a=_.pendingMessages.shift();
_.addMessageToDisplay(_5a);
}
_.pendingMessagesKeyedById={};
return true;
};
_.addMessageToDisplay=function(_5b){
if(_5b.sender.getId()===_6.user.getId()){
_.messageAddedByCurrentUser=true;
}
var _5c=_.createMessageLi(_5b,false);
_.$messageList.append(_5c);
_.$lastLi=_5c;
_.updateMessageHeading(_5c);
if(_5b.sender.getId()!=_6.user.getId()){
_6.server.seen(_5b);
}
};
_.addUserLeftNote=function(_5d){
if(!_1.isOpen()){
return;
}
var _5e=_.getDistanceFromBottom();
var _5f=xg.components.chat.server.Formatter.toUser(_5d,_6);
var _60=x$(xg.components.chat.HTMLBuilder.get().userLeft(_5f));
_.$messageList.append(_60);
_.$lastLi=_60;
if(_5e<20){
_.scrollToBottom();
}
};
_.prependHistory=function(_61){
var _62=x$("<ul></ul>");
x$.each(_61,function(i,_64){
var _65=_.createMessageLi(_64,true);
_62.append(_65);
_.updateMessageHeading(_65);
});
_.$messageList.prepend(_62.children());
};
_.createMessageLi=function(_66,_67){
var _68=_.toMessageHtml(_66.messageOrFile);
var $li=x$(xg.components.chat.HTMLBuilder.get().message(_66,_68,_66.sender.getId()==_6.user.getId(),_67));
if(_66.sender.getId()!=_6.user.getId()){
x$("._avatar, ._sender",$li).click(function(_6a){
_6a.preventDefault();
_5.navigateToProfile(_66.sender.getId());
});
}
return $li;
};
_.toMessageHtml=function(_6b){
if(x$.isPlainObject(_6b)){
var _6c=_6b,url=_6c.url,_6e=window.location.protocol;
if(window.location.href.indexOf("chatTestHttps=1")>-1){
_6e="https:";
}
if(_6e=="https:"){
url=url.replace("http://","https://").replace(":80/","/");
}
if(_6c.width){
var _6f=_3.width()*2;
var _70=url+"?width="+Math.min(_6f,_6c.width);
return "<img class=\"cht-image\" src=\""+xg.qh(_70)+"\">";
}else{
return "<a class=\"cht-file\" href=\""+xg.qh(url)+"\" target=\"_blank\">"+xg.qh(_6c.filename)+"</a>";
}
}
var _71=_6b;
if(_71&&_6.languageFilter){
_71=_6.languageFilter.filter(_71);
}
var _72=xg.linkify(xg.qh(_71),"_blank");
if(_.browserSupportsInlineBlock){
_72=_.insertEmoticonImages(_72,_.emoticons);
}
return _72;
};
_.updateMessageHeading=function(_73){
if(!_73||_73.length==0){
return;
}
var _74=_73.prev();
if(_74.length==0||_74.data("senderId")!=_73.data("senderId")){
_73.removeClass("brief");
return;
}
_73.addClass("brief");
};
_.scrollToBottom=function(){
var _75=_.$messageList[0].scrollHeight;
_75=_.$messageList[0].scrollHeight;
_.$messageList.scrollTop(_75-_.$messageList.innerHeight());
};
_.insertEmoticonImages=function(_76,_77){
x$.each(_77.EMOTICON_TO_CSS_CLASS_NAME_MAP,function(_78,_79){
_76=_76.replace(new RegExp(_.escapeRegExp(_78),"g"),"<span class=\"emoticon "+_79+"\">"+_78+"</span>");
});
return _76;
};
_.escapeRegExp=function(_7a){
return _7a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&");
};
_.sendMessage=function(){
if(_.$input.filter(":visible").length==0||_.$input.prop("disabled")){
return;
}
var _7b=x$.trim(_.$input.val().substr(0,_.maxMessageLength));
if(!_7b){
_.$input.val("");
return;
}
_5.sendMessage(_7b,_4.getId());
_.$input.val("");
_.messageConfirmedSentTimer.trigger();
};
_9.focus=function(){
x$(".xg_chatInput",_3).focus();
};
_.getCursorPosition=function(_7c){
var pos=0;
var el=_7c.get(0);
if(document.selection){
el.focus();
var Sel=document.selection.createRange();
var _80=document.selection.createRange().text.length;
Sel.moveStart("character",-el.value.length);
pos=Sel.text.length-_80;
}else{
if(el.selectionStart||el.selectionStart=="0"){
pos=el.selectionStart;
}
}
return pos;
};
_.initialize();
return _9;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.roomwindow.UserPanel",false)){
dojo.provide("xg.components.chat.roomwindow.UserPanel");
xg.components.chat.roomwindow.UserPanel=function(_1,_2,_3,_4,_5){
var _6={};
var _={};
_.$userPanel=_1.getContainer().find(".cht-userPanel");
_.$userList=_.$userPanel.find(".cht-userList");
_.hasMoreUsers=false;
_.nextStartIndex=0;
_.userRequestInFlight=false;
_.USER_BATCH_SIZE=20;
_.initialize=function(){
_.initializeUserInfiniteScroll();
_.handleEvents();
};
_.handleEvents=function(){
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_JOIN",function(_8){
if(_1.getId()===_8.room.roomId){
_.insertUser(xg.components.chat.server.Formatter.toUser(_8.user,_3));
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_ADD_USER",function(_9){
if(_1.getId()===_9.room.roomId){
_.insertUser(xg.components.chat.server.Formatter.toUser(_9.user,_3));
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_LEAVE",function(_a){
if(_1.getId()===_a.room.roomId){
_.removeUser(_a.userId);
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_BAN_USER",function(_b){
if(_1.getId()===_b.room.roomId){
_.removeUser(_b.userId);
}
});
};
_.removeUser=function(_c){
_.$userList.find("[data-screen-name=\""+_c+"\"]").remove();
if(_1.getRoom().isDirectMessage()){
_1.hideUserPanel();
}
};
_.insertUser=function(_d){
var _e=_d.getName().toLowerCase(),_f=false;
if(_.$userList.find(".cht-userName-"+_d.getId()).length>0){
return;
}
_.$userList.find(".cht-userName").each(function(){
var _10=x$(this);
if(_10.text().toLowerCase()>_e){
_10.closest("li").before(_.createUserLi(_d));
_f=true;
return false;
}
});
if(_f){
return;
}
if(_.hasMoreUsers){
return;
}
_.$userList.append(_.createUserLi(_d));
};
_.initializeUserInfiniteScroll=function(){
var _11=50;
var _12=xg.shared.util.createQuiescenceTimer(_11,function(){
if(!_.hasMoreUsers||_.userRequestInFlight||_.getDistanceFromBottom()>20){
return;
}
_.$userList.append(x$(xg.components.chat.HTMLBuilder.get().findingMorePeople()));
_.getMoreUsers(function(_13){
_.$userList.find(".cht-findingMorePeople").remove();
var _14=_.$userList.scrollTop();
var _15=20;
_.appendUsers(_13);
_.$userList.scrollTop(_14+_15);
});
});
_.$userList.scroll(function(){
_12.trigger();
});
};
_.getDistanceFromBottom=function(){
return _.$userList[0].scrollHeight-_.$userList.scrollTop()-_.$userList.innerHeight();
};
_6.show=function(){
_.$userList.empty();
_.$userPanel.show();
_.$userList.scrollTop(0);
_.hasMoreUsers=false;
_.nextStartIndex=0;
_6.updateSize();
_.getMoreUsers(function(_16){
_.appendUsers(_16);
});
};
_6.hide=function(){
_.$userPanel.hide();
};
_6.updateSize=function(){
var _17=_1.getSelectedHeight();
if(_17){
var _18=_17;
_18=Math.min(x$(window).height()-_3.PADDING,Math.max(_4,_18));
_3.layout.setWindowHeight(_2,_18);
}
_3.layout.updateUserListSize(_.$userList);
};
_.getMoreUsers=function(_19){
_.userRequestInFlight=true;
_3.server.getRoomUsers(_1.getId(),_.USER_BATCH_SIZE,_.nextStartIndex,function(_1a){
if(_1a.length<_.USER_BATCH_SIZE){
_.hasMoreUsers=false;
_.nextStartIndex=null;
}else{
_.hasMoreUsers=true;
_.nextStartIndex+=_.USER_BATCH_SIZE;
}
_19(_1a);
_.userRequestInFlight=false;
});
};
_.appendUsers=function(_1b){
var _1c=_.$userList;
x$.each(_1b,function(i,_1e){
var _1f=_.createUserLi(_1e);
if(_1e.getId()!=_3.user.getId()){
x$("._avatar, .cht-userName",_1f).click(function(_20){
_20.preventDefault();
_5.navigateToProfile(_1e.getId());
});
}
_1c.append(_1f);
});
};
_.createUserLi=function(_21){
$li=x$(xg.components.chat.HTMLBuilder.get().roomUserListItem(_21,_1.getRoom(),_3.user,_3.userIsAdmin));
$li.find(".cht-ban").click(function(_22){
_22.preventDefault();
xg.components.shared.dialogAdapter.confirm({"classes":"cht-popup","title":xg.shared.nls.html("REMOVE_THIS_PERSON"),"bodyText":xg.shared.nls.html("UNABLE_TO_CHAT",xg.qh(_21.getName())),"okButtonText":xg.shared.nls.html("REMOVE"),"onOk":function(){
_3.server.banUser(_21.getId(),_1.getRoom());
}});
});
return $li;
};
_.initialize();
return _6;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.RoomWindow",false)){
dojo.provide("xg.components.chat.RoomWindow");
xg.components.chat.RoomWindow=function(_1,_2,_3,_4,_5,_6,_7){
var _8={};
var _={};
_.$window;
_.chatPaneResizer;
_.MAX_LABEL_COUNT=100;
_.MIN_HEIGHT=197;
_.open=false;
_.messagePanel;
_.userPanel;
_.currentPanel;
_8.initialize=function(_a){
_1.find(".cht-roomName").addClass("cht-roomName-"+_2.getInternalId());
_.chatPaneResizer=xg.components.chat.ChatPaneResizer(x$(".resizeHandle",_1),_.updateSize,_.saveSize).initialize(_a);
_4.layout.initializeRoomWindowEarly(_8);
_.$window=x$(".xg_chatWindow",_1);
if(_.$window.length==0){
_.$window=_1;
}
_.setTitle(_2.getName());
x$(window).resize(_.updateSize);
xg.shared.EventRegistry.listen("xg.components.chat.models.Room.unreadCountChanged",function(_b){
if(_2===_b){
_8.updateLabel();
}
});
xg.components.chat.RoomOptions(_8,_4);
_.userPanel=xg.components.chat.roomwindow.UserPanel(_8,_.$window,_4,_.MIN_HEIGHT,_3);
_.messagePanel=xg.components.chat.roomwindow.MessagePanel(_8,_.$window,_1,_2,_3,_4,_7,_.MIN_HEIGHT);
_.currentPanel=_.messagePanel;
_8.updateForwardAndBackSymbols();
xg.shared.EventRegistry.listen("xg.components.chat.models.Room.nameChanged",function(_c){
if(_2===_c){
_8.updateForwardAndBackSymbols();
}
});
xg.shared.EventRegistry.listen("xg.components.chat.models.Room.sampleUsersChanged",function(_d){
if(_2===_d){
_8.updateForwardAndBackSymbols();
}
});
return _8;
};
_8.updateForwardAndBackSymbols=function(){
if(_2.isDirectMessage()){
_1.find(".cht-forwardSymbol").hide();
_1.find(".cht-backSymbol").hide();
}else{
if(_8.isShowingUserPanel()){
_1.find(".cht-forwardSymbol").hide();
_1.find(".cht-backSymbol").show();
}else{
_1.find(".cht-forwardSymbol").show();
_1.find(".cht-backSymbol").hide();
}
}
};
_8.showUserPanel=function(){
_.currentPanel=_.userPanel;
_.messagePanel.hide();
_.userPanel.show();
_8.updateForwardAndBackSymbols();
_1.addClass("cht-userPanelShown");
};
_8.hideUserPanel=function(){
_.currentPanel=_.messagePanel;
_.userPanel.hide();
_.messagePanel.show();
_8.updateForwardAndBackSymbols();
_1.removeClass("cht-userPanelShown");
};
_8.isShowingUserPanel=function(){
return _.currentPanel===_.userPanel;
};
_.saveSize=function(){
_3.saveRoomWindowStates();
};
_.setTitle=function(_e){
x$(".cht-roomName",_1).text(_e);
_8.updateLabel();
};
_8.beforeAddingMessages=function(){
_.messagePanel.beforeAddingMessages();
};
_8.addMessage=function(_f){
_.messagePanel.addMessage(_f);
};
_8.afterAddingMessages=function(){
_.messagePanel.afterAddingMessages();
};
_8.focus=function(){
_.messagePanel.focus();
};
_8.isSelected=function(){
return _4.layout.isRoomWindowSelected(_8);
};
_.updateSize=function(){
_.currentPanel.updateSize();
};
_8.open=function(){
_4.layout.beforeOpeningRoomWindow(_8);
_8.setOpen(true);
_2.clearUnreadCount();
_.$window.show();
_3.saveRoomWindowStates();
_4.layout.afterOpeningRoomWindow(_8);
_.messagePanel.afterOpeningWindow();
};
_8.setOpen=function(_10){
_.open=_10;
};
_8.isOpen=function(){
return _.open;
};
_8.getId=function(){
return _2.getId();
};
_8.getName=function(){
return _2.getName();
};
_8.getRoom=function(){
return _2;
};
_8.getContainer=function(){
return _1;
};
_8.getLastActivityTime=function(){
return _.messagePanel.getLastActivityTime();
};
_8.updateLabel=function(){
var _11=_4.layout.getLabel(_8);
var _12;
unreadMessageCount=_2.getUnreadCount();
if(unreadMessageCount==0){
_12="";
}else{
if(unreadMessageCount>_.MAX_LABEL_COUNT){
_12="<span class=\"count\">"+_.MAX_LABEL_COUNT+"+</span>";
}else{
_12="<span class=\"count\">"+unreadMessageCount+"</span>";
}
}
_11.empty();
$infoContents=x$("<span class=\"contents\"></span>").appendTo(_11);
$infoContents.addClass("cht-roomName-"+_2.getInternalId());
var _13=_2.getName();
$infoContents.html(xg.qh(_13)+_12);
while($infoContents.width()>_4.layout.getMaxLabelWidth()){
_13=_13.substring(0,_13.length-1);
$infoContents.html(xg.qh(_13)+"\u2026"+_12);
}
};
_8.getSelectedHeight=function(){
return _.chatPaneResizer.getSelectedHeight();
};
return _8;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.NotificationSound",false)){
dojo.provide("xg.components.chat.NotificationSound");
xg.components.chat.NotificationSound=function(_1,_2){
var _3={};
var _={};
var _5;
_.initialize=function(){
if(window.Modernizr.audio.mp3=="probably"||window.Modernizr.audio.mp3=="maybe"){
_5=new Audio(_1);
}
};
_3.play=function(){
_.setVolume(_2.getVolumeSetting());
if(_5){
_5.play();
}
};
_.setVolume=function(_6){
if(0>_6){
_6=0;
}else{
if(10<_6){
_6=10;
}
}
if(_5){
_5.volume=_6/10;
}
};
_.initialize();
return _3;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.ChatOptionBox",false)){
dojo.provide("xg.components.chat.ChatOptionBox");
xg.components.chat.ChatOptionBox=function(_1,_2,_3){
var _4={};
var _={};
var _6=null;
var _7=[];
_.initialize=function(){
_6=x$("<div>             <div class=\"option xg_onlineOption\"><span class=\"checkmark\">&#x2713; </span><span class=\"label\">"+xg.shared.nls.html("CONNECTED_TO_CHAT")+"</span></div>         </div>");
x$(".xg_onlineOption",_6).click(function(_8){
var _9=x$(this);
_8.preventDefault();
_8.stopPropagation();
xg.shared.EventRegistry.fire("xg.components.chat.stopPropagation");
_1();
x$.each(_7,function(i,_b){
_b(_9);
});
});
};
_4.addClickHandler=function(_c){
_7.push(_c);
};
_4.getDiv=function(){
return _6[0];
};
_.initialize();
return _4;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.VolumeLock",false)){
dojo.provide("xg.components.chat.VolumeLock");
xg.components.chat.VolumeLock=function(_1){
var _2={};
var _={};
_.CHECK_INTERVAL=2000;
_.COOKIE_NAME="volumeSetting";
_.timestamp=null;
_.volumeSetting=_1;
_.initialize=function(){
_.check();
window.setInterval(_.check,_.CHECK_INTERVAL);
};
_.check=function(){
var _4=xg.shared.util.getCookie(_.COOKIE_NAME);
if(!_4){
return;
}
_.volumeSetting=_4;
};
_2.getVolumeSetting=function(){
return _.volumeSetting;
};
_2.setVolumeSetting=function(_5){
xg.post("/main/chat/update",{volume:_5});
xg.shared.util.setCookie(_.COOKIE_NAME,_5);
_.volumeSetting=_5;
};
_.initialize();
return _2;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.WibiyaHacks",false)){
dojo.provide("xg.components.chat.WibiyaHacks");
(xg.components.chat.WibiyaHacks=function(){
var _={};
var _2=10;
var _3=500;
var _4;
var _5=0;
_.initialize=function(){
if(!x$("script[src*=\"wibiya\"]").length){
return;
}
_4=window.setInterval(_.watchForToolbar,_3);
};
_.watchForToolbar=function(){
var _6=x$("#wibiyaToolbar");
if(_6.length){
if(x$(".xg_chat").data("connected")){
_.setUpSignedInHacks(_6);
}else{
_.setUpSignedOutHacks(_6);
}
window.clearInterval(_4);
return;
}
_5++;
if(_2<=_5){
window.clearInterval(_4);
}
};
_.setUpSignedOutHacks=function(_7){
if("off"===_7.attr("state")){
x$("#conversationViewContainer").addClass("xg_wibiyaMinimized");
}else{
x$("#conversationViewContainer").addClass("xg_wibiyaMaximized");
}
x$(".minMaxBtnDiv_maximize").bind("click",_.handleWibiyaSignedOut);
x$(".minMaxBtnDiv_minimize").bind("click",_.handleWibiyaSignedOut);
};
_.setUpSignedInHacks=function(_8){
x$(".minMaxBtnDiv_maximize").bind("click",_.handleWibiyaSignedIn);
x$(".minMaxBtnDiv_minimize").bind("click",_.handleWibiyaSignedIn);
if("off"===_8.attr("state")){
return;
}
x$(".chatFooter").addClass("with-wibiya-toolbar");
};
_.handleWibiyaSignedOut=function(){
x$("#conversationViewContainer").toggleClass("xg_wibiyaMinimized").toggleClass("xg_wibiyaMaximized");
};
_.handleWibiyaSignedIn=function(){
x$(".chatFooter").toggleClass("with-wibiya-toolbar");
};
xg.addOnRequire(_.initialize);
})();
}
if(!dojo.hostenv.findModule("xg.components.chat.states.ConnectingState",false)){
dojo.provide("xg.components.chat.states.ConnectingState");
xg.components.chat.states.ConnectingState=function(){
var _1={};
var _={};
_.initialize=function(){
};
_1.getName=function(){
return "Connecting";
};
_1.isOnline=function(){
return true;
};
_1.getConversationViewBarHtml=function(){
return xg.shared.nls.html("CONNECTING");
};
_1.getChatOptionBoxDiv=function(_3){
return null;
};
_1.areOpenChatPanesAllowed=function(){
return false;
};
_1.onClickConversationViewBar=function(_4){
};
_.initialize();
return _1;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.states.OnlineState",false)){
dojo.provide("xg.components.chat.states.OnlineState");
xg.components.chat.states.OnlineState=function(_1,_2){
var _3={};
var _={};
var _5=false;
_.initialize=function(){
};
_3.getName=function(){
return "Online";
};
_3.isOnline=function(){
return true;
};
_3.getConversationViewBarHtml=function(){
return "";
};
_3.getChatOptionBoxDiv=function(_6){
if(!_5){
_2.addClickHandler(function(_7){
if(_7.hasClass("xg_onlineOption")){
_6();
}
});
_5=true;
}
return _2.getDiv();
};
_3.areOpenChatPanesAllowed=function(){
return true;
};
_3.onClickConversationViewBar=function(_8){
_8.toggleExpanded();
};
_.initialize();
return _3;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.states.OfflineState",false)){
dojo.provide("xg.components.chat.states.OfflineState");
xg.components.chat.states.OfflineState=function(_1,_2){
var _3={};
var _={};
var _5;
_.initialize=function(){
_5=x$("<div class=\"xg_offline\">"+xg.shared.nls.html("YOU_ARE_DISCONNECTED","href=\"#\"")+"</div>");
_5.click(_.onClickPopupDiv);
_5.find("a").click(_.onClickPopupDiv);
};
_3.getName=function(){
return "Offline";
};
_.onClickPopupDiv=function(_6){
_6.preventDefault();
_6.stopPropagation();
xg.shared.EventRegistry.fire("xg.components.chat.stopPropagation");
_2();
_.hide();
};
_3.isOnline=function(){
return false;
};
_3.getConversationViewBarHtml=function(){
return xg.shared.nls.html("DISCONNECTED");
};
_3.getChatOptionBoxDiv=function(_7){
_.hide=_7;
return _5[0];
};
_3.areOpenChatPanesAllowed=function(){
return false;
};
_3.onClickConversationViewBar=function(_8){
_2();
};
_.initialize();
return _3;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.layouts.FooterLayout",false)){
dojo.provide("xg.components.chat.layouts.FooterLayout");
xg.components.chat.layouts.FooterLayout=function(_1,_2,_3){
var _4={};
var _={};
_4.initializeEarly=function(){
};
_4.initializeLate=function(){
_.fixPositionForIOS4();
xg.shared.EventRegistry.listen("xg.components.chat.models.Model.roomRemoved",_.updateChatIconUnreadCount);
xg.shared.EventRegistry.listen("xg.components.chat.models.Model.roomAdded",_.updateChatIconUnreadCount);
xg.shared.EventRegistry.listen("xg.components.chat.models.Room.unreadCountChanged",_.updateChatIconUnreadCount);
};
_.updateChatIconUnreadCount=function(){
if(_4.isSmallScreenFooterLayout()){
var _6=0;
x$.each(_2.getRooms(),function(i,_8){
_6+=_8.getUnreadCount();
});
if(_6>99){
_6="99+";
}
if(_6===0){
x$(".cht-chatListItem .ningbar-countNotification").hide();
}else{
x$(".cht-chatListItem .ningbar-countNotification").show().text(_6);
}
}
};
_.fixPositionForIOS4=function(){
if(!navigator.userAgent.match(/iPhone OS 4_|CPU OS 4_/)){
return;
}
$chatContainer=x$(".xg_chat");
var _9=function(){
var _a=false;
x$.each(_1.roomWindows,function(i,_c){
if(_c&&_c.isSelected()){
_a=true;
}
});
if(_a){
return;
}
$chatContainer.css("top",(window.pageYOffset+window.innerHeight)+"px");
};
x$(document).bind("scroll",_9);
_9();
};
_4.onLoginSuccess=function(){
if(_2.isConversationViewExpanded()){
_1.conversationView.expand();
}
};
_4.updateUserPreferences=function(_d){
xg.post("/main/chat/update",_d);
};
_4.getExpandedHeight=function(_e,_f,_10,_11){
var _12=Math.min(x$(window).height()-_2.PADDING,_2.MAX_HEIGHT);
var _13=50;
if(_10.length>0){
var _14=2;
var _15=_f.outerHeight(true)-_f.height()+_14;
var _16=_f.scrollTop()+_10.position().top+_10.outerHeight(true)-_f.position().top;
_13=Math.max(_16+_15,_13);
}
var _17=_13+_f.position().top;
if(_11.filter(":visible").length>0){
_17+=_11.outerHeight(true);
}
return Math.min(_12,_17);
};
_4.updateMessageListSize=function(_18,_19,_1a){
var _1b=_18.outerHeight(true)-_18.height();
var _1c=_18.position().top;
if(x$(".xg_chatInput:visible",_19).length>0){
_1c+=x$(".textarea-container",_19).outerHeight(true);
}
_18.height(_1a-_1b-_1c);
};
_4.updateUserListSize=function(_1d){
var _1e=_1d.closest(".xg_chatWindow").height();
var _1f=_1d.outerHeight(true)-_1d.height();
var _20=_1d.position().top;
_1d.height(_1e-_1f-_20);
};
_4.setWindowHeight=function(_21,_22){
_21.height(_22);
};
_4.initializeRoomWindowEarly=function(_23){
_23.getContainer().show();
x$(".xg_titleBar",_23.getContainer()).click(xg.preventDefault(function(){
if(_23.getRoom().isDirectMessage()){
_4.minimizeRoomWindow(_23);
}else{
if(_23.isShowingUserPanel()){
_23.hideUserPanel();
}else{
_23.showUserPanel();
}
}
}));
_23.bottomBar=x$(".xg_bottomBar",_23.getContainer());
_23.bottomBarInfo=_23.bottomBar.find(".cht-roomNameContainer");
_23.bottomBar.click(xg.preventDefault(function(){
_23.open();
_23.focus();
}));
x$(".xj_close",_23.getContainer()).click(function(_24){
_24.preventDefault();
_1.closeRoomWindow(_23.getId(),true);
});
x$(".xg_expand",_23.getContainer()).click(function(_25){
_25.preventDefault();
_25.stopPropagation();
xg.shared.EventRegistry.fire("xg.components.chat.stopPropagation");
_4.minimizeRoomWindow(_23);
});
};
_4.beforeOpeningRoomWindow=function(_26){
};
_4.afterOpeningRoomWindow=function(_27){
_27.bottomBar.hide();
};
_4.minimizeRoomWindow=function(_28){
_28.setOpen(false);
x$(".xg_chatWindow",_28.getContainer()).hide();
_28.bottomBar.show();
_28.updateLabel();
_1.saveRoomWindowStates();
};
_4.getLabel=function(_29){
return _29.bottomBarInfo||x$();
};
_4.getMaxLabelWidth=function(){
return 190;
};
_4.initializeConversationView=function(_2a){
};
_4.updateConversationViewSize=function(_2b,_2c,_2d,_2e){
var _2f=_2d.outerHeight()-_2d.height();
var _30=_2b.position().top;
var _31=x$(".xg_bottomBar",_2c).outerHeight(true);
var _32=120+_30+_31;
var _33=x$(window).height()-_2.PADDING;
var _34;
if(_2e){
_34=_2e;
}else{
var _35=0;
var _36=_2b.children().last();
if(_36.length>0){
_35=_36.outerHeight(true)*4;
var _37=_2b.outerHeight(true)-_2b.height();
var _38=_2b.scrollTop()+_36.position().top+_36.outerHeight(true)-_2b.position().top;
_35=Math.max(_38+_37,_35);
}
_34=_35+_30+_31;
_34=Math.min(_2.MAX_HEIGHT,_34);
}
var _39=Math.max(_32,Math.min(_33,_34));
_2d.height(_39);
_2b.height(_39+_2f-_30-_31);
};
_4.getLocalStorageNameForRoomWindowStates=function(){
return _2.LOCAL_STORAGE_NAME_FOR_ROOM_WINDOW_STATES_FOR_FOOTER_AND_MODULE_CHAT;
};
_4.isRoomWindowSelected=function(_3a){
return x$(".xg_chatInput:focus",_3a.getContainer()).length>0;
};
_4.closeRoomWindowIfTooMany=function(){
var _3b=_1.getRoomWindowsSortedByActivity();
if(_3b.length<=1){
return;
}
var _3c=_3b[_3b.length-1];
var _3d=false;
for(var i=0;i<_3b.length;i++){
var _3f=_3b[i];
if(x$("#conversationViewContainer").offset().left<=_3c.getContainer().offset().left){
_1.closeRoomWindow(_3f.getId(),false);
_3d=true;
}else{
break;
}
}
if(_3d){
_1.saveRoomWindowStates();
}
};
_4.signOutDetected=function(_40){
_2.setState(_40);
};
_4.isSmallScreenFooterLayout=function(){
return x$(window).width()<=500||x$(window).height()<=420;
};
_4.isSmallScreenWindowLayout=function(){
return false;
};
_4.canMinimizeConversationView=function(){
return true;
};
return _4;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.layouts.WindowLayout",false)){
dojo.provide("xg.components.chat.layouts.WindowLayout");
xg.components.chat.layouts.WindowLayout=function(_1,_2,_3){
var _4={};
var _={};
_.currentRoomWindow=null;
_.maxPopUpRoomWindowCount;
_.dialogDisplayed=false;
_4.initializeEarly=function(){
_.maxPopUpRoomWindowCount=x$(".xg_chat").data("maxPopUpRoomWindowCount");
xg.shared.EventRegistry.listen("xg.components.chat.models.Room.sampleUsersChanged",function(_6){
if(_.currentRoomWindow&&_.currentRoomWindow.getId()==_6.getId()){
_.updateHeading();
}
});
xg.shared.EventRegistry.listen("xg.components.chat.models.Room.iconUrlChanged",function(_7){
if(_.currentRoomWindow&&_.currentRoomWindow.getId()==_7.getId()){
_.updateHeading();
}
});
xg.shared.EventRegistry.listen("xg.components.chat.models.Room.nameChanged",function(_8){
if(_.currentRoomWindow&&_.currentRoomWindow.getId()==_8.getId()){
_.updateHeading();
}
});
x$(".xg_chat").on("click",".cht-backFromRoom",function(_9){
_9.preventDefault();
_9.stopPropagation();
xg.shared.EventRegistry.fire("xg.components.chat.stopPropagation");
x$(".xg_chat .xg_chatRoom").hide();
x$.each(_1.roomWindows,function(i,_b){
_b.setOpen(false);
});
x$("#conversationViewContainer").show();
});
x$(".cht-backFromMobileChat").click(function(){
event.preventDefault();
window.history.go(-1);
});
x$(".cht-menuIconContainer").click(function(){
event.preventDefault();
x$(".cht-mobileMenu").toggle();
});
xg.shared.EventRegistry.listen("xg.components.chat.stopPropagation",function(){
x$(".cht-mobileMenu").hide();
});
_.initializeDisconnectedDialog();
xg.shared.EventRegistry.listen("xg.components.chat.Controller.roomWindowClosed",function(){
if(!_.areAnyRoomWindowsOpen()){
x$("#conversationViewContainer").show();
}
});
};
_.areAnyRoomWindowsOpen=function(){
var _c=false;
x$.each(_1.roomWindows,function(i,_e){
if(_e.isOpen()){
_c=true;
return false;
}
});
return _c;
};
_4.initializeLate=function(){
_1.conversationView.showAllGroups();
xg.shared.EventRegistry.listen("xg.components.chat.models.Model.roomRemoved",_.updateChatIconUnreadCount);
xg.shared.EventRegistry.listen("xg.components.chat.models.Model.roomAdded",_.updateChatIconUnreadCount);
xg.shared.EventRegistry.listen("xg.components.chat.models.Room.unreadCountChanged",_.updateChatIconUnreadCount);
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_LIST",_.updateChatIconUnreadCount);
xg.shared.EventRegistry.listen("xg.components.chat.layouts.WindowLayout.updateChatIconUnreadCount",_.updateChatIconUnreadCount);
};
_.updateChatIconUnreadCount=function(){
if(_2.isMobileChat){
var _f=0;
x$.each(_2.getRooms(),function(i,_11){
_f+=_11.getUnreadCount();
});
if(_f>99){
_f="99+";
}
if(_f===0){
x$(".cht-countNotification").hide();
}else{
x$(".cht-countNotification").show().text(_f);
}
}
};
_.initializeDisconnectedDialog=function(){
var _12=false;
var _13=false;
xg.shared.EventRegistry.listen("xg.components.chat.models.Model.stateChanged",function(){
if(_2.getState().isOnline()&&_12){
x$("#disconnected-dialog, .xg_chat .xg_overlay").hide();
_.dialogDisplayed=_12=false;
_13=false;
}else{
if(!_2.getState().isOnline()&&!_.dialogDisplayed){
x$("#disconnected-dialog, .xg_chat .xg_overlay").show();
_.dialogDisplayed=_12=true;
_13=false;
}
}
});
x$("#disconnected-dialog input[type=button]").click(function(){
if(_13){
return;
}
_1.toggleOnlineStatus();
_13=true;
});
};
_.updateHeading=function(){
if(!_.currentRoomWindow){
return;
}
var _14=_.currentRoomWindow.getRoom();
var _15=x$(".xg_messageListHeading",_.currentRoomWindow.getContainer());
_15.toggleClass("cht-groupChatHeading",!_14.isDirectMessage());
var i,_17,_18;
_18=_.currentRoomWindow.getName();
_15.find(".cht-roomName").text(_18);
_15.find(".cht-avatarContainer").html(xg.components.chat.HTMLBuilder.get().roomAvatar(_14,false));
};
_4.onLoginSuccess=function(){
_1.conversationView.expand();
};
_4.updateUserPreferences=function(_19){
delete _19.conversationViewExpanded;
xg.post("/main/chat/update",_19);
};
_4.getExpandedHeight=function(_1a,_1b,_1c,_1d){
return _1a.getContainer().height();
};
_4.updateMessageListSize=function(_1e,_1f,_20){
var _21=_1f.height(),_22=_1f.find(".xg_messageListFooter"),_23=_1f.find(".xg_messageListHeading"),_24=_22.position().top,_25=_1e[0].scrollHeight;
_1e.css("bottom",(_21-_24)+"px");
_1e.toggleClass("cht-sparse",_25<_21-_23.height()-_22.height());
};
_4.updateUserListSize=function(_26){
};
_4.setWindowHeight=function(_27,_28){
};
_4.initializeRoomWindowEarly=function(_29){
x$(".xg_messageListHeading",_29.getContainer()).click(function(_2a){
_2a.preventDefault();
if(x$(_2a.target).hasClass("cht-backFromRoom")){
return;
}
if(_29.getRoom().isDirectMessage()){
}else{
if(_29.isShowingUserPanel()){
_29.hideUserPanel();
}else{
_29.showUserPanel();
}
}
});
};
_4.beforeOpeningRoomWindow=function(_2b){
x$(".xg_chat .xg_chatRoom").hide();
x$.each(_1.roomWindows,function(i,_2d){
_2d.setOpen(false);
});
if(_4.isSmallScreenWindowLayout()){
x$("#conversationViewContainer").hide();
}
};
_4.afterOpeningRoomWindow=function(_2e){
_.currentRoomWindow=_2e;
_.updateHeading();
_.currentRoomWindow.updateForwardAndBackSymbols();
_2e.updateLabel();
};
_4.minimizeRoomWindow=function(_2f){
};
_4.getLabel=function(_30){
return _30.tabLabel||x$();
};
_4.getMaxLabelWidth=function(){
return 120;
};
_4.initializeConversationView=function(_31){
};
_4.updateConversationViewSize=function(_32,_33,_34){
};
_4.getLocalStorageNameForRoomWindowStates=function(){
if(_2.isMobileChat){
return _2.LOCAL_STORAGE_NAME_FOR_ROOM_WINDOW_STATES_FOR_MOBILE_CHAT;
}
return _2.LOCAL_STORAGE_NAME_FOR_ROOM_WINDOW_STATES_FOR_FOOTER_AND_MODULE_CHAT;
};
_4.isRoomWindowSelected=function(_35){
return _35===_.currentRoomWindow;
};
_4.closeRoomWindowIfTooMany=function(){
var _36=_1.getRoomWindowsSortedByActivity();
var _37=_36.length-_.maxPopUpRoomWindowCount;
for(var i=0;i<_37;i++){
var _39=_36[i];
_1.closeRoomWindow(_39.getId(),false);
}
if(_37>0){
_1.saveRoomWindowStates();
}
};
_4.signOutDetected=function(_3a){
window.location.href="/main/authorization/signUp?target=/chat";
};
_4.isSmallScreenFooterLayout=function(){
return false;
};
_4.isSmallScreenWindowLayout=function(){
return x$(window).width()<=500||x$(window).height()<=420||_2.isMobileChat;
};
_4.canMinimizeConversationView=function(){
return false;
};
return _4;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.server.ChatServer",false)){
dojo.provide("xg.components.chat.server.ChatServer");
xg.components.chat.server.ChatServer=function(_1,_2){
var _3={};
var _={};
_.initialize=function(){
_1.setListener(function(_5){
if(_5.msgType=="ROOM_LEAVE"&&_5.body.user){
_5.body.userId=_5.body.user.ningId;
}
xg.shared.EventRegistry.fire("xg.components.chat.server.ChatServer."+_5.msgType,_5.body);
});
};
_3.seen=function(_6){
_1.push({"msgType":"MESSAGE_SEEN","body":{"roomId":_6.targetRoomId,"messageId":_6.id}});
};
_3.getRoomHistory=function(_7,_8,_9,_a){
var _b=function(_c){
if(_7==_c.roomId&&_8==_c.count&&_9==_c.beforeId){
xg.shared.EventRegistry.unlisten("xg.components.chat.server.ChatServer.HISTORY",_b);
_a(x$.map(_c.messages,function(_d){
return xg.components.chat.server.Formatter.toMessage(_d,_2);
}));
}
};
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.HISTORY",_b);
_1.push({"msgType":"HISTORY","body":{"beforeId":_9,"count":_8,"roomId":_7}});
};
_3.getRoomUsers=function(_e,_f,_10,_11){
var _12=function(_13){
if(_e==_13.roomId&&_f==_13.count&&_10==_13.start){
xg.shared.EventRegistry.unlisten("xg.components.chat.server.ChatServer.ROOM_LIST_USERS",_12);
_11(x$.map(_13.users,function(_14){
return xg.components.chat.server.Formatter.toUser(_14,_2);
}));
}
};
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_LIST_USERS",_12);
_1.push({"msgType":"ROOM_LIST_USERS","body":{"start":_10,"count":_f,"roomId":_e}});
};
_3.publish=function(_15,_16){
_1.push({"msgType":"MESSAGE_ADD","body":{"sender":xg.components.chat.server.Formatter.fromUser(_2.user),"body":_15,"roomId":_16}});
};
_3.sendFile=function(_17,_18){
_1.push({"msgType":"MESSAGE_ADD","body":{"sender":xg.components.chat.server.Formatter.fromUser(_2.user),"file":_17,"roomId":_18}});
};
_3.logIntoChat=function(_19,_1a){
_1.logIntoChat(function(){
_19();
_1.push({"msgType":"ROOM_LIST"});
},_1a);
};
_3.addDirectMessageRoom=function(_1b){
_1.post("/main/chat/createDirectMessageRoom",{xg_token:xg.token,screenName:_1b});
};
_3.updateRoom=function(_1c,_1d,_1e){
if(_1c.getType()=="PRIVATE"){
_1.push({"msgType":"ROOM_CHANGE","body":{"roomId":_1c.getId(),"name":_1d||null,"iconUrl":_1e}});
}else{
if(_1c.getType()=="MAIN"||_1c.getType()=="PUBLIC"){
_1.post("/main/chat/updatePublicRoom",{xg_token:xg.token,roomId:_1c.getId(),name:_1d,avatarUrl:_1e});
}
}
};
_3.addUserToRoom=function(_1f,_20){
if(_2.userIsAdmin){
if(_20.getType()==="PUBLIC"||_20.getType()==="MAIN"){
_1.post("/main/chat/unban",{xg_token:xg.token,screenName:_1f.getId(),roomId:_20.getId()});
}
}
_1.push({"msgType":"ROOM_ADD_USER","body":{"user":xg.components.chat.server.Formatter.fromUser(_1f),"roomId":_20.getId()}});
};
_3.joinRoom=function(_21){
_1.push({"msgType":"ROOM_JOIN","body":{"roomId":_21.getId()}});
};
_3.deleteMessage=function(_22,_23){
_1.push({"msgType":"MESSAGE_DELETE","body":{"messageId":_22,"roomId":_23}});
};
_3.deleteConversation=function(_24){
_1.push({"msgType":"HISTORY_REMOVE","body":{"roomId":_24.getId()}});
_1.push({"msgType":"ROOM_HIDE","body":{"roomId":_24.getId()}});
if(_24.isLeavable()){
_1.push({"msgType":"ROOM_LEAVE","body":{"roomId":_24.getId()}});
}
};
_3.unhideRoom=function(_25){
_1.push({"msgType":"ROOM_UNHIDE","body":{"roomId":_25.getId()}});
};
_3.banUser=function(_26,_27){
if(_27.getType()==="PRIVATE"){
_1.push({"msgType":"ROOM_BAN_USER","body":{"roomId":_27.getId(),"userId":_26}});
}else{
_1.post("/main/chat/ban",{xg_token:xg.token,screenName:_26,roomId:_27.getId()});
}
};
_3.blockUser=function(_28){
_1.push({"msgType":"USER_BLOCK","body":{"userId":_28.getId()}});
};
_3.unblockUser=function(_29){
_1.push({"msgType":"USER_UNBLOCK","body":{"userId":_29.getId()}});
};
_3.startedTypingIn=function(_2a){
_1.push({"msgType":"ROOM_START_TYPING","body":{"roomId":_2a.getId()}});
};
_3.stoppedTypingIn=function(_2b){
_1.push({"msgType":"ROOM_STOP_TYPING","body":{"roomId":_2b.getId()}});
};
_3.leaveRoom=function(_2c){
_1.push({"msgType":"ROOM_LEAVE","body":{"roomId":_2c.getId()}});
};
_3.disconnect=function(){
_1.disconnect();
};
_.initialize();
return _3;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.server.DummyApi",false)){
dojo.provide("xg.components.chat.server.DummyApi");
xg.components.chat.server.DummyApi=function(_1){
var _2={};
var _={};
_.roomIdsWithHistoryRemoved={};
_.currentUserData={"ningId":_1.user.getId(),"name":_1.user.getName(),"iconUrl":_1.user.getAvatarUrl(),"blockedByCurrentUser":false,"online":true};
_.testUsers={"aaa111":{"ningId":"aaa111","name":"Test User 1","iconUrl":"http://api.xna.ningops.net/files/jur8w0-dppy8il1vnH6B9FtlDP6-e0sbnoKSKGzQgwCfoIAGD8gZuO*QJvw*Eog54QQ1HMrQ2AmuOCOGpnsHTg__/images.jpg?width=80&height=80&crop=1%3A1","blockedByCurrentUser":false,"online":Math.random()>0.5},"bbb222":{"ningId":"bbb222","name":"Test User 2","iconUrl":"http://api.xna.ningops.net/files/zxwXxTDf*m64U5cIsYNZt5jZ5NUebNLwm2PYIBbeZkLT-TPZ5Z*dsyEU0XBNSqevnyHo6jV0MFxeqSgf*lDulg__/4549249.jpeg?width=80&height=80&crop=1%3A1","blockedByCurrentUser":false,"online":Math.random()>0.5},"ccc333":{"ningId":"ccc333","name":"Test User 3","iconUrl":"http://api.xna.ningops.net/files/jur8w0-dppy8il1vnH6B9FtlDP6-e0sbnoKSKGzQgwCfoIAGD8gZuO*QJvw*Eog54QQ1HMrQ2AmuOCOGpnsHTg__/images.jpg?width=80&height=80&crop=1%3A1","blockedByCurrentUser":false,"online":Math.random()>0.5},"ddd444":{"ningId":"ddd444","name":"Test User 4","iconUrl":"http://api.xna.ningops.net/files/kkbosKXpiJHmZK-rl8LhxhtFycpAhg2xFdF9s6wssmQdKzXiWmnCbSQsW1D6n5F1i7rhfRutBJ0UrhY0Tgn0nA__/GrayBoat.jpg?width=80&height=80&crop=1%3A1","blockedByCurrentUser":false,"online":Math.random()>0.5},"eee555":{"ningId":"eee555","name":"Test User 5","iconUrl":"http://api.xna.ningops.net/files/yad6p5rHESeESmQTyNGj3TFMeb2swey88GzyVprjhWcRqz8jYN8DUJp9OSWRcTou-aFgbmJDQgIq62O-eCNPGA__/2129_watermelon.jpg?width=80&height=80&crop=1%3A1","blockedByCurrentUser":false,"online":Math.random()>0.5}};
_.rooms={11111:{"name":null,"roomId":11111,"iconUrl":null,"users":[_.currentUserData,_.testUsers["aaa111"],_.testUsers["bbb222"]],"type":"MAIN","unreadCount":0,"currentUserInRoom":true,"groupCreator":_1.user.getId()},22222:{"name":null,"roomId":22222,"iconUrl":null,"users":[_.currentUserData,_.testUsers["aaa111"]],"type":"PRIVATE","unreadCount":0,"currentUserInRoom":true,"groupCreator":null},33333:{"name":null,"roomId":33333,"iconUrl":null,"users":[_.currentUserData,_.testUsers["bbb222"]],"type":"PRIVATE","unreadCount":0,"currentUserInRoom":true,"groupCreator":null},44444:{"name":"Bear Lovers","roomId":44444,"iconUrl":"http://api.xna.ningops.net/files/b6PoTHFVEiG99vBzgjI38-1qGvnyllOmrbLQ6Ty52QYm*9ZeIm*wUfCR1NthbsvdataicuH-45ECs-Pcyj9CNw__/8.jpg?width=80&height=80&crop=1%3A1","users":[_.currentUserData,_.testUsers["ddd444"],_.testUsers["ccc333"]],"type":"PRIVATE","unreadCount":0,"currentUserInRoom":true,"groupCreator":_1.user.getId()},55555:{"name":null,"roomId":55555,"iconUrl":null,"users":[_.currentUserData,_.testUsers["eee555"],_.testUsers["ddd444"],_.testUsers["ccc333"]],"type":"PRIVATE","unreadCount":0,"currentUserInRoom":true,"groupCreator":_1.user.getId()},66666:{"name":null,"roomId":66666,"iconUrl":null,"users":[_.currentUserData,_.testUsers["ccc333"],_.testUsers["bbb222"]],"type":"PRIVATE","unreadCount":0,"currentUserInRoom":true,"groupCreator":_1.user.getId()},77777:{"name":null,"roomId":77777,"iconUrl":null,"users":[_.currentUserData,_.testUsers["aaa111"],_.testUsers["ccc333"],_.testUsers["eee555"]],"type":"PRIVATE","unreadCount":0,"currentUserInRoom":true,"groupCreator":_1.user.getId()}};
_.responses=["Does that trouble you?","Tell me more about such feelings.","Have you tried?","We were discussing you, not me.","You're not really talking about me, are you?","Why do you ask?","Does that question interest you?","What answer would please you the most?","What do you think?","Are such questions on your mind often?","What is it that you really want to know?","Have you asked anyone else?","Have you asked such questions before?","What else comes to mind when you ask that?","Names don't interest me.","I don't care about names, please go on.","Is that the real reason?","Don't any other reasons come to mind?","Does that reason explain anything else?","What other reasons might there be?","Please don't apologise!","Apologies are not necessary.","What feelings do you have when you apologise?","Don't be so defensive!","What does that dream suggest to you?","Do you dream often?","What persons appear in your dreams?","Are you disturbed by your dreams?","How are you today.. What would you like to discuss?","You don't seem quite certain.","Why the uncertain tone?","Can't you be more positive?","You aren't sure?","Don't you know?","Are you saying no just to be negative?","You are being a bit negative.","Why not?","Are you sure?","Why no?","Can you think of a specific example?","When?","What are you thinking of?","Really, always?","Do you really think so?","In what way?","What resemblence do you see?","What does the similarity suggest to you?","What other connections do you see?","Could there really be some connection?","How?","You seem quite positive.","Are you Sure?","I see.","I understand.","Why do you bring up the topic of friends?","Do your friends worry you?","Do your friends pick on you?","Are you sure you have any friends?","Do you impose on your friends?","Perhaps your love for friends worries you.","Do computers worry you?","Are you talking about me in particular?","Are you frightened by machines?","Why do you mention computers?","What do you think machines have to do with your problems?","Don't you think computers can help people?","What is it about machines that worries you?","Say, do you have any psychological problems?","What does that suggest to you?","I see.","I'm not sure I understand you fully.","Come, come, elucidate your thoughts.","Can you elaborate on that?","That is quite interesting.","Why did you repeat yourself?","Do you expect a different answer by repeating yourself?","Come, come, elucidate your thoughts."];
_.connected=false;
_.listener=function(){
};
_.initialize=function(){
setInterval(function(){
if(!_.connected){
return;
}
if(!_1.getRoom(33333)){
return;
}
_.listener(_.createResponseMessage(33333));
},10000);
setInterval(function(){
if(!_.connected){
return;
}
if(!_1.getRoom(44444)){
return;
}
_.listener(_.createResponseMessage(44444));
},11000);
xg.components.chat.server.DummyApi.testing={"_":_,"self":_2};
};
_2.setListener=function(_4){
_.listener=function(_5){
xg.shared.util.consoleLog("Response: "+JSON.stringify(_5));
_4(_5);
};
};
_.createResponseMessage=function(_6){
var _7=_.responses[Math.floor(Math.random()*_.responses.length)];
var _8=_1.getRoom(_6).getOtherSampleUsers();
var _9=_8[Math.floor(Math.random()*_8.length)];
if(_9.isBlockedByCurrentUser()){
return {};
}
return {"msgType":"MESSAGE_ADD","body":{"messageId":_.random(0,9999999),"sender":_.toServerUser(_9),"body":_7,"roomId":_6,"seen":false,"createDate":Date.now(),"modifiedDate":null,"seen":_6==11111}};
};
_.toServerUser=function(_a){
return {ningId:_a.getId(),name:_a.getName(),iconUrl:_a.getAvatarUrl(),online:_a.isOnline()};
};
_.random=function(_b,_c){
return Math.floor(Math.random()*(_c-_b+1))+_b;
};
_2.push=function(_d){
xg.shared.util.consoleLog("Push: "+JSON.stringify(_d));
if(_d.msgType=="HISTORY"){
_d.body.messages=[];
if(!_.roomIdsWithHistoryRemoved[_d.body.roomId]){
var n=Math.random()<0.7?_d.body.count:_d.body.count-1;
for(var i=0;i<n;i++){
var _10=_.createResponseMessage(_d.body.roomId);
if(_10.msgType){
_d.body.messages.push(_10.body);
}
}
}
setTimeout(function(){
_.listener(_d);
},2000);
return;
}
if(_d.msgType=="ROOM_ADD_USER"){
_d.body.room=_.rooms[_d.body.roomId];
_d.body.room.groupCreator=_1.user.getId();
_.listener(_d);
return;
}
if(_d.msgType=="ROOM_JOIN"){
_d.body.room=_.rooms[_d.body.roomId];
_d.body.user=_.currentUserData;
_.listener(_d);
return;
}
if(_d.msgType=="ROOM_START_TYPING"){
_d.body.user=_.currentUserData;
_.listener(_d);
return;
}
if(_d.msgType=="ROOM_STOP_TYPING"){
_d.body.user=_.currentUserData;
_.listener(_d);
return;
}
if(_d.msgType=="ROOM_LIST_USERS"){
_d.body.users=[];
if(_d.body.start===0){
x$.each(_1.getRoom(_d.body.roomId).getSampleUsers(),function(i,_12){
_d.body.users.push(xg.components.chat.server.Formatter.fromUser(_12));
});
}
var n=Math.random()<0.7?_d.body.count-_d.body.users.length:_d.body.count-_d.body.users.length-1;
for(var i=0;i<n;i++){
var _13=_.random(0,9999999);
_d.body.users.push({"ningId":_13,"name":"User "+_13,"iconUrl":_1.defaultAvatarUrl,"blockedByCurrentUser":false,"online":Math.random()>0.5});
}
setTimeout(function(){
_.listener(_d);
},2000);
return;
}
if(_d.msgType=="ROOM_CHANGE"){
_.listener(_d);
return;
}
if(_d.msgType=="USER_BLOCK"){
_.listener(_d);
return;
}
if(_d.msgType=="USER_UNBLOCK"){
_.listener(_d);
return;
}
if(_d.msgType=="MESSAGE_DELETE"){
_.listener(_d);
return;
}
if(_d.msgType=="ROOM_HIDE"){
_.rooms[_d.body.roomId].hiddenFromCurrentUser=true;
_.listener(_d);
return;
}
if(_d.msgType=="ROOM_UNHIDE"){
_.rooms[_d.body.roomId].hiddenFromCurrentUser=false;
_.listener(_d);
return;
}
if(_d.msgType=="HISTORY_REMOVE"){
_.roomIdsWithHistoryRemoved[_d.body.roomId]=true;
_.listener(_d);
return;
}
if(_d.msgType=="ROOM_LEAVE"){
_d.body.user=_.currentUserData;
_d.body.room=_.rooms[_d.body.roomId];
var _14=[];
x$.each(_1.getRoom(_d.body.roomId).getSampleUsers(),function(i,_16){
if(_16.getId()!==_d.body.userId){
_14.push(xg.components.chat.server.Formatter.fromUser(_16));
}
});
_d.body.room.users=_14;
_.listener(_d);
return;
}
if(_d.msgType=="ROOM_BAN_USER"){
_d.body.room=_.rooms[_d.body.roomId];
var _14=[];
x$.each(_1.getRoom(_d.body.roomId).getSampleUsers(),function(i,_18){
if(_18.getId()!==_d.body.userId){
_14.push(xg.components.chat.server.Formatter.fromUser(_18));
}
});
_d.body.room.users=_14;
_.listener(_d);
return;
}
if(_d.msgType=="MESSAGE_ADD"){
_d.body.messageId=_.random(0,9999999);
_d.body.seen=false;
_d.body.createDate=Date.now();
_d.body.modifiedDate=null;
_.listener(_d);
(function(){
var _19=_.createResponseMessage(_d.body.roomId);
_.listener({"msgType":"ROOM_START_TYPING","body":{"roomId":_d.body.roomId,"user":_19.body.sender}});
setTimeout(function(){
_.listener(_19);
_.listener({"msgType":"MESSAGE_SEEN","body":{"roomId":_d.body.roomId,"messageId":_d.body.messageId}});
_.listener({"msgType":"ROOM_STOP_TYPING","body":{"roomId":_d.body.roomId,"user":_19.body.sender}});
},3000);
})();
(function(){
var _1a=_.createResponseMessage(_d.body.roomId);
_.listener({"msgType":"ROOM_START_TYPING","body":{"roomId":_d.body.roomId,"user":_1a.body.sender}});
setTimeout(function(){
_.listener(_1a);
_.listener({"msgType":"MESSAGE_SEEN","body":{"roomId":_d.body.roomId,"messageId":_d.body.messageId}});
_.listener({"msgType":"ROOM_STOP_TYPING","body":{"roomId":_d.body.roomId,"user":_1a.body.sender}});
},3000);
})();
}
if(_d.msgType=="ROOM_LIST"){
var _d={"msgType":"ROOM_LIST","body":{"rooms":[_.rooms["11111"],_.rooms["22222"],_.rooms["33333"],_.rooms["44444"],_.rooms["55555"],_.rooms["66666"],_.rooms["77777"]]}};
_.listener(_d);
}
};
_2.logIntoChat=function(_1b,_1c){
_1b();
_.connected=true;
};
_2.post=function(url,_1e,_1f){
_1f=_1f||function(){
};
x$.post(xg.shared.util.addParameter(url,"chatDummyApi","1"),_1e,function(_20){
if(url==="/main/chat/createDirectMessageRoom"){
x$.get("/main/chat/testUserData",{screenName:_1e.screenName},function(_21){
var _22={"name":null,"roomId":_20.room.roomId,"iconUrl":null,"users":[_.currentUserData,_21.user],"type":"PRIVATE","unreadCount":0,"currentUserInRoom":true};
_.rooms[_22.roomId]=_22;
_.listener({"msgType":"ROOM_ADD","body":_22});
});
}
if(url==="/main/chat/updatePublicRoom"){
var _23=_20.room;
_.listener({"msgType":"ROOM_CHANGE","body":{"roomId":_1e.roomId,"name":_1e.name,"iconUrl":_1e.avatarUrl}});
}
if(url==="/main/chat/ban"){
_.listener({"msgType":"ROOM_BAN_USER","body":{"userId":_1e.screenName,"room":_.rooms[_1e.roomId]}});
}
_1f(_20);
});
};
_2.disconnect=function(){
_.connected=false;
};
_.initialize();
return _2;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.server.ChatterboxApi",false)){
dojo.provide("xg.components.chat.server.ChatterboxApi");
xg.components.chat.server.ChatterboxApi=function(){
var _1={};
var _={};
_.TOKEN_MAX_AGE=600000;
_.listener=function(){
};
_.logging=false;
_.subsocket;
_.request;
_.onConnectionSuccess;
_.onConnectionFailure;
_.loginUrl;
_1.push=function(_3){
_.log("Push: "+atmosphere.util.stringifyJSON(_3));
_.subsocket.push(atmosphere.util.stringifyJSON(_3));
};
_1.post=function(_4,_5,_6){
_6=_6||function(){
};
x$.post(_4,_5,function(_7){
_6(_7);
});
};
_1.disconnect=function(){
atmosphere.unsubscribe();
};
_1.logIntoChat=function(_8,_9){
_.onConnectionSuccess=function(){
_.onConnectionSuccess=_.onConnectionFailure=function(){
};
if(_8){
_8();
}
};
_.onConnectionFailure=function(){
_.onConnectionSuccess=_.onConnectionFailure=function(){
};
if(_9){
_9();
}
};
_.log("Connecting to Atmosphere using "+x$(".xg_chat").data("loginUrl"));
_.subsocket=atmosphere.subscribe(_.request);
};
_.initialize=function(){
var _a="";
atmosphere.util.getAbsoluteURL=function(_b){
return _b;
};
_.logging=window.location.href.indexOf("chatLogging=1")>-1||window.location.href.indexOf(".xna.ningops.net")>-1;
_.loginUrl=x$(".xg_chat").data("loginUrl");
_.request={url:_.loginUrl,contentType:"application/json",trackMessageLength:true,transport:"websocket",fallbackTransport:"long-polling",reconnectInterval:10000,timeout:365*86400*1000,maxReconnectOnClose:999999999,onOpen:function(_c){
_a=_c.transport;
_.log("Atmosphere connection opened using "+_c.transport);
_.onConnectionSuccess();
},onClose:function(_d){
_.log("Atmosphere connection closed");
},onReconnect:function(_e,_f){
_e.url=_.loginUrl;
_.log("Atmosphere reconnecting");
},onError:function(_10){
_.log("An Atmosphere error occurred");
},onTransportFailure:function(_11,_12){
_.log("Atmosphere transport error: "+_11);
},onClientTimeout:function(_13){
_.log("Atmosphere client timeout");
},onMessage:function(_14){
var _15=_14.responseBody;
_.log("Response ("+_a+"): "+_15);
try{
var _16=JSON.parse(_15);
}
catch(e){
_.log("Could not parse response JSON.");
return;
}
_.listener(_16);
}};
_.getNewLoginUrlAfterDelay();
};
_.getNewLoginUrlAfterDelay=function(){
setTimeout(function(){
x$.get("/main/chat/loginUrl",function(_17){
if(_17.success){
_.loginUrl=_17.loginUrl;
}else{
_.log("Could not get a new login url");
}
});
_.getNewLoginUrlAfterDelay();
},_.TOKEN_MAX_AGE-60000);
};
_.log=function(_18){
if(_.logging){
xg.shared.util.consoleLog(_18);
}
};
_1.setListener=function(_19){
_.listener=_19;
};
_.initialize();
return _1;
};
}
if(!dojo.hostenv.findModule("xg.components.chat.Controller",false)){
dojo.provide("xg.components.chat.Controller");
xg.components.chat.Controller=function(){
var _1={};
var _={};
_.flasher;
_.localStorage;
_.otherSound;
_.model;
_.updateRoomsTimerId=-1;
_.chatOptionBox;
_.CONNECTING_STATE;
_.ONLINE_STATE;
_.OFFLINE_STATE;
var _3=40;
var _4=5000;
var _5;
_1.conversationView;
_1.roomWindows;
_.roomWindowStateSavingEnabled=true;
_.soundLock;
_.volumeLock;
_1.initialize=function(){
if(window.location.href.indexOf("viewSource=1")>-1){
x$("<textarea style=\"position:absolute;z-index:999;width:300px;height:300px;\">").prependTo("body").text(x$("html").html());
}
if(x$(".xg_widget_main_index_disabled").length){
return;
}
_.soundLock=xg.components.chat.SoundLock();
_.localStorage=xg.components.chat.LocalStorage(ning.CurrentProfile?ning.CurrentProfile.id:"");
var _6=x$(".xg_chatOptions",_5);
_.setupVolumeControl(_6.data("soundEnabledByDefault")=="1");
_5=x$(".xg_chat");
_.model=xg.components.chat.models.Model(_.localStorage,!!_5.data("connected"),!!_5.data("conversationViewExpanded"));
_.model.layout=x$(".chatFooter").length?xg.components.chat.layouts.FooterLayout(_1,_.model,_.localStorage):xg.components.chat.layouts.WindowLayout(_1,_.model,_.localStorage);
_.model.layout.initializeEarly();
_.model.isMobileChat=x$(".mobileChat").length>0;
if(_.model.layout.isSmallScreenWindowLayout()&&!_.model.isMobileChat){
window.location.href="/main/chat/mobileChat";
return;
}
var _7=x$(".module_chat_v4");
if(_7.length>0){
_.addBordersIfNeeded(_7);
}
if(_.model.layout.isSmallScreenWindowLayout()||_.model.layout.isSmallScreenFooterLayout()){
_.flasher=null;
}else{
_.flasher=new xg.components.chat.Flasher();
}
_.model.user=_.model.getOrCreateUser(ning.CurrentProfile?ning.CurrentProfile.id:"",_5.data("userName"),_5.data("avatarUrl"),true,false);
_.model.defaultAvatarUrl=_5.data("defaultAvatarUrl");
_.model.userIsAdmin=_5.data("userIsAdmin");
_.handleEvents();
if(x$(".xg_chat").data("useDummyApi")){
var _8=xg.components.chat.server.DummyApi(_.model);
}else{
var _8=xg.components.chat.server.ChatterboxApi();
}
_.model.server=xg.components.chat.server.ChatServer(_8,_.model);
if(_5.length==0){
return;
}
_.otherSound=xg.components.chat.NotificationSound(_5.data("otherSoundUri"),_.volumeLock);
_.chatOptionBox=xg.components.chat.ChatOptionBox(_1.toggleOnlineStatus,_.localStorage,_.model);
_1.conversationView=xg.components.chat.ConversationView(x$("#conversationViewContainer",_5),_6,_1,_.model,_.localStorage).initialize(_.model.getConversationViewHeight());
_1.roomWindows={};
xg.shared.EventRegistry.listen("xg.components.chat.models.Model.stateChanged",function(_9){
if(!_9.areOpenChatPanesAllowed()){
_.disable();
}
_.flasher&&_.flasher.stopFlashing();
});
var _a=_5.data("blacklist");
if(_a){
var _b=Base64.decode(_a).split(" ");
var _c=_5.data("checkBoundaries");
_.model.createLanguageFilter(_b,_c);
}
_.model.appId=ning.CurrentApp.id;
_.model.appName=ning.CurrentApp.name.length>_3?ning.CurrentApp.name.substr(0,_3-1)+"\u2026":ning.CurrentApp.name;
_.CONNECTING_STATE=xg.components.chat.states.ConnectingState();
_.ONLINE_STATE=xg.components.chat.states.OnlineState(_.model,_.chatOptionBox);
_.OFFLINE_STATE=xg.components.chat.states.OfflineState(_.model,_1.toggleOnlineStatus);
if(_.model.getCachedOnlineStatus()){
_.model.setState(_.CONNECTING_STATE);
_.model.server.logIntoChat(_.onLoginSuccess,_.onLoginFailure);
}else{
_.model.setState(_.OFFLINE_STATE);
}
x$(window).resize(_.model.layout.closeRoomWindowIfTooMany);
_.model.layout.initializeLate();
xg.shared.EventRegistry.listen("xg.components.chat.LocalStorage.updated",_.localStorageUpdated);
setInterval(_.checkIfSignedOutOfNetwork,_4);
xg.components.chat.Controller.testing={"_":_,"self":_1};
};
_.handleEvents=function(){
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_LIST",function(_d){
_.initializeRoomWindowStates(_d.rooms,_.model.getRoomWindowStates());
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.MESSAGE_ADD",function(_e){
_1.addMessages([xg.components.chat.server.Formatter.toMessage(_e,_.model)]);
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.USER_ONLINE",function(_f){
var _10=_.model.getUser(_f.userId);
if(_10){
_10.setOnline(true);
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.USER_OFFLINE",function(_11){
var _12=_.model.getUser(_11.userId);
if(_12){
_12.setOnline(false);
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.USER_CHANGE",function(_13){
var _14=_.model.getUser(_13.ningId);
if(_14){
_14.setName(_13.name);
_14.setAvatarUrl(_13.iconUrl);
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.USER_BLOCK",function(_15){
var _16=_.model.getUser(_15.userId);
if(_16){
_16.setBlockedByCurrentUser(true);
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.USER_UNBLOCK",function(_17){
var _18=_.model.getUser(_17.userId);
if(_18){
_18.setBlockedByCurrentUser(false);
}
});
xg.shared.EventRegistry.listen("xg.components.chat.models.User.nameChanged",function(_19){
x$(".cht-userName-"+_19.getId()).text(_19.getName());
});
xg.shared.EventRegistry.listen("xg.components.chat.models.Room.nameChanged",function(_1a){
x$(".cht-roomName-"+_1a.getInternalId()).text(_1a.getName());
});
xg.shared.EventRegistry.listen("xg.components.chat.models.User.avatarUrlChanged",function(_1b){
x$(".cht-userAvatar-"+_1b.getId()).attr("src",_1b.getAvatarUrl());
});
xg.shared.EventRegistry.listen("xg.components.chat.models.User.onlineChanged",function(_1c){
x$(".cht-userAvatar-"+_1c.getId()).toggleClass("cht-online",_1c.isOnline()).toggleClass("cht-offline",!_1c.isOnline());
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.HISTORY_REMOVE",function(_1d){
_1.closeRoomWindow(_1d.roomId,true);
var _1e=_.model.getRoom(_1d.roomId);
if(_1e){
_1e.clearUnreadCount();
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_LEAVE",function(_1f){
if(_1f.userId==_.model.user.getId()){
_1.closeRoomWindow(_1f.room.roomId,true);
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_BAN_USER",function(_20){
if(_20.userId==_.model.user.getId()){
_1.closeRoomWindow(_20.room.roomId,true);
}
});
xg.shared.EventRegistry.listen("xg.components.chat.server.ChatServer.ROOM_HIDE",function(_21){
_1.closeRoomWindow(_21.roomId,true);
});
};
_.setupVolumeControl=function(_22){
var _23=x$(".xg_volume",_5);
if(_23.data("volume")&&_23.data("volume")!=xg.shared.util.getCookie("volumeSetting")){
xg.shared.util.setCookie("volumeSetting",_23.data("volume"));
}
var _22=_.localStorage.get("chatSoundEnabled")===null?_22:_.localStorage.get("chatSoundEnabled");
_.volumeLock=xg.components.chat.VolumeLock(_22?10:0);
_23.on("click",_.openVolumeSlider);
};
_.openVolumeSlider=function(){
var _24=x$(".xg_volumeSliderContainer",_5);
_24.toggle();
var _25=x$(".xg_volumeSlider",_5);
if(_25.children().length){
_25.slider("value",_.volumeLock.getVolumeSetting());
return;
}
var _26=_25.slider({animate:true,stop:function(){
var _27=_26.slider("option","value");
_.volumeLock.setVolumeSetting(_27);
_24.hide();
x$(".xg_volume",_5).toggleClass("xg_muted",0==_27);
_.otherSound.play();
},max:10,min:0,orientation:"vertical",range:"min",value:_.volumeLock.getVolumeSetting()});
x$(document).click(function(_28){
_24.hide();
});
};
_.checkIfSignedOutOfNetwork=function(){
if(!_.model.getState().isOnline()){
return;
}
if(!xg.shared.util.getCookie("xn_id_"+_.model.appId.toLowerCase())){
_.model.layout.signOutDetected(_.OFFLINE_STATE);
}
};
_.addBordersIfNeeded=function(_29){
if(parseInt(_29.css("border-top-width"),10)===0||parseInt(_29.css("border-right-width"),10)===0||parseInt(_29.css("border-bottom-width"),10)===0||parseInt(_29.css("border-left-width"),10)===0){
_29.find(".xg_chat").addClass("bordered");
}
};
_.localStorageUpdated=function(){
var _2a=_.model.getState().isOnline();
var _2b=_.model.readOnlineStatusFromLocalStorage();
if(_2a!=_2b){
_1.toggleOnlineStatus();
}
};
_.onLoginSuccess=function(){
_.model.setCachedOnlineStatus(true);
_.model.layout.onLoginSuccess();
_.updateRoomsTimerId=setTimeout(_1.saveRoomWindowStates,2*60*1000);
_.model.setState(_.ONLINE_STATE);
};
_.initializeRoomWindowStates=function(_2c,_2d){
_.roomStateSavingEnabled=false;
var _2e=[];
x$.each(_2c,function(i,_30){
_2e.push(xg.components.chat.server.Formatter.toRoom(_30,_.model));
});
_.model.initializeRooms(_2e);
if(!_.model.layout.isSmallScreenWindowLayout()&&!_.model.layout.isSmallScreenFooterLayout()){
x$.each(_2d,function(i,_32){
var _33=_.model.getRoom(_32.id);
if(!_33){
return;
}
_1.addRoomWindow(_33,false,false,_32.selectedHeight);
var _34=_1.roomWindows[_32.id];
if(_32.expanded){
_34.open();
}else{
_.model.layout.minimizeRoomWindow(_34);
}
});
}
_.roomStateSavingEnabled=true;
};
_.onLoginFailure=function(){
_.model.setState(_.OFFLINE_STATE);
};
_1.toggleOnlineStatus=function(){
var _35=!_.model.getState().isOnline();
if(_35){
_.model.setState(_.CONNECTING_STATE);
_.model.server.logIntoChat(_.onLoginSuccess,_.onLoginFailure);
}else{
_.model.setState(_.OFFLINE_STATE);
_.model.setCachedOnlineStatus(false);
}
};
_.disable=function(){
for(var i in _1.roomWindows){
if(_1.roomWindows.hasOwnProperty(i)){
_1.closeRoomWindow(i,false);
}
}
_1.conversationView.contract(false);
_.model.server.disconnect();
clearInterval(_.updateRoomsTimerId);
_.updateRoomsTimerId=-1;
};
_1.sendMessage=function(_37,_38){
_.model.server.publish(_37,_38);
};
_1.getRoomWindowsSortedByActivity=function(){
var _39=[];
x$.each(_1.roomWindows,function(id,_3b){
if(_3b){
_39.push(_3b);
}
});
_39.sort(function(a,b){
if(b.isSelected()){
return -1;
}
if(a.isSelected()){
return 1;
}
if(!a.isOpen()&&b.isOpen()){
return -1;
}
if(a.isOpen()&&!b.isOpen()){
return 1;
}
return a.getLastActivityTime()-b.getLastActivityTime();
});
return _39;
};
_1.addRoomWindow=function(_3e,_3f,_40,_41){
if(!_3e.isCurrentUserInRoom()){
_.model.server.joinRoom(_3e);
}
if(!_1.roomWindows[_3e.getId()]){
$room=x$("#roomTemplate",_5).clone();
$room.removeAttr("id");
$room.data("roomId",_3e.getId());
_5.append($room);
_1.roomWindows[_3e.getId()]=xg.components.chat.RoomWindow($room,_3e,_1,_.model,_5.data("pageGenerationTime"),_.localStorage,_.flasher);
_1.roomWindows[_3e.getId()].initialize(_41);
_1.saveRoomWindowStates();
}
if(_3f){
_1.roomWindows[_3e.getId()].open();
}
if(_40){
_1.roomWindows[_3e.getId()].focus();
}
_.model.layout.closeRoomWindowIfTooMany();
};
_1.closeRoomWindow=function(id,_43){
if(_1.roomWindows[id]){
_1.roomWindows[id].getContainer().remove();
delete _1.roomWindows[id];
if(_43){
_1.saveRoomWindowStates();
}
xg.shared.EventRegistry.fire("xg.components.chat.Controller.roomWindowClosed");
}
};
_1.saveRoomWindowStates=function(){
if(!_.roomWindowStateSavingEnabled){
return;
}
if(_.updateRoomsTimerId<0){
return;
}
clearTimeout(_.updateRoomsTimerId);
var _44=[];
var _45=x$(".xg_chatRoom",_5);
for(var i=0;i<_45.length;i++){
var _47=x$(_45[i]).data("roomId");
if(x$(_45[i]).attr("id")=="roomTemplate"){
continue;
}
var _48=_1.roomWindows[_47];
_44.push({id:_47,selectedHeight:_48.getSelectedHeight(),expanded:_48.isOpen()});
}
_.model.setRoomWindowStates(_44);
_.updateRoomsTimerId=setTimeout(_1.saveRoomWindowStates,2*60*1000);
};
_1.addMessages=function(_49){
var _4a=[];
var _4b=function(_4c,_4d){
if(x$.inArray(_4c,_4a)===-1){
_4c.beforeAddingMessages();
_4a.push(_4c);
}
_4c.addMessage(_4d);
};
var _4e=false;
x$.each(_49,function(i,_50){
var _51=_1.roomWindows[_50.targetRoomId];
if((!_51||!_51.isOpen())&&_50.sender.getId()!=_.model.user.getId()){
var _52=_.model.getRoom(_50.targetRoomId);
_52.incrementUnreadCount();
}
if(!_51){
return;
}
_4b(_51,_50);
if(_50.sender.getId()!=_.model.user.getId()){
_4e=true;
}
});
x$.each(_4a,function(i,_54){
_54.afterAddingMessages();
});
if(_.soundLock.isSoundEnabled()&&!_.model.layout.isSmallScreenFooterLayout()&&!_.model.layout.isSmallScreenWindowLayout()){
if(_4e){
_.otherSound.play();
}
}
};
_1.navigateToProfile=function(_55){
window.location.href="/xn/detail/u_"+_55;
};
return _1;
};
}
