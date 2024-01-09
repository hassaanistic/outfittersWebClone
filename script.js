const container = document.querySelector(".container");
var section = null;

container.addEventListener("scroll", event => {
    const scrollTop = container.scrollTop;
    if (scrollTop < 498) {
        section = "first";
    } else if (scrollTop >= 498 && scrollTop < 976) {
        section = "second";
    } else if (scrollTop >= 976 && scrollTop < 1454) {
        section = "third";
    } else if (scrollTop >= 1454) {
        section = "footer";
    }

    // console.log(container.scrollTop)
    // console.log(section);

    //if we dont call this all the time then once the elements get display nne they will never come back 
    toggleVisibility(section);

    updateFocus();
}, { passive: true });


//make the leftrightnavs ,stickyNavs and checkBoxes invisible
function toggleVisibility(section) {
    const classesToHide = ["leftRightNavs", "checkbox-container", "sticky-nav"];

    classesToHide.forEach(className => {
        const elements = document.getElementsByClassName(className);

        for (let i = 0; i < elements.length; i++) {
            if (section === "footer") {
                elements[i].style.display = "none";
            } else {
                elements[i].style.display = "flex"; // or any other display value you want
            }
        }
    });
}


function updateFocus() {
    updateNavigationLinks();
    updateCheckboxes();
}

//make current navlink bold and other remain small  
function updateNavigationLinks() {
    const navLinks = document.querySelectorAll(".sticky-nav a");

    navLinks.forEach(link => {
        link.style.fontWeight = "normal";
    });

    const currentNavLink = document.querySelector(`.sticky-nav a[href="#${section}"]`);
    if (currentNavLink) {
        currentNavLink.style.fontWeight = "bold";
    }
}

//make current checkbox bold and other remain normal 
function updateCheckboxes() {
    const checkboxes = document.querySelectorAll('.round-checkbox');

    checkboxes.forEach(checkbox => {
        checkbox.checked = false; // Uncheck all checkboxes
        checkbox.style.opacity = 0.5
    });

    const currentCheckbox = document.getElementById(`${section}-checkbox`);
    if (currentCheckbox) {
        currentCheckbox.checked = true; // Check the checkbox corresponding to the current section
        currentCheckbox.style.opacity = 1;
    }
}
//made function when for scroll when cick on the navlink or on checkBox
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        container.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
        });
    }
}


//click on checkBox and scroll to section
const allCheckboxes = document.querySelectorAll('.round-checkbox');
allCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            const targetSection = this.id.replace('-checkbox', '');
            scrollToSection(targetSection);
            uncheckOtherCheckboxes(this.id);
        }
    });
});
function uncheckOtherCheckboxes(currentCheckboxId) {
    allCheckboxes.forEach(checkbox => {
        if (checkbox.id !== currentCheckboxId) {
            checkbox.checked = false;
        }
    });
}


//click on navlink and scroll to section
const navLinks = document.querySelectorAll(".sticky-nav a");
navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        const targetSection = this.getAttribute('href').substring(1);
        scrollToSection(targetSection);
    });
});

const sideUrlElement = document.getElementById('sideUrl');
function updateSideUrl(sectionId) {
    const newURL = window.location.href.split('#')[0] + `#${sectionId}`;
    sideUrlElement.textContent = newURL;
    sideUrlElement.style.display = 'flex';

    // Clear sideUrl content after 1 second
    setTimeout(() => {
        sideUrlElement.textContent = '';
        sideUrlElement.style.display = 'none';
    }, 1000);
}





