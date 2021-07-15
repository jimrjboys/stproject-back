import { isPointWithinRadius } from 'geolib';

export const nearestLocation = async (req, res) => {

    try {
        let location = [
            {
                lat: -18.86798907535942,
                lon: 47.52825627552398
            },
            {
                lat: -18.869166823227786,
                lon: 47.52632797424958
            },
            {
                lat: -18.870095745287294,
                lon: 47.52168252117942
            },
            {
                lat: -18.87371185713314,
                lon: 47.51901795950131
            }
        ]
        // -18.86847012830522, 47.52960608641607
        const test = [];

        location.forEach((x) => {
            // console.log(x.lat, x.lon)
            try {
                let data = isPointWithinRadius(
                    { latitude: x.lat, longitude: x.lon },
                    { latitude: -18.86847012830522, longitude: 47.52960608641607 },
                    1000
                )
                
                if (data == true) {
                    test.push({
                        lat: x.lat, 
                        lon: x.lon
                    });
                    // console.log()
                }                
            } catch (error) {
                console.log(error)
            }

        })

        // console.log(data)

        res.json(test)
    } catch (error) {
        return res.json(error)
    }
}

