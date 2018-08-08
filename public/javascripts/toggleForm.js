let isLogin = false;
let isRegister = false;
let toggleLoginForm = () => {
    if (isRegister) {
        isRegister = false;
        $("#registerForm").hide();
    }
    isLogin = !isLogin;
    console.log(isLogin);
    getOu(`ou=department`);
    $("#loginForm").toggle();
}
let toggleRegisterForm = () => {
    if (isLogin) {
        isLogin = false;
        $("#loginForm").hide();
    }
    isRegister = !isRegister;
    getOu(`ou=department`);
    getGroups(`ou=position,ou=groups`);
    $("#registerForm").toggle();
}