//GET CURRENT PAGE DATA AND RENDER IN THE HTML 
var currentPage = "women"; //we are using this in appendButtons functionn so we make it Global
document.querySelectorAll('.leftRightNavs').forEach(function (element) {
    element.addEventListener('click', async function () {
        currentPage = await element.innerText.toLowerCase();
        console.log('Current Page is:', currentPage);

        fetchData(`${currentPage}Obj`);
        //Reload and move to the top 
        container.scrollTo({
            top: 0,
            behavior: "instant" //instant because if we use scroll it is seen moving upward when we click on leftRight navigation
        });

        if (currentPage == "women") {
            document.querySelector('#gotToLeft >p').innerText = "Men";
            document.querySelector('#goToRight >p').innerText = "Juniors";

            document.getElementById('firstNavLink').innerText = "Women";
            document.getElementById('secondNavLink').innerText = "OuterWear";
            document.getElementById('thirdNavLink').innerText = "Bottoms";
        } else if (currentPage == "men") {
            document.querySelector('#gotToLeft >p').innerText = "Juniors";
            document.querySelector('#goToRight >p').innerText = "Women";

            document.getElementById('firstNavLink').innerText = "Men";
            document.getElementById('secondNavLink').innerText = "OuterWear";
            document.getElementById('thirdNavLink').innerText = "Bottoms";
        } else if (currentPage == "juniors") {
            document.querySelector('#gotToLeft >p').innerText = "Women";
            document.querySelector('#goToRight >p').innerText = "Men";

            document.getElementById('firstNavLink').innerText = "Juniors";
            document.getElementById('secondNavLink').innerText = "Boys-Winter-Sale";
            document.getElementById('thirdNavLink').innerText = "Girls-Winter-Sale";
        }

    });
});


const fetchData = (objectType) => {
    try {
        fetch("Data.json")
            .then((response) => response.json())
            .then((data) => {
                const obj = data[objectType];

                if (obj) {
                    const sections = obj.sections;
                    document.getElementById("first").style.backgroundImage =
                        `url(${sections[0]})`;
                    document.getElementById("second").style.backgroundImage =
                        `url(${sections[1]})`;
                    document.getElementById("third").style.backgroundImage =
                        `url(${sections[2]})`;


                    // Check if the object has buttons
                    if (obj.buttons && obj.buttons.sectionOneButtons && obj.buttons.sectionTwoButtons) {
                        appendButtons(obj.buttons.sectionOneButtons, obj.buttons.sectionTwoButtons);
                    } else if (obj.buttons && obj.buttons.sectionOneButtons) {
                        appendButtons(obj.buttons.sectionOneButtons);
                    }
                    else {
                        clearButtons();
                    }

                } else {
                    console.error("Object type not found in data:", objectType);
                }
            })
            .catch((error) => console.error("Error fetching JSON:", error));
    } catch (error) {
        console.log(error.message);
    }
};


// append buttons to the button container
//by default the button2 are null in case we dont get the buttons2 argument
function appendButtons(buttons1, buttons2 = null) {
    //we cannot append child using className --> we need to get document by id 

    //we append in the first section of the women and men pages
    if (currentPage == "women" || currentPage == "men") {
        var buttonContainer1 = document.getElementById('buttonContainer1');
        clearButtons();
        buttons1.forEach(function (buttonData) {
            // create button element
            var button = document.createElement('button');
            button.innerText = buttonData.name; // use the name property from the data
            button.dataset.url = buttonData.url; // add URL as a data attribute

            button.addEventListener('click', function () {
                window.open(button.dataset.url, '_blank');
            });
            buttonContainer1.appendChild(button);
        });


    } else {
        var buttonContainer2 = document.getElementById('buttonContainer2');

        clearButtons();

        buttons1.forEach(function (buttonData) {
            // create button element
            var button = document.createElement('button');
            button.innerText = buttonData.name;
            button.dataset.url = buttonData.url;

            button.addEventListener('click', function () {
                window.open(button.dataset.url, '_blank');
            });

            buttonContainer2.appendChild(button);


        });

        if (buttons2 != null) {
            var buttonContainer3 = document.getElementById('buttonContainer3');
            // make buttonContainer clear --> we cannot call clear functional because it wash Out buttons from first section also  
            buttonContainer3.innerHTML = '';

            buttons2.forEach(function (buttonData) {
                // create button element
                var button = document.createElement('button');
                button.innerText = buttonData.name; // use the name property from the data
                button.dataset.url = buttonData.url; // add URL as a data attribute

                button.addEventListener('click', function () {
                    window.open(button.dataset.url, '_blank');
                });

                buttonContainer3.appendChild(button);


            });
        }
    }
}

// Remove all the buttons 
function clearButtons() {
    var buttonContainer1 = document.getElementById('buttonContainer1');
    var buttonContainer2 = document.getElementById('buttonContainer2');
    var buttonContainer3 = document.getElementById('buttonContainer3');
    buttonContainer1.innerHTML = '';
    buttonContainer2.innerHTML = '';
    buttonContainer3.innerHTML = '';
}

document.addEventListener("DOMContentLoaded", function () {
    fetchData("womenObj");
});