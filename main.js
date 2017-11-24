const Telegraf = require('telegraf');
const Token = '475574821:AAG31x_20sd-RR9nvWC-JqhWtFGzk7rcPQI';
const GeoLib = require('geolib');
const ObtenerEstaciones = require('get-json');

const bot = new Telegraf(Token);
const bikes = 'https://api.citybik.es/v2/networks/valenbisi?fields=stations';

bot.command('start', (ctx) => {
    var name = ctx.from.first_name;
    ctx.reply('Hola, ' + name);
});

bot.on('location', (ctx) => {
    var location = ctx.message.location;

    ObtenerEstaciones(bikes, function(error, result){
        var nearest_bike = GeoLib.findNearest(location, result.network.stations, 0);
        var indice = nearest_bike.key;
        var station = result.network.stations[indice];

        //ctx.reply(JSON.stringify(station));
        var latitude = station.latitude;
        var longitude = station.longitude;
        var direction = station.extra.address;
        var bikes = station.free_bikes;

        ctx.replyWithLocation(latitude, longitude).then(function(){
            ctx.reply("Dirección: " + direction);
        });
    })
});

bot.startPolling();