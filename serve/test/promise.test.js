const promise = new Promise((resolve, reject) => {
    resolve({
        c: 100,
        m: 'success',
        d: {
            age: 12
        }
    });
});

let data = {};

promise.then(res => {
    data = res.d;
}).catch(e => {
    data = {
        age: -1
    }
}).finally(() => {
    console.log(data);
});