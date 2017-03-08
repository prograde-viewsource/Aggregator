four51.app.factory('ConfigService', ['$resource', '$451', function($resource, $451) {

    var config = {
        'productID' : 'BD9146B9-ADC0-4EE4-A9EC-D23CFF11461B',
        'finalDate' : new Date('2017-04-01 00:00:00'.replace(' ', 'T')),
        'coordinator' : 'Amy Carman'
    }

    return {
        config: config
    }

}]);