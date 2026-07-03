const passwordInput = document.getElementById("password"),
copyBtn = document.getElementById("copyBtn"),
togglePassword = document.getElementById("togglePassword"),
generateBtn = document.getElementById("generateBtn"),
lengthSlider = document.getElementById("lengthSlider"),
lengthValue = document.getElementById("lengthValue"),
uppercase = document.getElementById("uppercase"),
lowercase = document.getElementById("lowercase"),
numbers = document.getElementById("numbers"),
symbols = document.getElementById("symbols"),
similar = document.getElementById("similar"),
strengthIndicator = document.getElementById("strengthIndicator"),
strengthLabel = document.getElementById("strengthLabel"),
toast = document.getElementById("toast");
const U = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const L = "abcdefghijklmnopqrstuvwxyz";
const N = "0123456789";
const S = "!@#$%^&*()_+-={}[]<>?/|~";
const SIM = "O0Il1";

const rand = str => str[Math.floor(Math.random() * str.length)];

const clean = str => similar.checked ? [...str].filter(c => !SIM.includes(c)).join("") : str;

function pool(){
    let p = "";
    if(uppercase.checked) p += U;
    if(lowercase.checked) p += L;
    if(numbers.checked) p += N;
    if(symbols.checked) p += S;
    return clean(p);
}

function strength(p){
    let s = 0;
    if(p.length >= 8) s++;
    if(p.length >= 12) s++;
    if(/[A-Z]/.test(p)) s++;
    if(/[a-z]/.test(p)) s++;
    if(/[0-9]/.test(p)) s++;
    if(/[^A-Za-z0-9]/.test(p)) s++;

    if(s <= 2){
        strengthIndicator.style.width = "30%";
        strengthIndicator.style.background = "#ef4444";
        strengthLabel.textContent = "Weak";
    }else if(s <= 4){
        strengthIndicator.style.width = "60%";
        strengthIndicator.style.background = "#facc15";
        strengthLabel.textContent = "Medium";
    }else{
        strengthIndicator.style.width = "100%";
        strengthIndicator.style.background = "#22c55e";
        strengthLabel.textContent = "Strong";
    }
}

function generate() {

    const len = +lengthSlider.value;
    const selected = [];
    let p = "";

    if (uppercase.checked) {
        p += U;
        selected.push(U);
    }

    if (lowercase.checked) {
        p += L;
        selected.push(L);
    }

    if (numbers.checked) {
        p += N;
        selected.push(N);
    }

    if (symbols.checked) {
        p += S;
        selected.push(S);
    }

    p = clean(p);

    if (!p) {
        passwordInput.value = "";
        strengthLabel.textContent = "Select options";
        return;
    }

    let pass = "";

    // At least one character from every selected option
    selected.forEach(set => {
        pass += rand(clean(set));
    });

    // Fill remaining length
    while (pass.length < len) {
        pass += rand(p);
    }

    // Shuffle password
    pass = [...pass]
        .sort(() => Math.random() - 0.5)
        .join("");

    passwordInput.value = pass.slice(0, len);

    strength(passwordInput.value);
}

function showToast(){
    toast.classList.add("show");
    setTimeout(()=>toast.classList.remove("show"),1500);
}

generateBtn.onclick = generate;

copyBtn.onclick = async ()=>{
    if(!passwordInput.value) return;
    await navigator.clipboard.writeText(passwordInput.value);
    showToast();
};

lengthSlider.oninput = ()=>{
    lengthValue.textContent = lengthSlider.value;
    generate();
};

[uppercase,lowercase,numbers,symbols,similar].forEach(el=>{
    el.onchange = generate;
});

window.onload = ()=>{
    lengthValue.textContent = lengthSlider.value;
    generate();
};
/* ===== Show / Hide Password ===== */

togglePassword.addEventListener("click", () => {

    passwordInput.type =
        passwordInput.type === "password"
            ? "text"
            : "password";

});