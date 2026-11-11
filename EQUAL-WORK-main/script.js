/* =====================================================
   ACCESSHIRE - COMPLETE JAVASCRIPT
   External JavaScript: script.js
===================================================== */


/* ================= 1. GLOBAL VARIABLES ================= */

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");

const pages = document.querySelectorAll(".page-section");
const navLinks = document.querySelectorAll(".nav-link");

const toastMessage = document.getElementById("toastMessage");
const toastText = document.getElementById("toastText");

let applicationCount = Number(localStorage.getItem("accesshireApplicationCount")) || 0;
let savedCount = 0;
let postedJobCount = 0;
let currentFontSize = 16;


/* ================= 2. TOAST NOTIFICATION ================= */

let toastTimer;

function showToast(message) {

    if (!toastMessage || !toastText) return;

    toastText.textContent = message;

    toastMessage.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toastMessage.classList.remove("show");
    }, 3000);
}


/* ================= 3. PAGE NAVIGATION ================= */

function showPage(pageId) {

    const targetPage = document.getElementById(pageId);

    if (!targetPage || !targetPage.classList.contains("page-section")) {
        return;
    }

    // Hide all pages
    pages.forEach(page => {
        page.classList.remove("active-page");
    });

    // Show selected page
    targetPage.classList.add("active-page");

    // Update sidebar active link
    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.dataset.page === pageId) {
            link.classList.add("active");
        }

    });

    // Close mobile sidebar
    if (sidebar) {
        sidebar.classList.remove("open");
    }

    // Update URL hash
    if (window.location.hash !== "#" + pageId) {
        history.pushState(null, "", "#" + pageId);
    }

    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// All elements having data-page
document.addEventListener("click", function(event) {

    const pageLink = event.target.closest("[data-page]");

    if (!pageLink) return;

    event.preventDefault();

    const pageId = pageLink.dataset.page;

    showPage(pageId);

});


// Browser back and forward navigation
window.addEventListener("popstate", function() {

    const pageId = window.location.hash.substring(1);

    if (pageId) {
        showPage(pageId);
    } else {
        showPage("home");
    }

});


// Open correct page if URL has a hash
window.addEventListener("DOMContentLoaded", function() {

    const pageId = window.location.hash.substring(1);

    if (pageId && document.getElementById(pageId)) {
        showPage(pageId);
    } else {
        showPage("home");
    }

});


/* ================= 4. MOBILE SIDEBAR ================= */

if (menuToggle && sidebar) {

    menuToggle.addEventListener("click", function() {

        sidebar.classList.toggle("open");

    });

}


// Close sidebar when clicking outside
document.addEventListener("click", function(event) {

    if (!sidebar || !menuToggle) return;

    const isMobile = window.innerWidth <= 900;

    if (
        isMobile &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !menuToggle.contains(event.target)
    ) {

        sidebar.classList.remove("open");

    }

});


/* ================= 5. JOB SEARCH ================= */

const jobSearch = document.getElementById("jobSearch");
const jobLocation = document.getElementById("jobLocation");

const jobTypeFilter = document.getElementById("jobTypeFilter");

const filterJobsBtn = document.getElementById("filterJobsBtn");

const allJobsContainer = document.getElementById("allJobsContainer");

const jobCount = document.getElementById("jobCount");

const noJobsMessage = document.getElementById("noJobsMessage");


function filterJobs() {

    if (!allJobsContainer) return;

    const searchValue = jobSearch.value.toLowerCase().trim();

    const locationValue = jobLocation.value.toLowerCase().trim();

    const typeValue = jobTypeFilter.value.toLowerCase().trim();

    const jobCards = allJobsContainer.querySelectorAll(".job-card");

    let visibleJobs = 0;

    jobCards.forEach(card => {

        const title = card.dataset.title ||
            card.querySelector("h3")?.textContent || "";

        const company = card.querySelector(".company-name")?.textContent || "";

        const location = card.dataset.location || "";

        const type = card.dataset.type || "";

        const matchesSearch =
            title.toLowerCase().includes(searchValue) ||
            company.toLowerCase().includes(searchValue);

        const matchesLocation =
            location.toLowerCase().includes(locationValue);

        const matchesType =
            !typeValue || type.toLowerCase() === typeValue;

        if (matchesSearch && matchesLocation && matchesType) {

            card.style.display = "";

            visibleJobs++;

        } else {

            card.style.display = "none";

        }

    });


    if (jobCount) {

        jobCount.textContent =
            visibleJobs + (visibleJobs === 1 ? " Opportunity" : " Opportunities");

    }

    if (noJobsMessage) {

        noJobsMessage.classList.toggle("hidden", visibleJobs !== 0);

    }

}


