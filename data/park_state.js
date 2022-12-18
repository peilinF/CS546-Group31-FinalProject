const data = require('.');
const parkData = data.parks;
const getParkByState = async(state) =>{
    if(!state) throw 'you must provide a state';
    if(typeof state != 'string') throw 'invalid state';
    if(state.trim().length === 0) throw 'invalid state';
    const stateAbbreviations = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
    let flag = 0;
    for(i=0;i<stateAbbreviations.length;i++){
        if(stateAbbreviations[i]==state){
            flag = 1;
        }
    }
    if(flag===0){
        throw 'invalid state';
    }
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