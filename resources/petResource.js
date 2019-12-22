const urljoin = require('url-join'); 
const request = require('request-promise-native').defaults({json:true});

class PetResource {
    static petResource(url) {
        const petApiBackendServer = process.env.URL_PETS || 'https://pets-apibackend.herokuapp.com/api/v1';
        return urljoin(petApiBackendServer,url);
    };

    
    static join(lookupTable, mainTable, lookupKey, mainKey, select) {
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
            output.push(select(y, x)); // select only the columns you need
        }
        return output;
    };

    static async getPetsWithAdoptions(tokenReceive,adoptions,pathToFetch) {
        const url = PetResource.petResource(pathToFetch);
        const options = {
            headers: tokenReceive
        }
         var allPets = await request.get(url,options);
         
         const mergedPetsWithAdoptions = this.join(allPets, adoptions, "_id", "petId", function(adoption, pet) {
            return {
                adoptionId:adoption._id,
                status: adoption.status,
                donorId:adoption.donorId,
                receptorId:adoption.receptorId,
                adoptionCreatedAt:adoption.createdAt,
                adoptionUpdatedAt:adoption.updatedAt,
                petId: pet._id,
                petName:pet.petName,
                petSize:pet.petSize,
                petNotes:pet.petNotes,
                imgUrl:pet.imgUrl,
                petCreatedAt:pet.createdAt,
                petUpdatedAt:pet.updatedAt
            }
        });

         return mergedPetsWithAdoptions;
    };
}

module.exports = PetResource;
