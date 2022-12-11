const data = require('.');
const parkData = data.parks;
const getParkByState = async(state) =>{
    if(!state) throw 'you must provide a state';
    if(typeof state != 'string') throw 'invalid state';
    if(state.trim().length === 0) throw 'invalid state';
    //maybe need one function to see if state is in the list
    let list = [];
    let parks = await parkData.getAllParks();
    parks.forEach(element => {
        if(element.stateCode === state){
            list.push(element);
        }
    });
    if(list.length === 0){
        return 0;
    }
    return list;
}

module.exports = {
    getParkByState
};