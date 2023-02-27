const Advertisement = require('../models/Advertisement');

exports.AdvertisementModule = {
    create: async (data) => {
        try {
            const ads = new Advertisement(data);
            await ads.save();

            return ads;
        } catch (error) {
            throw Error('\nError at AdvertisementModule.create.\n', error);
        }
    },
    find: async (params) => {
        // даже если params пустое все равно сработает
        // да, делает не нужную работу
        // но кого это волнует?:)

        const asArray = Object.entries(params);
        const filter = asArray
            .filter(([key, value]) => typeof value !== 'undefined')
            .filter(([key, value]) => value.length > 0)
            .map(([key, value]) => {
                if (key === 'shortText' || key === 'description') {
                    return [key, new RegExp(value)];
                } 

                return [key, value];
            });
        const filtered = Object.fromEntries(filter);

        try {
            return await Advertisement.find({
                ...filtered,
                isDeleted: false
            });
        } catch (error) {
            throw Error('\nError at AdvertisementModule.find.\n' + error);
        }
    },
    findById: async (id) => {
        try {
            return await Advertisement.find({_id: id});
        } catch (error) {
            throw Error('\nError at AdvertisementModule.findById' + error);
        }
    },
    remove: async (id) => {
        try {
            return await Advertisement.findOneAndUpdate({_id: id}, {isDeleted: true});
        } catch (error) {
            throw Error('\nError at AdvertisementModule.remove.\n', error);
        }
    }
};