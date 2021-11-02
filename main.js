const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'TP_PLAYER';

const playList = $('.playlist');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    songs: [
        {
            name: 'Âm thầm bên em',
            singer: 'Sơn Tùng M-TP',
            path: 'https://data37.chiasenhac.com/downloads/1897/2/1896712-abb56395/320/Am%20Tham%20Ben%20Em%20-%20Son%20Tung%20M-TP.mp3',
            image: 'https://i1.sndcdn.com/artworks-000127944718-xiampb-t500x500.jpg',
        },
        {
            name: 'Lạc trôi',
            singer: 'Sơn Tùng M-TP',
            path: 'https://data38.chiasenhac.com/downloads/1897/2/1896718-b91ec523/320/Lac%20Troi%20-%20Son%20Tung%20M-TP.mp3',
            image: 'https://upload.wikimedia.org/wikipedia/vi/5/5d/Lac_troi_single_sontungmtp.jpg',
        },
        {
            name: 'Nắng ấm xa dần',
            singer: 'Sơn Tùng M-TP',
            path: 'https://data55.chiasenhac.com/downloads/1140/2/1139168-5eb4d16a/128/Nang%20Am%20Xa%20Dan%20-%20Son%20Tung%20M-TP.mp3',
            image: 'https://i1.sndcdn.com/artworks-000074934918-7i3203-t500x500.jpg',
        },
        {
            name: 'Nơi này có anh',
            singer: 'Sơn Tùng M-TP',
            path: 'https://data37.chiasenhac.com/downloads/1897/2/1896719-828a80eb/320/Noi%20Nay%20Co%20Anh%20-%20Son%20Tung%20M-TP.mp3',
            image: 'https://i.ytimg.com/vi/FN7ALfpGxiI/maxresdefault.jpg',
        },
        {
            name: 'Chúng Ta Không Thuộc Về Nhau',
            singer: 'Sơn Tùng M-TP',
            path: 'https://data2.chiasenhac.com/stream2/1699/2/1698220-b2544de6/320/Chung%20Ta%20Khong%20Thuoc%20Ve%20Nhau%20-%20Son%20Tung.mp3',
            image: 'https://avatar-ex-swe.nixcdn.com/song/2017/08/21/9/2/c/9/1503305440699_640.jpg',
        },
        {
            name: 'Khuôn Mặt Đáng Thương',
            singer: 'Sơn Tùng M-TP',
            path: 'https://vnno-vn-6-tf-mp3-s1-m-zmp3.zadn.vn/368aa633ca7723297a66/609492096351692308?authen=exp=1636043588~acl=/368aa633ca7723297a66/*~hmac=43e2d980d2a6aa2511081ba8d8b70055&fs=MTYzNTg3MDmUsIC4ODQ4NHx3ZWJWNnwxMDExNjQ2NjAwfDIyMi4yNTQdUngMjMdUngMTk0&filename=Khuon-Mat-Dang-Thuong-Son-Tung-M-TP.mp3',
            image: 'https://i.ytimg.com/vi/LCyo565N_5w/maxresdefault.jpg',
        },
        {
            name: 'Em Của Ngày Hôm Qua',
            singer: 'Sơn Tùng M-TP',
            path: 'https://data01.chiasenhac.com/downloads/1371/2/1370436-f99f06c0/320/Em%20Cua%20Ngay%20Hom%20Qua%20-%20Son%20Tung%20M-TP.mp3',
            image: 'https://upload.wikimedia.org/wikipedia/vi/5/5d/Em_c%E1%BB%A7a_ng%C3%A0y_h%C3%B4m_qua.png',
        },
        {
            name: 'Cơn Mưa Ngang Qua',
            singer: 'Sơn Tùng M-TP',
            path: 'https://data53.chiasenhac.com/downloads/1065/2/1064301-d2e5f10b/320/Con%20Mua%20Ngang%20Qua%20-%20Son%20Tung%20M-TP.mp3',
            image: 'https://avatar-ex-swe.nixcdn.com/song/2018/03/30/b/1/8/8/1522404482076_640.jpg',
        },
        {
            name: 'Remember Me',
            singer: 'Sơn Tùng M-TP',
            path: 'https://data2.chiasenhac.com/stream2/1604/2/1603158-ca4f3a88/320/Remember%20Me%20-%20Son%20Tung%20M-TP.mp3',
            image: 'https://avatar-ex-swe.nixcdn.com/song/2017/11/28/a/e/5/a/1511831531641_640.jpg',
        },
        {
            name: 'Buông Đôi Tay Nhau Ra',
            singer: 'Sơn Tùng M-TP',
            path: 'https://data38.chiasenhac.com/downloads/1897/2/1896329-95401bd0/320/Buong%20Doi%20Tay%20Nhau%20Ra%20-%20Son%20Tung%20M-TP.mp3',
            image: 'https://upload.wikimedia.org/wikipedia/vi/c/c0/Buongdoitaynhauramtp.jpg',
        },
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${
                index === this.currentIndex ? 'active' : ''
            }" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
        });
        playList.innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        const cdThumbAnimate = cdThumb.animate(
            [
                {
                    transform: 'rotate(360deg)',
                },
            ],
            {
                duration: 10000,
                iterations: Infinity,
            }
        );

        cdThumbAnimate.pause();

        document.onscroll = function () {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            audio.onplay = function () {
                _this.isPlaying = true;
                player.classList.add('playing');
                cdThumbAnimate.play();
            };
            audio.onpause = function () {
                _this.isPlaying = false;
                player.classList.remove('playing');
                cdThumbAnimate.pause();
            };

            audio.ontimeupdate = function () {
                if (audio.duration) {
                    const progressPercent = Math.floor(
                        (audio.currentTime / audio.duration) * 100
                    );
                    progress.value = progressPercent;
                }
            };

            progress.oninput = function (event) {
                const seekTime = (event.target.value / 100) * audio.duration;
                audio.currentTime = seekTime;
            };
        };

        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            this.classList.toggle('active', _this.isRandom);
        };

        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            this.classList.toggle('active', _this.isRepeat);
        };

        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        playList.onclick = function (event) {
            const songNode = event.target.closest('.song:not(.active)');
            if (songNode || event.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                }
            }
        };
    },

    scrollToActiveSong: function () {
        setTimeout(function () {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
        }, 100);
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    nextSong: function () {
        this.currentIndex++;
        console.log(this.currentIndex);
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    prevSong: function () {
        this.currentIndex--;
        console.log(this.currentIndex);
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function () {
        this.loadConfig();
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    },
};

app.start();
