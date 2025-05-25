"use strict";
const year = document.getElementById("year");
const loginBtn = document.querySelector(".loginForm__btn");
const userId = document.getElementById("userId");
const userPassword = document.getElementById("userPassword");
const now = new Date();
const nowYear = now.getFullYear();
if (year) {
    year.textContent = String(nowYear);
}
if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        let user = userId.value.trim();
        localStorage.setItem("user", user);
        let password = userPassword.value.trim();
        localStorage.setItem("password", password);
        fetch("./src/mock/users.json")
            .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(`エラー発生。${response.status}`);
        })
            .then((datas) => {
            datas.forEach((data) => {
                if (data.id === user && data.password === password) {
                    localStorage.setItem("name", data.name);
                    location.href = "/other";
                }
            });
        });
        if (!userId && !password) {
            alert("ID と パスワードを入力してください");
            return;
        }
    });
}
