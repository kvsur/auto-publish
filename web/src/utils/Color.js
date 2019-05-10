// function Color() {}
// Color.prototype.hex = function() {
//     let color = '#';
//     for (let index = 0; index < 6; index++) {
//         color += Math.ceil(Math.random() * 16).toString(16).toLocaleUpperCase();
//     }
//     return color.substr(0, 7);
// }

// Color.prototype.rgb = function() {
//     const colorOne = () => Math.floor(Math.random() * 255);
//     return `rgb(${colorOne()}, ${colorOne()}, ${colorOne()})`;
// }

class Color {
    hex() {
        let color = '#';
        for (let index = 0; index < 6; index++) {
            color += Math.ceil(Math.random() * 16).toString(16).toLocaleUpperCase();
        }
        return color.substr(0, 7);
    }

    rgb() {
        const colorOne = () => Math.floor(Math.random() * 255);
        return `rgb(${colorOne()}, ${colorOne()}, ${colorOne()})`;
    }
}

export default new Color();
