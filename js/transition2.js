document.addEventListener("DOMContentLoaded", function () {
    const transition = document.getElementById("page-transition");
    const lottieContainer = document.getElementById("lottie-animation");

    const animation = lottie.loadAnimation({
        container: lottieContainer,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "../json/Animation - 1738652847228.json" // Replace with your actual Lottie file path
    });

    function playTransition(url) {
        transition.style.opacity = "1";
        transition.style.pointerEvents = "all";
        animation.goToAndPlay(0, true);

        animation.addEventListener("complete", () => {
            window.location.href = url;
        });
    }

    document.querySelectorAll("a").forEach(link => {
        if (link.href.includes(window.location.origin)) {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                playTransition(this.href);
            });
        }
    });

    setTimeout(() => {
        transition.style.opacity = "0";
        setTimeout(() => {
            transition.style.pointerEvents = "none";
        }, 500);
    }, 500);
});
