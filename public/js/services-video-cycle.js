document.addEventListener('DOMContentLoaded', function() {
    const videoElement = document.getElementById('services-hero-video');
    const videos = [
        'video/6799742-uhd_2160_3840_30fps.mp4',
        'video/6700653-uhd_3840_2160_25fps.mp4',
        'video/4873109-hd_1920_1080_25fps.mp4'
    ];
    let currentVideoIndex = 0;

    videoElement.addEventListener('ended', function() {
        currentVideoIndex = (currentVideoIndex + 1) % videos.length;
        videoElement.src = videos[currentVideoIndex];
        videoElement.play();
    });
});
