let createHiddenKoreanPositionName = () =>{
    let input_position = $(`<input type="text" name="position" value = ""  />`);
}

let createGroupOptions = (length, results) => {
    $(".selectGroup").empty();
    for (let i = 0; i < length; i++) {
        let option = $(`<option value=${results[i].gidNumber}>${results[i].description}</option>`);
        $(".selectGroup").append(option);
    }
}

let input_position = $(`<input type="text" name="position" value = ""  />`);
let div = $("#registerForm");
div.append(input_position);
