document.addEventListener('DOMContentLoaded', function() {
    const videoElement = document.getElementById('index-hero-video');
    const videos = [
        'video/2450251-uhd_3840_2160_30fps.mp4',
        'video/6700011-uhd_2160_3840_25fps.mp4',
        'video/855388-uhd_3840_2160_25fps.mp4'
    ];
    let currentVideoIndex = 0;

    videoElement.addEventListener('ended', function() {
        currentVideoIndex = (currentVideoIndex + 1) % videos.length;
        videoElement.src = videos[currentVideoIndex];
        videoElement.play();
    });
});
