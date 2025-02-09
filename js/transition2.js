document.addEventListener("DOMContentLoaded", function () {
    const transition = document.getElementById("page-transition");
    const lottieContainer = document.getElementById("lottie-animation");

    const animation = lottie.loadAnimation({
        container: lottieContainer,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "/json/Animation - 1738652847228.json" // Ensure this is correct
    });

    function playTransition(url) {
        transition.style.opacity = "1";
        transition.style.display = "block"; // Ensure visibility
        transition.style.pointerEvents = "all";

        animation.goToAndPlay(0, true);

        // Ensure the transition redirects correctly
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

    // Ensure transition fades out on load
    setTimeout(() => {
        transition.style.opacity = "0";
        setTimeout(() => {
            transition.style.pointerEvents = "none";
            transition.style.display = "none"; // Hide completely after fading out
        }, 500);
    }, 500);
});
