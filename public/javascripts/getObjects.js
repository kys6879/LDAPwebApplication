/* index.ejs */
let getOu = (baseDn) => {
    console.log("getOu Ajax  " + baseDn);
    $.ajax({
        url: '/ou/child/' + baseDn,
        dataType: 'json',
        type: 'GET',
        data: {},
        success: (result) => {
            console.log(`결과 : ${result}`);
            ouResults = result;
            ouLength = result.length;
        },
        err: (req, status, err) => {
            alert("code = " + req.status + " message = " + req.responseText + " error = " + err); // 실패 시 처리
        },
        complete: (data) => {
            console.log(`ouResults : ${ouResults}`);
            console.log(`ouLength : ${ouLength}`);
            createOuOptions(ouLength, ouResults);
        }
    });
}
let getGroups = (baseDn) => {
    console.log("getGroups Ajax  " + baseDn);
    $.ajax({
        url: '/group/child/' + baseDn,
        dataType: 'json',
        type: 'GET',
        data: {},
        success: (result) => {
            console.log(`결과 : ${result}`);
            groupResults = result;
            groupLength = result.length;
        },
        err: (req, status, err) => {
            alert("code = " + req.status + " message = " + req.responseText + " error = " + err); // 실패 시 처리
        },
        complete: (data) => {
            console.log(`groupResults : ${groupResults}`);
            console.log(`groupLength : ${groupLength}`);
            createGroupOptions(groupLength, groupResults);
        }
    });
}
/* index.ejs */

/* export.ejs */
let getData = (url, kind) => {
    $.ajax({
        url: url,
        dataType: 'json',
        type: 'GET',
        success: (result) => {
            results = result;
            kinds = kind;
            $('#exportbutton').show();
            $('#result').text(JSON.stringify(result, null, 2));
        }
    });
};

let exportButton = () => {
    console.log("에이젝스  " + kinds);
    $.ajax({
        url: '/option/export',
        dataType: 'json',
        type: 'POST',
        data: {
            'entries': JSON.stringify(results, null, 2),
            'kind': kinds
        },
        success: (result) => {
            if (result['result'] == true) {
                alert("성공");
            }
        }
    });
};
/* export.ejs */