// Filter button
if (filterJobsBtn) {

    filterJobsBtn.addEventListener("click", filterJobs);

}


// Live search
if (jobSearch) {

    jobSearch.addEventListener("input", filterJobs);

}

if (jobLocation) {

    jobLocation.addEventListener("input", filterJobs);

}

if (jobTypeFilter) {

    jobTypeFilter.addEventListener("change", filterJobs);

}


/* ================= 6. HOME PAGE SEARCH ================= */

const homeJobSearch = document.getElementById("homeJobSearch");

const homeLocation = document.getElementById("homeLocation");

const homeSearchBtn = document.getElementById("homeSearchBtn");


if (homeSearchBtn) {

    homeSearchBtn.addEventListener("click", function() {

        const search = homeJobSearch.value.trim();

        const location = homeLocation.value.trim();

        jobSearch.value = search;

        jobLocation.value = location;

        jobTypeFilter.value = "";

        showPage("jobs");

        filterJobs();

    });

}


/* ================= 7. GLOBAL SEARCH ================= */

const globalSearch = document.getElementById("globalSearch");


if (globalSearch) {

    globalSearch.addEventListener("keydown", function(event) {

        if (event.key === "Enter") {

            jobSearch.value = globalSearch.value;

            jobLocation.value = "";

            jobTypeFilter.value = "";

            showPage("jobs");

            filterJobs();

        }

    });

}


/* ================= 8. SAVE JOBS ================= */

function getSavedJobs() {

    return JSON.parse(localStorage.getItem("accesshireSavedJobs")) || [];

}


function saveSavedJobs(jobs) {

    localStorage.setItem(
        "accesshireSavedJobs",
        JSON.stringify(jobs)
    );

}


function getJobKey(card) {

    const title = card.querySelector("h3")?.textContent.trim() || "";

    const company = card.querySelector(".company-name")?.textContent.trim() || "";

    return title + "|" + company;

}


function updateSavedCount() {

    const savedJobs = getSavedJobs();

    savedCount = savedJobs.length;

    const savedCountElement = document.getElementById("savedCount");

    if (savedCountElement) {

        savedCountElement.textContent = String(savedCount).padStart(2, "0");

    }

}


function updateSaveButtons() {

    const savedJobs = getSavedJobs();

    document.querySelectorAll(".save-job").forEach(button => {

        const card = button.closest(".job-card");

        if (!card) return;

        const key = getJobKey(card);

        const isSaved = savedJobs.includes(key);

        button.classList.toggle("saved", isSaved);

        const icon = button.querySelector("i");

        if (icon) {

            icon.className = isSaved
                ? "fa-solid fa-bookmark"
                : "fa-regular fa-bookmark";

        }

    });

}


document.addEventListener("click", function(event) {

    const saveButton = event.target.closest(".save-job");

    if (!saveButton) return;

    const card = saveButton.closest(".job-card");

    if (!card) return;

    const key = getJobKey(card);

    let savedJobs = getSavedJobs();

    if (savedJobs.includes(key)) {

        savedJobs = savedJobs.filter(job => job !== key);

        showToast("Job removed from saved jobs.");

    } else {

        savedJobs.push(key);

        showToast("Job saved successfully!");

    }

    saveSavedJobs(savedJobs);

    updateSavedCount();

    updateSaveButtons();

});


/* ================= 9. APPLY FOR JOB ================= */

function updateApplicationCount() {

    const countElement = document.getElementById("applicationCount");

    if (countElement) {

        countElement.textContent =
            String(applicationCount).padStart(2, "0");

    }

    localStorage.setItem("accesshireApplicationCount", String(applicationCount));

}


document.addEventListener("click", function(event) {

    const applyButton = event.target.closest(".apply-job-btn");

    if (!applyButton) return;

    applicationCount++;

    updateApplicationCount();

    showToast("Application submitted successfully! (Demo)");

});


/* ================= 10. REGISTER FORM ================= */

const registerForm = document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("fullName").value.trim();

        const email = document.getElementById("registerEmail").value.trim();

        const phone = document.getElementById("phoneNumber").value.trim();

        const accountType = document.getElementById("accountType").value;

        const password = document.getElementById("registerPassword").value;

        const confirmPassword = document.getElementById("confirmPassword").value;

        const terms = document.getElementById("termsCheck").checked;


        if (!name || !email || !phone || !accountType || !password) {

            showToast("Please fill all required fields.");

            return;

        }


        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

            showToast("Please enter a valid email address.");

            return;

        }


        if (!/^\d{10}$/.test(phone)) {

            showToast("Please enter a valid 10-digit mobile number.");

            return;

        }


        if (password.length < 6) {

            showToast("Password must contain at least 6 characters.");

            return;

        }


        if (password !== confirmPassword) {

            showToast("Passwords do not match.");

            return;

        }


        if (!terms) {

            showToast("Please accept the terms and conditions.");

            return;

        }


        // Demo only: do not store passwords in localStorage.
        const user = {

            name: name,

            email: email,

            phone: phone,

            accountType: accountType

        };


        localStorage.setItem(
            "accesshireUser",
            JSON.stringify(user)
        );


        showToast("Account created successfully! (Demo)");

        registerForm.reset();

        setTimeout(() => {

            showPage("login");

        }, 1200);

    });

}


