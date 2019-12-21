const urljoin = require('url-join'); 
const request = require('request-promise-native').defaults({json:true});

class PetResource {
    static petResource(url) {
        const petApiBackendServer = process.env.URL_PETS || 'https://pets-apibackend.herokuapp.com/api/v1';
        return urljoin(petApiBackendServer,url);
    }
    static getAllPets(tokenReceive) {
        const url = PetResource.petResource('/pets');
        const options = {
            headers: tokenReceive
        }
        console.log(url);
        console.log(options);
        return request.get(url,options);
    }

}

module.exports = PetResource;
