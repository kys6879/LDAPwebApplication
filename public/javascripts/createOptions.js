let createOuOptions = (length, results) => {
    $(".selectOu").empty();
    for (let i = 0; i < length; i++) {
        let option = $(`<option value=${results[i].ou}>${results[i].businessCategory}</option>`);
        $(".selectOu").append(option);
    }
}
let createGroupOptions = (length, results) => {
    $(".selectGroup").empty();
    for (let i = 0; i < length; i++) {
        let option = $(`<option value=${results[i].gidNumber}>${results[i].description}</option>`);
        $(".selectGroup").append(option);
    }
}