/* ================= 11. LOGIN FORM ================= */

const loginForm = document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();

        const password = document.getElementById("loginPassword").value;


        if (!email || !password) {

            showToast("Please enter email and password.");

            return;

        }


        const savedUser = JSON.parse(
            localStorage.getItem("accesshireUser") || "null"
        );


        if (!savedUser || savedUser.email !== email) {

            showToast("Demo account not found. Please register first.");

            return;

        }


        // Demo frontend login:
        // Password verification must be implemented by backend.

        const userName = savedUser.name;

        showToast("Welcome back, " + userName + "!");


        const profileName = document.querySelector(".profile-menu strong");

        if (profileName) {

            profileName.textContent = userName;

        }


        loginForm.reset();


        setTimeout(() => {

            if (savedUser.accountType === "employer") {

                showPage("employer-dashboard");

            } else {

                showPage("dashboard");

            }

        }, 1000);

    });

}


/* ================= 12. PASSWORD VISIBILITY ================= */

document.querySelectorAll(".password-toggle").forEach(button => {

    button.addEventListener("click", function() {

        const input = button.parentElement.querySelector("input");

        if (!input) return;

        const isPassword = input.type === "password";

        input.type = isPassword ? "text" : "password";

        const icon = button.querySelector("i");

        if (icon) {

            icon.className = isPassword
                ? "fa-regular fa-eye-slash"
                : "fa-regular fa-eye";

        }

    });

});


/* ================= 13. EMPLOYER JOB POSTING ================= */

const postJobForm = document.getElementById("postJobForm");

const employerJobList = document.getElementById("employerJobList");

const postedJobCountElement = document.getElementById("postedJobCount");


function getPostedJobs() {

    return JSON.parse(localStorage.getItem("accesshirePostedJobs")) || [];

}


function savePostedJobs(jobs) {

    localStorage.setItem(
        "accesshirePostedJobs",
        JSON.stringify(jobs)
    );

}


function createJobCard(job) {

    const card = document.createElement("article");

    card.className = "job-card";

    card.dataset.title = job.title + " " + job.company;

    card.dataset.type = job.type;

    card.dataset.location = job.location;


    const top = document.createElement("div");

    top.className = "job-card-top";

    const logo = document.createElement("div");

    logo.className = "company-logo";

    logo.innerHTML = '<i class="fa-solid fa-building"></i>';


    const category = document.createElement("span");

    category.className = "job-category";

    category.textContent = "New Opportunity";


    const title = document.createElement("h3");

    title.textContent = job.title;


    const company = document.createElement("p");

    company.className = "company-name";

    company.textContent = job.company;


    const details = document.createElement("div");

    details.className = "job-details";

    const location = document.createElement("span");

    location.innerHTML = '<i class="fa-solid fa-location-dot"></i> ';

    location.appendChild(document.createTextNode(job.location));


    const type = document.createElement("span");

    type.innerHTML = '<i class="fa-solid fa-clock"></i> ';

    type.appendChild(document.createTextNode(job.type));


    details.append(location, type);


    const bottom = document.createElement("div");

    bottom.className = "job-card-bottom";


    const salary = document.createElement("strong");

    salary.textContent = job.salary || "Not specified";


    const applyButton = document.createElement("button");

    applyButton.className = "small-btn apply-job-btn";

    applyButton.textContent = "Apply Now";


    top.appendChild(logo);

    bottom.append(salary, applyButton);

    card.append(top, category, title, company, details, bottom);

    return card;

}


