let isLogin = false;
let isRegister = false;
let toggleLoginForm = () => {
    if (isRegister) {
        isRegister = !isRegister;
        $("#registerForm").toggle();
    }
    isLogin = !isLogin;
    getOu(`ou=department`);
    $("#loginForm").toggle();
}
let toggleRegisterForm = () => {
    if (isLogin) {
        isLogin = !isLogin;
        $("#loginForm").toggle();
    }
    isRegister = !isRegister;
    getOu(`ou=department`);
    getGroups(`ou=position,ou=groups`);
    $("#registerForm").toggle();
}
