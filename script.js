console.log("Lets start")
let currentSong = new Audio();
let songs;

// function use conversion between seconds top minutes
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];


        const decodedHref = decodeURIComponent(element.href);  // Decodes %5C to \
        if (decodedHref.endsWith(".m4a") && decodedHref.includes("\\songs\\")) {
            const songName = decodedHref.split("\\songs\\")[1];
            songs.push(songName);  // "32 gaj ka daman.mp3"
        }




    }
    return songs
}
const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/"+track)
    currentSong.src = "/songs/" + track
    if (!pause) {

        currentSong.play()

        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtimer").innerHTML = "00:00/00:00"
}
async function main() {

    // get songs
    songs = await getSongs()
    playMusic(songs[0], true)

    //Show all the songs in playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `          <li>
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div class="overflow">${song.replaceAll("%20", " ")}</div>
            

                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div> </li>`;
    }

    //play the songs
    var audio = new Audio(songs[0]);
    audio.play();

    audio.addEventListener("loadeddata", () => {
        console.log(audio.duration, audio.currentSrc, audio.currentTime)
    })
    //Attach event listner
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    //Attach an event listioner to play , previous and next buttons
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })
    //event listioner for correct time
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtimer").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add an event listioner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })
    //Add an event listioner for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
     document.querySelector(".card").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //Add an event listioner for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })

    //Add an event listioner to previouse
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index - 1 >= 0) {
            playMusic(songs[index - 1])
        }
    })

    //Add an event listioner to next
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //Add an event listioner to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })
}

main()