function renderPostedJobs() {

    const jobs = getPostedJobs();

    postedJobCount = jobs.length;

    if (postedJobCountElement) {

        postedJobCountElement.textContent =
            String(postedJobCount).padStart(2, "0");

    }


    if (employerJobList) {

        employerJobList.innerHTML = "";

        if (jobs.length === 0) {

            const message = document.createElement("p");

            message.className = "empty-state";

            message.textContent = "No jobs posted yet.";

            employerJobList.appendChild(message);

        } else {

            jobs.forEach(job => {

                const item = document.createElement("div");

                item.className = "employer-job-item";

                const info = document.createElement("div");

                const title = document.createElement("h3");

                title.textContent = job.title;

                const company = document.createElement("p");

                company.textContent =
                    job.company + " | " + job.location;

                info.append(title, company);


                const badge = document.createElement("span");

                badge.className = "job-category";

                badge.textContent = job.type;


                item.append(info, badge);

                employerJobList.appendChild(item);

            });

        }

    }


    // Also add employer jobs to the public jobs list
    if (allJobsContainer) {

        allJobsContainer.querySelectorAll(".dynamic-job").forEach(card => {
            card.remove();
        });

        jobs.forEach(job => {

            const card = createJobCard(job);

            card.classList.add("dynamic-job");

            allJobsContainer.appendChild(card);

        });

    }

}


if (postJobForm) {

    postJobForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const job = {

            title: document.getElementById("jobTitle").value.trim(),

            company: document.getElementById("companyName").value.trim(),

            location: document.getElementById("employerLocation").value.trim(),

            type: document.getElementById("employerJobType").value,

            salary: document.getElementById("salary").value.trim(),

            skills: document.getElementById("requiredSkills").value.trim(),

            description: document.getElementById("jobDescription").value.trim()

        };


        if (
            !job.title ||
            !job.company ||
            !job.location ||
            !job.type ||
            !job.description
        ) {

            showToast("Please complete all required job details.");

            return;

        }


        const jobs = getPostedJobs();

        jobs.unshift(job);

        savePostedJobs(jobs);

        renderPostedJobs();

        postJobForm.reset();

        showToast("Your job has been published!");


    });

}


/* ================= 14. DARK MODE ================= */

const darkModeToggle = document.getElementById("darkModeToggle");


function applyDarkMode(enabled) {

    document.body.classList.toggle("dark-mode", enabled);

    if (darkModeToggle) {

        darkModeToggle.checked = enabled;

    }

    localStorage.setItem("accesshireDarkMode", enabled);

}


if (darkModeToggle) {

    darkModeToggle.addEventListener("change", function() {

        applyDarkMode(this.checked);

        showToast(
            this.checked ? "Dark mode enabled." : "Light mode enabled."
        );

    });

}


/* ================= 15. HIGH CONTRAST ================= */

const contrastToggle = document.getElementById("contrastToggle");


function applyContrast(enabled) {

    document.body.classList.toggle("high-contrast", enabled);

    if (contrastToggle) {

        contrastToggle.checked = enabled;

    }

    localStorage.setItem("accesshireContrast", enabled);

}


if (contrastToggle) {

    contrastToggle.addEventListener("change", function() {

        applyContrast(this.checked);

        showToast(
            this.checked ? "High contrast enabled." : "High contrast disabled."
        );

    });

}


/* ================= 16. CONTACT AND HEADER ACTIONS ================= */

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();

        showToast("Thanks for contacting us. We will be in touch soon.");

        contactForm.reset();

    });

}


document.addEventListener("click", function(event) {

    const notificationButton = event.target.closest("#notificationButton");

    if (notificationButton) {

        showToast("You are all caught up on notifications.");

        return;

    }


    const logoutLink = event.target.closest('[data-action="logout"]');

    if (logoutLink) {

        event.preventDefault();

        const profileName = document.querySelector(".profile-menu strong");

        if (profileName) profileName.textContent = "Welcome Guest";

        showPage("home");

        showToast("You have been logged out.");

    }

});


/* ================= 17. ACCESSIBILITY PREFERENCES ================= */

const fontIncrease = document.getElementById("fontIncrease");
const fontDecrease = document.getElementById("fontDecrease");

function setFontSize(size) {

    currentFontSize = Math.min(22, Math.max(14, size));

    document.documentElement.style.fontSize = currentFontSize + "px";

    localStorage.setItem("accesshireFontSize", String(currentFontSize));

}


if (fontIncrease) {

    fontIncrease.addEventListener("click", function() {

        setFontSize(currentFontSize + 1);

    });

}


if (fontDecrease) {

    fontDecrease.addEventListener("click", function() {

        setFontSize(currentFontSize - 1);

    });

}


/* ================= 18. INITIAL STATE ================= */

currentFontSize = Number(localStorage.getItem("accesshireFontSize")) || 16;
setFontSize(currentFontSize);
applyDarkMode(localStorage.getItem("accesshireDarkMode") === "true");
applyContrast(localStorage.getItem("accesshireContrast") === "true");
updateApplicationCount();
updateSavedCount();
updateSaveButtons();
renderPostedJobs();
filterJobs();