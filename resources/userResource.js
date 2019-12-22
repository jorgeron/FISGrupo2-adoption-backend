const urljoin = require('url-join'); 
const request = require('request-promise-native').defaults({json:true});

class UserResource {
    static userResource(url) {
        const usersApiBackendServer = process.env.URL_USERS || 'https://jwtauth-apibackend.herokuapp.com/api/v1';
        return urljoin(usersApiBackendServer,url);
    };
    
    static join(lookupTable, mainTable, lookupKey, mainKey, secondaryKey, select) {
        var l = lookupTable.length,
            m = mainTable.length,
            lookupIndex = [],
            output = [];
        for (var i = 0; i < l; i++) { // loop through l items
            var row = lookupTable[i];
            lookupIndex[row[lookupKey]] = row; // create an index for lookup table
        }
        for (var j = 0; j < m; j++) { // loop through m items
            var y = mainTable[j];
            var x = lookupIndex[y[mainKey]]; // get corresponding row from lookupTable
            var z = lookupIndex[y[secondaryKey]]; 
            output.push(select(y, x, z)); // select only the columns you need
        }
        return output;
    };

    static async getUsersWithAdoptions(tokenReceive,adoptions,pathToFetch) {
        const url = UserResource.userResource(pathToFetch);
        const options = {
            headers: tokenReceive
        }
         var allUsers = await request.get(url,options);
         
         var mergeUsersWithAdoptions = this.join(allUsers, adoptions, "_id", "donorId","receptorId", function(adoption, donor, receptor) {
            return {
                adoptionId:adoption.adoptionId,
                status: adoption.status,
                donorId:adoption.donorId,
                userDonorId:(donor!==undefined)?donor._id : null,
                donorName: (donor!==undefined)?donor.username : null,
                donorEmail: (donor!==undefined)?donor.email : null,
                donorAddress: (donor!==undefined)?donor.address : null,
                receptorId:adoption.receptorId,
                userReceptorId:(receptor!==undefined)?receptor._id : null,
                receptorName:(receptor!==undefined)?receptor.username : null,
                receptorEmail:(receptor!==undefined)?receptor.email : null,
                receptorAddress: (receptor!==undefined)?receptor.address : null,
                adoptionCreatedAt:adoption.createdAt,
                adoptionUpdatedAt:adoption.updatedAt,
                petId: adoption.petId,
                petName:adoption.petName,
                petSize:adoption.petSize,
                petNotes:adoption.petNotes,
                imgUrl:adoption.imgUrl,
                petCreatedAt:adoption.petCreatedAt,
                petUpdatedAt:adoption.petUpdatedAt
            }
        });

         return mergeUsersWithAdoptions;
    };
}

module.exports = UserResource;
